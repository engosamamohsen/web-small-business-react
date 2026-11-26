import { beforeEach, describe, expect, it } from "vitest";
import sax from "sax";
import {
    CACHE_TTL_MS,
    LEGACY_CONCURRENCY,
    LEGACY_PAGE_SIZE,
    MAX_URLS,
    RETRY_AFTER_SECONDS,
    clearSitemapCache,
    setSitemapCacheMaxBytes,
    sitemapCacheStats,
    stringMemoryBytes,
    CACHE_ENTRY_OVERHEAD_BYTES,
    STALE_MAX_AGE_SECONDS,
    forgetSitemap,
    sitemapStaleMaxMs,
    sitemapApiTimeoutMs,
    sitemapTrust,
    sitemapStoreKey,
    sitemapResponse,
    type FetchResult,
    type SitemapFetcher,
} from "@/lib/sitemap";

// F1 (docs/seo-merchant-data-plan.md, 2026-11-26): sitemap.xml is complete or a 503, never partial,
// and a failure never replaces a good cached copy.

const SUB = "https://emand.cashierthru.com";
const CUSTOM = "https://emandbuild.com";
const API = "https://admin-emand.cashierthru.com/api/";

const okRes = (data: any): FetchResult => ({ ok: true, status: 200, data });
const fail = (status: number, error = "failed"): FetchResult => ({ ok: false, status, data: null, error });

function products(n: number, from = 1) {
    return Array.from({ length: n }, (_, i) => ({ id: from + i, slug: `item-${from + i}`, name: `منتج ${from + i}` }));
}
const categories = [
    { id: 1, name: "الفراخ" },
    { id: 2, name: "اللحوم" },
];

function sitemapApi(p = products(3), c = categories): FetchResult {
    return okRes({ status: true, data: { products: p, categories: c, counts: { products: p.length, categories: c.length } } });
}

/** A fake store API: answers by path, records every call. */
function fakeApi(routes: (path: string) => FetchResult | Promise<FetchResult>) {
    const calls: string[] = [];
    let inFlight = 0;
    let maxInFlight = 0;
    const fetcher: SitemapFetcher = async (path) => {
        calls.push(path);
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise((r) => setTimeout(r, 1));
        try {
            return await routes(path);
        } finally {
            inFlight--;
        }
    };
    return { fetcher, calls, maxInFlight: () => maxInFlight };
}

/** The old store API: no v1/sitemap, v1/product pages of 48, v1/categories with products_active. */
function legacyApi(total: number, override?: (path: string) => FetchResult | null) {
    const all = products(total);
    const lastPage = Math.max(1, Math.ceil(total / LEGACY_PAGE_SIZE));
    return fakeApi((path) => {
        const o = override?.(path);
        if (o) return o;
        if (path === "v1/sitemap") return fail(404, "Not Found");
        if (path === "v1/categories") {
            return okRes({ data: { data: [{ id: 1, name: "الفراخ", products_active: [{ id: 1 }] }, { id: 9, name: "فاضي", products_active: [] }] } });
        }
        const m = /^v1\/product\?page=(\d+)&limit=(\d+)$/.exec(path);
        if (m) {
            const page = Number(m[1]);
            const size = Number(m[2]);
            return okRes({ data: all.slice((page - 1) * size, page * size), pagination: { last_page: lastPage, total } });
        }
        return fail(404);
    });
}

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

async function run(origin: string, fetcher: SitemapFetcher, extra: Partial<Parameters<typeof sitemapResponse>[0]> = {}) {
    const logs: string[] = [];
    // Every request in these tests comes from the same store unless a test says otherwise
    const res = await sitemapResponse({ origin, apiBase: API, fetcher, log: (l) => logs.push(l), storeKey: "store-A", ...extra });
    return { res, body: await res.text(), logs };
}

beforeEach(() => clearSitemapCache());

