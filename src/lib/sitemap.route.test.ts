// Lives in src/lib, not src/pages: Astro would turn a .ts file in src/pages into a public endpoint.
import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { clearSitemapCache, RETRY_AFTER_SECONDS, sitemapCacheStats } from "@/lib/sitemap";

// F1 integration (docs/seo-merchant-data-plan.md, 2026-11-26): the real /sitemap.xml route handler,
// the real fetchHook and real HTTP to a stand-in store API on 127.0.0.1. Each case is a store with
// no earlier good sitemap, so a failure must be an HTTP 503 with nothing partial in it.

type Mode = "ok" | "429" | "500" | "slow" | "invalid" | "incomplete" | "html";
const hits: Record<string, number> = {};

function products(n: number) {
    return Array.from({ length: n }, (_, i) => ({ id: i + 1, slug: `item-${i + 1}`, name: `منتج رقم ${i + 1}` }));
}

function storeApi(req: IncomingMessage, res: ServerResponse) {
    // /<mode>/api/v1/sitemap
    const [, mode, , ...rest] = (req.url ?? "").split("/");
    const path = rest.join("/");
    hits[mode] = (hits[mode] ?? 0) + 1;
    const json = (status: number, body: unknown) => {
        res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(body));
    };
    if (path !== "v1/sitemap") return json(404, { message: "Not Found" });
    switch (mode as Mode) {
        case "ok": {
            const p = products(250);
            return json(200, { status: true, data: { products: p, categories: [{ id: 1, name: "الفراخ" }], counts: { products: 250, categories: 1 } } });
        }
        case "429":
            res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "60", "X-RateLimit-Limit": "30" });
            return res.end(JSON.stringify({ message: "Too Many Attempts." }));
        case "500":
            return json(500, { message: "Server Error" });
        case "slow":
            setTimeout(() => json(200, { status: true, data: { products: [], categories: [], counts: { products: 0, categories: 0 } } }), 1500);
            return;
        case "invalid":
            return json(200, { status: true, data: { products: "not a list" } });
        case "incomplete":
            return json(200, { status: true, data: { products: products(3), categories: [], counts: { products: 10, categories: 0 } } });
        case "html":
            res.writeHead(200, { "Content-Type": "text/html" });
            return res.end("<html>proxy error page</html>");
    }
    return json(404, {});
}

let server: Server;
let base = "";
let GET: (ctx: any) => Promise<Response>;

beforeAll(async () => {
    process.env.SITEMAP_API_TIMEOUT_MS = "300";
    server = createServer(storeApi);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    ({ GET } = (await import("@/pages/sitemap.xml.ts")) as any);
});

afterAll(async () => {
    delete process.env.SITEMAP_API_TIMEOUT_MS;
    await new Promise<void>((resolve) => server.close(() => resolve()));
});

let errors: string[] = [];
beforeEach(() => {
    clearSitemapCache();
    errors = [];
    vi.spyOn(console, "error").mockImplementation((line: unknown) => {
        errors.push(String(line));
    });
});
afterEach(() => vi.restoreAllMocks());

/** GET https://<site>/sitemap.xml through the route, with the store API in the given mode. */
async function sitemap(mode: Mode, site = "https://emandbuild.com") {
    const url = new URL(`${site}/sitemap.xml`);
    const res = await GET({ locals: { apiBase: `${base}/${mode}/api/` }, request: new Request(url), url });
    return { res, body: await res.text() };
}

function expectUnavailable(res: Response, body: string) {
    expect(res.status).toBe(503);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(res.headers.get("Retry-After")).toBe(String(RETRY_AFTER_SECONDS));
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    expect(body).not.toContain("<urlset");
    expect(body).not.toContain("<loc>");
    expect(sitemapCacheStats().entries).toBe(0); // nothing stored
}

describe("GET /sitemap.xml through the real route and real HTTP", () => {
    it("200 with the complete sitemap when the store API answers", async () => {
        const { res, body } = await sitemap("ok");

        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
        expect(res.headers.get("Cache-Control")).toBe("public, max-age=3600");
        expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
        expect((body.match(/<loc>https:\/\/emandbuild\.com\/product\//g) ?? []).length).toBe(250);
        expect(errors).toHaveLength(0);
    });

    it("the custom domain and the cashierthru address each get their own URLs", async () => {
        const custom = await sitemap("ok", "https://emandbuild.com");
        const sub = await sitemap("ok", "https://emand.cashierthru.com");

        const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        expect(locs(custom.body).every((u) => u.startsWith("https://emandbuild.com/"))).toBe(true);
        expect(locs(sub.body).every((u) => u.startsWith("https://emand.cashierthru.com/"))).toBe(true);
    });

    it.each([
        ["429 Too Many Requests", "429" as Mode, 429],
        ["500 Server Error", "500" as Mode, 500],
        ["a timeout", "slow" as Mode, 408],
        ["an invalid body", "invalid" as Mode, 200],
        ["an incomplete body (counts do not match)", "incomplete" as Mode, 200],
        ["a non-JSON page", "html" as Mode, 200],
    ])("503, nothing partial, nothing cached, one log line, when the store API gives %s", async (_label, mode, status) => {
        const started = Date.now();
        const { res, body } = await sitemap(mode);

        expectUnavailable(res, body);
        expect(errors).toHaveLength(1);
        expect(JSON.parse(errors[0])).toMatchObject({ event: "sitemap_failed", site: "https://emandbuild.com", step: "v1/sitemap", status });
        if (mode === "slow") expect(Date.now() - started).toBeLessThan(1400); // gave up at the timeout
    });

    it("20 search engine requests at once during a 429 make one store API call and all get 503", async () => {
        const before = hits["429"] ?? 0;
        const results = await Promise.all(Array.from({ length: 20 }, () => sitemap("429", "https://burst.example.com")));

        expect(results.every(({ res }) => res.status === 503)).toBe(true);
        expect((hits["429"] ?? 0) - before).toBe(1);
        expect(errors).toHaveLength(1);
    });

    it("after a failure the next request asks the store API again (the failure was not cached)", async () => {
        const first = await sitemap("500", "https://retry.example.com");
        expect(first.res.status).toBe(503);
        const second = await sitemap("ok", "https://retry.example.com");
        expect(second.res.status).toBe(200);
    });
});

describe("GET /sitemap.xml: last known-good copy through the real route", () => {
    async function at(time: number, mode: Mode, site: string, locals: Record<string, unknown>) {
        vi.setSystemTime(time);
        const url = new URL(`${site}/sitemap.xml`);
        const res = await GET({ locals: { apiBase: `${base}/${mode}/api/`, ...locals }, request: new Request(url), url });
        return { res, body: await res.text() };
    }
    const confirmed = { storeVerified: true, domainVerified: true, storeKey: "store-A" };
    const start = Date.UTC(2026, 10, 26, 12, 0, 0);
    const later = start + 11 * 60 * 1000; // past the 10-minute cache: a rebuild is needed

    beforeEach(() => vi.useFakeTimers({ toFake: ["Date"] }));
    afterEach(() => vi.useRealTimers());

    it("active store + connected domain + a 429 from the store API → the last complete copy, 5-minute cache, X-Sitemap-Stale", async () => {
        const good = await at(start, "ok", "https://stale-ok.example.com", confirmed);
        const stale = await at(later, "429", "https://stale-ok.example.com", confirmed);

        expect(stale.res.status).toBe(200);
        expect(stale.body).toBe(good.body);
        expect(stale.res.headers.get("Cache-Control")).toBe("public, max-age=300");
        expect(stale.res.headers.get("X-Sitemap-Stale")).toBe("660");
        expect(errors.map((l) => JSON.parse(l).event)).toEqual(["sitemap_failed", "sitemap_served_stale"]);
    });

    it.each([
        ["the store could not be confirmed (backend unavailable)", { storeVerified: false, domainVerified: true }],
        ["the custom domain could not be confirmed", { storeVerified: true, domainVerified: false }],
        ["nothing was confirmed", {}],
    ])("503 when %s", async (_label, locals) => {
        const site = "https://stale-no-" + Object.keys(locals).length + Object.values(locals).join("-") + ".example.com";
        await at(start, "ok", site, confirmed);
        const r = await at(later, "500", site, locals);

        expect(r.res.status).toBe(503);
        expect(r.res.headers.get("X-Sitemap-Stale")).toBeNull();
        expect(r.body).not.toContain("<urlset");
    });

    it("503 when the copy is older than 24 hours", async () => {
        await at(start, "ok", "https://stale-old.example.com", confirmed);
        const r = await at(start + 24 * 60 * 60 * 1000 + 1000, "slow", "https://stale-old.example.com", confirmed);
        expect(r.res.status).toBe(503);
    });

    it("another address's copy is never used", async () => {
        await at(start, "ok", "https://emand.cashierthru.com", confirmed);
        const r = await at(later, "429", "https://emandbuild.com", confirmed);
        expect(r.res.status).toBe(503);
    });
});