describe("sitemap.xml from v1/sitemap", () => {
    it("lists every product and category from ONE store API call", async () => {
        const api = fakeApi((path) => (path === "v1/sitemap" ? sitemapApi() : fail(500)));
        const { res, body } = await run(SUB, api.fetcher);

        expect(res.status).toBe(200);
        expect(res.headers.get("Cache-Control")).toBe("public, max-age=3600");
        expect(res.headers.get("Content-Type")).toContain("application/xml");
        expect(api.calls).toEqual(["v1/sitemap"]);
        const urls = locs(body);
        expect(urls[0]).toBe(`${SUB}/`);
        expect(urls).toContain(`${SUB}/reviews`);
        expect(urls).toContain(`${SUB}/?category=1-%D8%A7%D9%84%D9%81%D8%B1%D8%A7%D8%AE`);
        expect(urls).toContain(`${SUB}/product/1/%D9%85%D9%86%D8%AA%D8%AC-1`);
        expect(urls).toHaveLength(2 + 2 + 3);
    });

    it("keeps a large catalogue whole (5,000 products)", async () => {
        const api = fakeApi(() => sitemapApi(products(5000)));
        const { res, body } = await run(SUB, api.fetcher);

        expect(res.status).toBe(200);
        expect(locs(body).filter((u) => u.includes("/product/"))).toHaveLength(5000);
        expect(api.calls).toHaveLength(1);
    });

    it("uses the address the visitor used: the custom domain and the cashierthru address each get their own", async () => {
        const api = fakeApi(() => sitemapApi());
        const custom = await run(CUSTOM, api.fetcher);
        const sub = await run(SUB, api.fetcher);

        expect(locs(custom.body).every((u) => u.startsWith(`${CUSTOM}/`))).toBe(true);
        expect(locs(sub.body).every((u) => u.startsWith(`${SUB}/`))).toBe(true);
        expect(api.calls).toHaveLength(2); // one cache entry per address
    });

    it.each([
        ["rate limited (429)", fail(429, "Too Many Attempts.")],
        ["server error (500)", fail(500)],
        ["timeout", fail(408, "Request timed out")],
        ["broken body", okRes({ status: true, data: { products: "nope" } })],
        ["counts do not match", okRes({ status: true, data: { products: products(2), categories: [], counts: { products: 3, categories: 0 } } })],
    ])("answers 503, never a partial sitemap, when v1/sitemap fails: %s", async (_label, answer) => {
        const api = fakeApi(() => answer);
        const { res, body, logs } = await run(SUB, api.fetcher);

        expect(res.status).toBe(503);
        expect(res.headers.get("Cache-Control")).toBe("no-store");
        expect(res.headers.get("Retry-After")).toBe(String(RETRY_AFTER_SECONDS));
        expect(body).not.toContain("<urlset");
        expect(logs).toHaveLength(1);
        const log = JSON.parse(logs[0]);
        expect(log).toMatchObject({ event: "sitemap_failed", site: SUB, api: API, step: "v1/sitemap" });
        expect(log.status).toBe(answer.status);
    });

    it("refuses (503) rather than cut a catalogue above the 50,000-address limit of one file", async () => {
        const api = fakeApi(() => sitemapApi(products(MAX_URLS)));
        const { res, logs } = await run(SUB, api.fetcher);

        expect(res.status).toBe(503);
        expect(JSON.parse(logs[0]).step).toBe("render");
    });
});

describe("sitemap.xml from an older store API (no v1/sitemap)", () => {
    it("walks every page, a few at a time, and lists the whole catalogue (739 products, like emandbuild.com)", async () => {
        const api = legacyApi(739);
        const { res, body } = await run(SUB, api.fetcher);

        expect(res.status).toBe(200);
        expect(locs(body).filter((u) => u.includes("/product/"))).toHaveLength(739);
        expect(locs(body).filter((u) => u.includes("?category="))).toHaveLength(1); // the empty category is left out
        expect(api.calls.filter((c) => c.startsWith("v1/product"))).toHaveLength(Math.ceil(739 / LEGACY_PAGE_SIZE));
        expect(api.maxInFlight()).toBeLessThanOrEqual(LEGACY_CONCURRENCY);
    });

    it("answers 503 when one product page is rate limited", async () => {
        const api = legacyApi(739, (path) => (path.startsWith("v1/product?page=7&") ? fail(429, "Too Many Attempts.") : null));
        const { res, body, logs } = await run(SUB, api.fetcher);

        expect(res.status).toBe(503);
        expect(body).not.toContain("<urlset");
        expect(JSON.parse(logs[0])).toMatchObject({ step: "v1/product page 7", status: 429 });
    });

    it("answers 503 when the pages hold fewer products than the total", async () => {
        const api = legacyApi(100, (path) =>
            path.startsWith("v1/product?page=2&") ? okRes({ data: [], pagination: { last_page: 3, total: 100 } }) : null,
        );
        const { res } = await run(SUB, api.fetcher);

        expect(res.status).toBe(503);
    });

    it("answers 503 when the categories fail", async () => {
        const api = legacyApi(10, (path) => (path === "v1/categories" ? fail(429) : null));
        const { res, logs } = await run(SUB, api.fetcher);

        expect(res.status).toBe(503);
        expect(JSON.parse(logs[0]).step).toBe("v1/categories");
    });
});

describe("booking stores", () => {
    it("adds the services when the catalogue loads", async () => {
        const api = fakeApi(() => sitemapApi());
        const { res, body } = await run(SUB, api.fetcher, { loadServices: async () => ({ services: [{ slug: "5-haircut" }] }) });

        expect(res.status).toBe(200);
        expect(locs(body)).toContain(`${SUB}/services`);
        expect(locs(body).some((u) => u.includes("5-haircut"))).toBe(true);
    });

    it("answers 503 when the services fail (a sitemap without them would be partial)", async () => {
        const api = fakeApi(() => sitemapApi());
        const { res, logs } = await run(SUB, api.fetcher, {
            loadServices: async () => {
                throw Object.assign(new Error("Too Many Attempts."), { status: 429 });
            },
        });

        expect(res.status).toBe(503);
        expect(JSON.parse(logs[0])).toMatchObject({ step: "v1/booking/services", status: 429 });
    });
});

describe("the cache of complete sitemaps", () => {
    it("reuses a complete sitemap for a few minutes without calling the store API", async () => {
        let t = 1_000;
        const api = fakeApi(() => sitemapApi());
        await run(SUB, api.fetcher, { now: () => t });
        t += CACHE_TTL_MS - 1;
        const again = await run(SUB, api.fetcher, { now: () => t });

        expect(again.res.status).toBe(200);
        expect(api.calls).toHaveLength(1);
    });

    it("never stores a failure: the next request asks the store API again", async () => {
        let answer: FetchResult = fail(429);
        const api = fakeApi(() => answer);
        expect((await run(SUB, api.fetcher)).res.status).toBe(503);

        answer = sitemapApi();
        const next = await run(SUB, api.fetcher);
        expect(next.res.status).toBe(200);
        expect(api.calls).toHaveLength(2);
    });

    it("a failure never replaces the good copy: the next good sitemap is complete, and a failed one is never served", async () => {
        let t = 0;
        let answer: FetchResult = sitemapApi(products(3));
        const api = fakeApi(() => answer);
        const first = await run(SUB, api.fetcher, { now: () => t });
        expect(first.res.status).toBe(200);

        // After the cache time the store API is busy: 503, nothing partial
        t += CACHE_TTL_MS + 1;
        answer = okRes({ status: true, data: { products: products(1), categories: [], counts: { products: 2, categories: 0 } } });
        const busy = await run(SUB, api.fetcher, { now: () => t });
        expect(busy.res.status).toBe(503);

        // The good copy is still the one stored: read it back inside its own time window
        const callsBefore = api.calls.length;
        const stored = await run(SUB, api.fetcher, { now: () => 1 });
        expect(stored.res.status).toBe(200);
        expect(locs(stored.body).filter((u) => u.includes("/product/"))).toHaveLength(3);
        expect(api.calls).toHaveLength(callsBefore);

        // Recovered: a full sitemap again
        t += 1;
        answer = sitemapApi(products(4));
        const recovered = await run(SUB, api.fetcher, { now: () => t });
        expect(recovered.res.status).toBe(200);
        expect(locs(recovered.body).filter((u) => u.includes("/product/"))).toHaveLength(4);
    });
});

describe("request coalescing (one build per address at a time)", () => {
    it("20 simultaneous requests for one address make ONE store API call and all get the same complete sitemap", async () => {
        const api = fakeApi(async () => {
            await new Promise((r) => setTimeout(r, 20));
            return sitemapApi(products(500));
        });
        const results = await Promise.all(Array.from({ length: 20 }, () => run(SUB, api.fetcher)));

        expect(api.calls).toEqual(["v1/sitemap"]);
        expect(new Set(results.map((r) => r.res.status))).toEqual(new Set([200]));
        expect(new Set(results.map((r) => r.body)).size).toBe(1);
        expect(locs(results[0].body).filter((u) => u.includes("/product/"))).toHaveLength(500);
        expect(sitemapCacheStats().inFlight).toBe(0);
    });

    it("after the cache expires, a burst again makes only one call", async () => {
        let t = 0;
        const api = fakeApi(() => sitemapApi());
        await run(SUB, api.fetcher, { now: () => t });
        t += CACHE_TTL_MS + 1;
        const burst = await Promise.all(Array.from({ length: 20 }, () => run(SUB, api.fetcher, { now: () => t })));

        expect(api.calls).toHaveLength(2);
        expect(burst.every((r) => r.res.status === 200)).toBe(true);
    });

    it("every waiter gets the 503 when the shared build fails, it is logged once, and the next request tries again", async () => {
        let answer: FetchResult = fail(429, "Too Many Attempts.");
        const api = fakeApi(async () => {
            await new Promise((r) => setTimeout(r, 10));
            return answer;
        });
        const logs: string[] = [];
        const results = await Promise.all(
            Array.from({ length: 20 }, () => sitemapResponse({ origin: SUB, apiBase: API, fetcher: api.fetcher, log: (l) => logs.push(l) })),
        );

        expect(api.calls).toHaveLength(1);
        expect(results.every((r) => r.status === 503 && r.headers.get("Cache-Control") === "no-store")).toBe(true);
        expect(logs).toHaveLength(1);
        expect(sitemapCacheStats()).toMatchObject({ entries: 0, inFlight: 0 });

        answer = sitemapApi();
        expect((await run(SUB, api.fetcher)).res.status).toBe(200);
        expect(api.calls).toHaveLength(2);
    });

    it("a thrown error (not a failed answer) also reaches every waiter as a 503", async () => {
        const api = fakeApi(async () => {
            throw new Error("socket hang up");
        });
        const results = await Promise.all(Array.from({ length: 5 }, () => run(SUB, api.fetcher)));

        expect(results.every((r) => r.res.status === 503)).toBe(true);
        expect(api.calls).toHaveLength(1);
    });

    it("different addresses build independently: one store's slow or failing build never holds up another", async () => {
        const slowApi = fakeApi(async () => {
            await new Promise((r) => setTimeout(r, 50));
            return fail(500);
        });
        const fastApi = fakeApi(() => sitemapApi());
        const slow = run("https://slow-store.cashierthru.com", slowApi.fetcher);
        const custom = await run(CUSTOM, fastApi.fetcher);
        const sub = await run(SUB, fastApi.fetcher);

        expect(custom.res.status).toBe(200);
        expect(sub.res.status).toBe(200);
        expect(sitemapCacheStats().inFlight).toBe(1); // the slow one is still building
        expect((await slow).res.status).toBe(503);
        expect(fastApi.calls).toHaveLength(2); // one per address, never shared across addresses
        expect(locs(custom.body).every((u) => u.startsWith(CUSTOM + "/"))).toBe(true);
        expect(locs(sub.body).every((u) => u.startsWith(SUB + "/"))).toBe(true);
    });
});

describe("the cache size limit (least recently used first)", () => {
    const sizeOf = async (n: number, origin = "https://measure.test") => {
        clearSitemapCache();
        const r = await run(origin, fakeApi(() => sitemapApi(products(n))).fetcher);
        clearSitemapCache();
        return stringMemoryBytes(r.body);
    };

    it("defaults to 100 MB", () => {
        expect(sitemapCacheStats().maxBytes).toBe(100 * 1024 * 1024);
    });

    it("never goes over the limit and drops the least recently used address first", async () => {
        const one = await sizeOf(200, "https://store9.cashierthru.com"); // same length as every store below
        const site = (i: number) => "https://store" + i + ".cashierthru.com";
        setSitemapCacheMaxBytes(one * 3 + 10); // room for three stores
        const api = fakeApi(() => sitemapApi(products(200)));

        for (const i of [1, 2, 3]) await run(site(i), api.fetcher);
        await run(site(1), api.fetcher); // store 1 used again: store 2 is now the oldest
        await run(site(4), api.fetcher);

        const stats = sitemapCacheStats();
        expect(stats.bytes).toBeLessThanOrEqual(stats.maxBytes);
        expect(stats.origins).toEqual([site(3), site(1), site(4)]);
        expect(api.calls).toHaveLength(4); // store 1's second read came from the cache
    });

    it("keeps its byte count exact through expiry, replacement and eviction", async () => {
        let t = 0;
        const api = fakeApi(() => sitemapApi(products(50)));
        await run(SUB, api.fetcher, { now: () => t });
        await run(CUSTOM, api.fetcher, { now: () => t });
        const both = sitemapCacheStats().bytes;
        t += CACHE_TTL_MS + 1;
        await run(SUB, api.fetcher, { now: () => t }); // expired entry replaced by a same-size one
        expect(sitemapCacheStats().bytes).toBe(both);
        setSitemapCacheMaxBytes(0);
        expect(sitemapCacheStats()).toMatchObject({ entries: 0, bytes: 0 });
    });

    it("serves a sitemap larger than the whole limit but does not keep it, and keeps the other stores", async () => {
        const small = await sizeOf(10);
        setSitemapCacheMaxBytes(small * 2 + 10);
        await run(SUB, fakeApi(() => sitemapApi(products(10))).fetcher);

        const big = await run(CUSTOM, fakeApi(() => sitemapApi(products(2000))).fetcher);

        expect(big.res.status).toBe(200);
        expect(locs(big.body).filter((u) => u.includes("/product/"))).toHaveLength(2000);
        expect(JSON.parse(big.logs[0])).toMatchObject({ event: "sitemap_not_cached", site: CUSTOM });
        expect(sitemapCacheStats().origins).toEqual([SUB]);
        expect(sitemapCacheStats().bytes).toBeLessThanOrEqual(sitemapCacheStats().maxBytes);
    });

    it("dropping an entry never cuts a sitemap that is already being sent", async () => {
        const one = await sizeOf(300, SUB); // the longer of the two addresses
        setSitemapCacheMaxBytes(one + 10); // room for one store only
        const api = fakeApi(() => sitemapApi(products(300)));
        const first = await sitemapResponse({ origin: SUB, apiBase: API, fetcher: api.fetcher, log: () => {} });
        await run(CUSTOM, api.fetcher); // evicts SUB

        expect(sitemapCacheStats().origins).toEqual([CUSTOM]);
        const body = await first.text();
        expect(locs(body).filter((u) => u.includes("/product/"))).toHaveLength(300);
        expect(body.endsWith("</urlset>\n")).toBe(true);
    });

    it("holds many large stores within the limit (10 stores of 10,000 products in a 15 MB cache)", async () => {
        const big = products(10_000);
        setSitemapCacheMaxBytes(15 * 1024 * 1024);
        const api = fakeApi(() => sitemapApi(big));
        for (let i = 1; i <= 10; i++) {
            const r = await run("https://big" + i + ".example.com", api.fetcher);
            expect(locs(r.body).filter((u) => u.includes("/product/"))).toHaveLength(10_000);
            expect(sitemapCacheStats().bytes).toBeLessThanOrEqual(15 * 1024 * 1024);
        }
        const stats = sitemapCacheStats();
        expect(stats.entries).toBeGreaterThan(0);
        expect(stats.entries).toBeLessThan(10);
        expect(stats.origins[stats.origins.length - 1]).toBe("https://big10.example.com");
    });
});

describe("Arabic and special characters", () => {
    it("keeps Arabic names, diacritics and symbols correct and the XML well-formed", async () => {
        const named = [
            { id: 1, slug: "a", name: "بديل خشب PVC لوح 60×120 — لون بُنّي" },
            { id: 2, slug: "b", name: 'كرانيش & بانوهات <PS> "جديد"' },
            { id: 3, slug: "c", name: "قهوة تركي ☕ 'مظبوط'" },
            { id: 4, slug: "d", name: "Café crème & co" },
        ];
        const cats = [{ id: 7, name: "ديكورات & تشطيبات" }];
        const api = fakeApi(() => sitemapApi(named, cats));
        const { res, body } = await run(CUSTOM, api.fetcher);

        expect(res.status).toBe(200);
        // No raw markup or bare ampersands inside an address
        for (const loc of locs(body)) {
            expect(loc).not.toMatch(/[<>"']/);
            expect(loc).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
        }
        const decoded = locs(body).map((u) => decodeURI(u.replace(/&amp;/g, "&")));
        expect(decoded.some((u) => u.includes("/product/1/") && u.includes("بديل"))).toBe(true);
        expect(decoded.some((u) => u.includes("/product/2/") && u.includes("كرانيش"))).toBe(true);
        expect(decoded.some((u) => u.includes("?category=7") && u.includes("ديكورات"))).toBe(true);
        expect(locs(body).filter((u) => u.includes("/product/"))).toHaveLength(4);
    });
});

describe("the cache counts real memory, not bytes on the wire", () => {
    it("counts an ASCII sitemap at 1 byte a character plus a fixed overhead", () => {
        expect(stringMemoryBytes("a".repeat(1000))).toBe(1000 + CACHE_ENTRY_OVERHEAD_BYTES);
    });

    it("counts any text with a character beyond Latin-1 at 2 bytes a character (how V8 stores it)", () => {
        const arabic = "بديل خشب"; // 8 characters, 15 UTF-8 bytes, 16 bytes in V8
        expect(stringMemoryBytes(arabic)).toBe(arabic.length * 2 + CACHE_ENTRY_OVERHEAD_BYTES);
        expect(stringMemoryBytes("abc€")).toBe(4 * 2 + CACHE_ENTRY_OVERHEAD_BYTES);
    });

    it("a real Arabic-catalogue sitemap is plain ASCII, so the count equals its length", async () => {
        const api = fakeApi(() => sitemapApi(products(100)));
        const { body } = await run(CUSTOM, api.fetcher);
        expect([...body].every((ch) => ch.charCodeAt(0) < 128)).toBe(true); // plain ASCII
        expect(sitemapCacheStats().bytes).toBe(body.length + CACHE_ENTRY_OVERHEAD_BYTES);
    });
});

describe("last known-good sitemap: who may have it (sitemapTrust)", () => {
    const base = { customDomain: false, domainStatus: null, tenantUnknown: false, settingsOk: true, access: "open" } as const;

    it.each([
        ["an open store on its cashierthru address", base, true, false],
        ["an open store on a connected custom domain", { ...base, customDomain: true, domainStatus: "connected" }, true, false],
        ["the backend did not answer the settings call (fail open)", { ...base, settingsOk: false }, false, false],
        ["the custom domain lookup failed (backend down)", { ...base, customDomain: true, domainStatus: "error" }, false, false],
        ["the custom domain was never looked up", { ...base, customDomain: true, domainStatus: null }, false, false],
        ["the custom domain is unknown (disconnected)", { ...base, customDomain: true, domainStatus: "unknown" }, false, true],
        ["the store's plan expired (suspended)", { ...base, access: "expired" }, false, true],
        ["the store is gone", { ...base, settingsOk: false, access: "missing" }, false, true],
        ["the host is not a known store", { ...base, tenantUnknown: true }, false, false],
        ["no access decision was made", { ...base, access: null }, false, false],
    ])("%s → verified %s, forget %s", (_label, input, verified, forget) => {
        const trust = sitemapTrust(input as any);
        expect(trust.verified).toBe(verified);
        expect(trust.forget).toBe(forget);
        expect(trust.verified).toBe(trust.storeVerified && trust.domainVerified);
    });
});

describe("last known-good sitemap: serving it", () => {
    const failing = () => fakeApi(() => fail(429, "Too Many Attempts."));
    async function goodCopy(origin: string, t0: number, n = 3) {
        const r = await run(origin, fakeApi(() => sitemapApi(products(n))).fetcher, { now: () => t0 });
        expect(r.res.status).toBe(200);
        return r.body;
    }

    it("serves the last complete copy with a 5-minute cache header, X-Sitemap-Stale and a log line when the store is confirmed", async () => {
        const good = await goodCopy(CUSTOM, 0);
        const t = CACHE_TTL_MS + 60_000; // rebuild needed, copy is 11 minutes old
        const { res, body, logs } = await run(CUSTOM, failing().fetcher, { now: () => t, staleAllowed: true });

        expect(res.status).toBe(200);
        expect(body).toBe(good);
        expect(res.headers.get("Cache-Control")).toBe("public, max-age=" + STALE_MAX_AGE_SECONDS);
        expect(STALE_MAX_AGE_SECONDS).toBe(300);
        expect(res.headers.get("X-Sitemap-Stale")).toBe(String(Math.floor(t / 1000)));
        expect(res.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
        expect(logs.map((l) => JSON.parse(l).event)).toEqual(["sitemap_failed", "sitemap_served_stale"]);
        expect(JSON.parse(logs[1])).toMatchObject({ site: CUSTOM, age_seconds: Math.floor(t / 1000), step: "v1/sitemap", status: 429 });
    });

    it("503 when the middleware could not confirm the store or domain (backend unavailable)", async () => {
        await goodCopy(CUSTOM, 0);
        const { res, body, logs } = await run(CUSTOM, failing().fetcher, { now: () => CACHE_TTL_MS + 1, staleAllowed: false });

        expect(res.status).toBe(503);
        expect(res.headers.get("X-Sitemap-Stale")).toBeNull();
        expect(body).not.toContain("<urlset");
        expect(logs.map((l) => JSON.parse(l).event)).toEqual(["sitemap_failed"]);
    });

    it("503 when the copy is older than 24 hours, and the old copy is dropped", async () => {
        await goodCopy(SUB, 0);
        const day = 24 * 60 * 60 * 1000;
        const { res } = await run(SUB, failing().fetcher, { now: () => day + 1, staleAllowed: true });

        expect(res.status).toBe(503);
        expect(sitemapCacheStats().origins).not.toContain(SUB);
    });

    it("a copy exactly 24 hours old is still served", async () => {
        await goodCopy(SUB, 0);
        const { res } = await run(SUB, failing().fetcher, { now: () => 24 * 60 * 60 * 1000, staleAllowed: true });
        expect(res.status).toBe(200);
    });

    it("the 24 hours can be changed (SITEMAP_STALE_MAX_HOURS)", async () => {
        process.env.SITEMAP_STALE_MAX_HOURS = "1";
        try {
            expect(sitemapStaleMaxMs()).toBe(60 * 60 * 1000);
            await goodCopy(SUB, 0);
            const { res } = await run(SUB, failing().fetcher, { now: () => 2 * 60 * 60 * 1000, staleAllowed: true });
            expect(res.status).toBe(503);
        } finally {
            delete process.env.SITEMAP_STALE_MAX_HOURS;
        }
        expect(sitemapStaleMaxMs()).toBe(24 * 60 * 60 * 1000);
    });

    it("different addresses never share a copy: the custom domain fails with only the subdomain's copy stored → 503", async () => {
        await goodCopy(SUB, 0);
        const { res, body } = await run(CUSTOM, failing().fetcher, { now: () => 1, staleAllowed: true });

        expect(res.status).toBe(503);
        expect(body).not.toContain(SUB);
    });

    it("each address gets only its own copy", async () => {
        const sub = await goodCopy(SUB, 0, 2);
        const custom = await goodCopy(CUSTOM, 0, 5);
        const t = CACHE_TTL_MS + 1;
        const a = await run(SUB, failing().fetcher, { now: () => t, staleAllowed: true });
        const b = await run(CUSTOM, failing().fetcher, { now: () => t, staleAllowed: true });

        expect(a.body).toBe(sub);
        expect(b.body).toBe(custom);
        expect(locs(a.body).every((u) => u.startsWith(SUB + "/"))).toBe(true);
        expect(locs(b.body).every((u) => u.startsWith(CUSTOM + "/"))).toBe(true);
    });

    it("a successful rebuild replaces the stale copy and the normal headers come back", async () => {
        await goodCopy(SUB, 0, 3);
        let t = CACHE_TTL_MS + 1;
        const stale = await run(SUB, failing().fetcher, { now: () => t, staleAllowed: true });
        expect(stale.res.headers.get("X-Sitemap-Stale")).not.toBeNull();

        const fresh = await run(SUB, fakeApi(() => sitemapApi(products(7))).fetcher, { now: () => t, staleAllowed: true });
        expect(fresh.res.status).toBe(200);
        expect(fresh.res.headers.get("Cache-Control")).toBe("public, max-age=3600");
        expect(fresh.res.headers.get("X-Sitemap-Stale")).toBeNull();
        expect(locs(fresh.body).filter((u) => u.includes("/product/"))).toHaveLength(7);

        // The next failure serves the NEW copy, young
        t += CACHE_TTL_MS + 5_000;
        const again = await run(SUB, failing().fetcher, { now: () => t, staleAllowed: true });
        expect(locs(again.body).filter((u) => u.includes("/product/"))).toHaveLength(7);
        expect(Number(again.res.headers.get("X-Sitemap-Stale"))).toBe(Math.floor((CACHE_TTL_MS + 5_000) / 1000));
    });

    it("forgetSitemap (store suspended or gone, domain disconnected) removes the copy: a later failure is a 503", async () => {
        await goodCopy(CUSTOM, 0);
        forgetSitemap(CUSTOM);
        expect(sitemapCacheStats().origins).not.toContain(CUSTOM);

        const { res } = await run(CUSTOM, failing().fetcher, { now: () => CACHE_TTL_MS + 1, staleAllowed: true });
        expect(res.status).toBe(503);
    });

    it("requests sharing one failed build each get what they are allowed: stale for confirmed, 503 for unconfirmed", async () => {
        await goodCopy(SUB, 0);
        const t = CACHE_TTL_MS + 1;
        const api = fakeApi(async () => {
            await new Promise((r) => setTimeout(r, 10));
            return fail(500);
        });
        const [allowed, notAllowed] = await Promise.all([
            run(SUB, api.fetcher, { now: () => t, staleAllowed: true }),
            run(SUB, api.fetcher, { now: () => t, staleAllowed: false }),
        ]);

        expect(api.calls).toHaveLength(1);
        expect(allowed.res.status).toBe(200);
        expect(notAllowed.res.status).toBe(503);
    });
});

describe("settings and their safe defaults", () => {
    const withEnv = (name: string, value: string | undefined, fn: () => void) => {
        const before = process.env[name];
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
        try {
            fn();
        } finally {
            if (before === undefined) delete process.env[name];
            else process.env[name] = before;
            clearSitemapCache();
        }
    };

    it.each([
        [undefined, 100],
        ["50", 50],
        ["0.5", 0.5],
        ["0", 100],
        ["-5", 100],
        ["abc", 100],
        ["", 100],
    ])("SITEMAP_CACHE_MAX_MB=%s → %s MB", (value, mb) => {
        withEnv("SITEMAP_CACHE_MAX_MB", value, () => {
            clearSitemapCache(); // the limit is read when the cache starts
            expect(sitemapCacheStats().maxBytes).toBe(Math.floor(mb * 1024 * 1024));
        });
    });

    it.each([
        [undefined, 24],
        ["48", 48],
        ["0", 0], // 0 switches the last known-good copy off
        ["-1", 24],
        ["abc", 24],
        ["", 24], // empty = not set
    ])("SITEMAP_STALE_MAX_HOURS=%s → %s hours", (value, hours) => {
        withEnv("SITEMAP_STALE_MAX_HOURS", value, () => {
            expect(sitemapStaleMaxMs()).toBe(hours * 60 * 60 * 1000);
        });
    });

    it.each([
        [undefined, 15_000],
        ["2000", 2000],
        ["0", 15_000],
        ["abc", 15_000],
    ])("SITEMAP_API_TIMEOUT_MS=%s → %s ms", (value, ms) => {
        withEnv("SITEMAP_API_TIMEOUT_MS", value, () => {
            expect(sitemapApiTimeoutMs()).toBe(ms);
        });
    });
});

describe("F1 review: an address that moves to another store", () => {
    it("a copy built for store A is never served (fresh or stale) once the address belongs to store B", async () => {
        const storeA = fakeApi(() => sitemapApi(products(4)));
        const a = await run(CUSTOM, storeA.fetcher, { storeKey: "A", now: () => 0 });
        expect(a.res.status).toBe(200);

        // Same address, now store B, within the 10-minute cache: rebuilt for B, not A's copy
        const storeB = fakeApi(() => sitemapApi(products(6, 100)));
        const b = await run(CUSTOM, storeB.fetcher, { storeKey: "B", now: () => 1000 });
        expect(storeB.calls).toEqual(["v1/sitemap"]);
        expect(locs(b.body).filter((u) => u.includes("/product/"))).toHaveLength(6);
        expect(b.body).not.toContain("/product/1/");
    });

    it("store B's failed build never falls back to store A's copy", async () => {
        await run(CUSTOM, fakeApi(() => sitemapApi(products(4))).fetcher, { storeKey: "A", now: () => 0 });
        const b = await run(CUSTOM, fakeApi(() => fail(429)).fetcher, { storeKey: "B", now: () => CACHE_TTL_MS + 1, staleAllowed: true });

        expect(b.res.status).toBe(503);
        expect(sitemapCacheStats().origins).not.toContain(CUSTOM); // A's copy dropped
    });

    it("no stale copy without a known store, even when the flags say confirmed", async () => {
        await run(SUB, fakeApi(() => sitemapApi()).fetcher, { storeKey: "A", now: () => 0 });
        const r = await run(SUB, fakeApi(() => fail(500)).fetcher, { storeKey: null, now: () => CACHE_TTL_MS + 1, staleAllowed: true });
        expect(r.res.status).toBe(503);
    });

    it("sitemapStoreKey tells stores apart and is null without settings", () => {
        const a = sitemapStoreKey("https://shop.test/api/", { created_at: "2026-01-01 10:00:00", name: "متجر ألف" });
        const b = sitemapStoreKey("https://shop.test/api/", { created_at: "2026-02-02 11:00:00", name: "متجر باء" });
        expect(a).not.toBe(b);
        expect(sitemapStoreKey("https://shop.test/api/", null)).toBeNull();
    });
});

describe("F1 review: the XML is valid for a real parser", () => {
    function parse(xml: string) {
        const parser = sax.parser(true, { xmlns: true }); // strict: any malformed XML throws
        const urls: string[] = [];
        const stack: string[] = [];
        let text = "";
        let rootNs = "";
        parser.onopentag = (node: any) => {
            stack.push(node.local);
            if (stack.length === 1) rootNs = node.uri;
            text = "";
        };
        parser.ontext = (t: string) => {
            text += t;
        };
        parser.onclosetag = () => {
            const path = stack.join("/");
            if (path === "urlset/url/loc") urls.push(text);
            stack.pop();
        };
        parser.write(xml).close();
        return { urls, rootNs };
    }

    it("10,000 Arabic products with special characters parse cleanly and every address decodes to its product", async () => {
        const names = ["بديل خشب PVC 60×120 — بُنّي", 'كرانيش & بانوهات <PS> "جديد"', "قهوة ☕ 'مظبوط'", "Café crème", "a/b?c=d#e"];
        const many = Array.from({ length: 10_000 }, (_, i) => ({ id: i + 1, slug: "s" + i, name: names[i % names.length] + " " + i }));
        const cats = [{ id: 1, name: "ديكورات & تشطيبات" }, { id: 2, name: '<قسم> "خاص"' }];
        const { res, body } = await run(CUSTOM, fakeApi(() => sitemapApi(many, cats)).fetcher);

        expect(res.status).toBe(200);
        expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
        const { urls, rootNs } = parse(body);
        expect(rootNs).toBe("http://www.sitemaps.org/schemas/sitemap/0.9");
        expect(urls).toHaveLength(2 + cats.length + many.length);
        // The parser's text is the real address: absolute, on this site, no raw spaces or markup
        for (const u of urls) {
            expect(u.startsWith(CUSTOM + "/")).toBe(true);
            expect(u).not.toMatch(/[\s<>"]/);
            expect(() => new URL(u)).not.toThrow();
        }
        const productUrls = urls.filter((u) => u.includes("/product/"));
        expect(new Set(productUrls).size).toBe(10_000);
        const p2 = decodeURIComponent(productUrls.find((u) => u.includes("/product/2/"))!);
        expect(p2).toContain("كرانيش");
        const cat = decodeURIComponent(urls.find((u) => u.includes("?category=1"))!);
        expect(cat).toContain("ديكورات");
    });
});
