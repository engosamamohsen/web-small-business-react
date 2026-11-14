import { createHash, createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    __resetCarrierCache, absoluteLogo, cachedCarrier, errorBody, freshProfile, isCarrierPath, lookupCarrier, PROFILE_CACHE_MS,
    signVisitor, visitorHeaders, visitorIp,
} from "./server";
import { isAltchaChallenge, solveAltcha } from "./altcha";

const API = "http://admin-nileexpress.localhost:8000/api/";
const profile = {
    kind: "shipping", name: "Nile Express", logo_url: null, country: "EG", phone_prefix: "+20", currency: "EGP",
    governorates: [{ code: "C", name_ar: "القاهرة", name_en: "Cairo" }], categories: [], payers: [],
    texts: {}, contact: { phone: null, whatsapp: null }, booking_open: true, features: { estimate: false, tracking: true },
    altcha: true, form_token: "secret-token",
};

function respond(status: number, body: unknown) {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

beforeEach(() => __resetCarrierCache());
afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

describe("the visitor's address", () => {
    const req = (headers: Record<string, string>) => new Request("http://x/", { headers });

    it("uses Nginx's X-Real-IP only when the connection is from the proxy", () => {
        expect(visitorIp(req({ "x-real-ip": "41.33.1.2" }), "127.0.0.1")).toBe("41.33.1.2");
        expect(visitorIp(req({ "x-real-ip": "41.33.1.2" }), "::ffff:127.0.0.1")).toBe("41.33.1.2");
        // A visitor reaching Node directly can't pick an address
        expect(visitorIp(req({ "x-real-ip": "1.1.1.1" }), "41.33.9.9")).toBe("41.33.9.9");
    });

    it("never reads the visitor's own X-Forwarded-For", () => {
        expect(visitorIp(req({ "x-forwarded-for": "8.8.8.8" }), "41.33.9.9")).toBe("41.33.9.9");
        expect(visitorIp(req({ "x-forwarded-for": "8.8.8.8", "x-real-ip": "garbage" }), "127.0.0.1")).toBe("127.0.0.1");
    });
});

describe("the signed headers Laravel checks (App\\Support\\Shipping\\PublicClient)", () => {
    it("signs \"<ip>|<time>\" with HMAC-SHA256, like PHP's hash_hmac", () => {
        const expected = createHmac("sha256", "s3cret").update("41.33.1.2|1770000000").digest("hex");
        expect(signVisitor("41.33.1.2", 1770000000, "s3cret")).toBe(expected);
    });

    it("adds the signature only when the secret is set", () => {
        vi.stubEnv("SHIPPING_PUBLIC_PROXY_SECRET", "");
        expect(visitorHeaders("41.33.1.2", "ar")["X-CT-Client-Signature"]).toBeUndefined();
        vi.stubEnv("SHIPPING_PUBLIC_PROXY_SECRET", "s3cret");
        const h = visitorHeaders("41.33.1.2", "en", 1770000000_000);
        expect(h["X-CT-Client-IP"]).toBe("41.33.1.2");
        expect(h["X-CT-Client-Time"]).toBe("1770000000");
        expect(h["X-CT-Client-Signature"]).toBe(signVisitor("41.33.1.2", 1770000000, "s3cret"));
        expect(h["X-Forwarded-For"]).toBe("41.33.1.2");
        expect(h["Accept-Language"]).toBe("en");
    });
});

describe("finding shipping companies", () => {
    it("remembers a company for a minute, without its form token", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => respond(200, { status: true, data: profile })));
        const found = await lookupCarrier(API, "41.33.1.2", "ar", 1000);
        expect(found.kind).toBe("shipping");
        const cached = cachedCarrier(API, 1000 + PROFILE_CACHE_MS - 1);
        expect(cached?.name).toBe("Nile Express");
        expect(cached && "form_token" in cached).toBe(false);
        expect(cachedCarrier(API, 1000 + PROFILE_CACHE_MS + 1)).toBeNull();
    });

    it("a JSON 404 means neither a store nor a company", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => respond(404, { message: "Not found." })));
        expect((await lookupCarrier(API, "41.33.1.2", "ar")).kind).toBe("none");
    });

    it("a hiccup serves the last known profile", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => respond(200, { status: true, data: profile })));
        await lookupCarrier(API, "41.33.1.2", "ar", 1000);
        vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("down"); }));
        expect((await lookupCarrier(API, "41.33.1.2", "ar", 1000 + PROFILE_CACHE_MS * 2)).kind).toBe("shipping");
        __resetCarrierCache();
        expect((await lookupCarrier(API, "41.33.1.2", "ar")).kind).toBe("unreachable");
    });

    it("a store's answer is never taken for a company", async () => {
        vi.stubGlobal("fetch", vi.fn(async () => respond(200, { status: true, data: { name: "Moda" } })));
        expect((await lookupCarrier(API, "41.33.1.2", "ar")).kind).toBe("unreachable");
    });

    it("the /ship page gets the token, the cache doesn't", async () => {
        const fetchMock = vi.fn(async (..._args: unknown[]) => respond(200, { status: true, data: profile }));
        vi.stubGlobal("fetch", fetchMock);
        expect((await freshProfile(API, "41.33.1.2", "ar"))?.form_token).toBe("secret-token");
        expect(cachedCarrier(API) && "form_token" in cachedCarrier(API)!).toBe(false);
        expect(String(fetchMock.mock.calls[0][0])).toBe(API + "shipping/public/profile");
    });
});

describe("carrier paths and helpers", () => {
    it("serves only the carrier pages and files", () => {
        for (const p of ["/", "/ship", "/track", "/track/SHL-1", "/api/shipping/booking", "/_astro/x.js", "/fonts/cairo/a.woff2", "/robots.txt"]) {
            expect(isCarrierPath(p), p).toBe(true);
        }
        for (const p of ["/product/1-x", "/shop/cart", "/book", "/services", "/sitemap.xml", "/track/a/b"]) {
            expect(isCarrierPath(p), p).toBe(false);
        }
    });

    it("makes the logo absolute on the company's API host", () => {
        expect(absoluteLogo(API, "/api/shipping/public/logo")).toBe("http://admin-nileexpress.localhost:8000/api/shipping/public/logo");
        expect(absoluteLogo(API, null)).toBeNull();
    });

    it("names errors when Laravel sent none", () => {
        expect(errorBody({ status: 0, ok: false, body: null }).error_code).toBe("network");
        expect(errorBody({ status: 429, ok: false, body: null }).error_code).toBe("too_many_requests");
        expect(errorBody({ status: 403, ok: false, body: { status: false, error_code: "booking_closed" } }).error_code).toBe("booking_closed");
    });
});

describe("ALTCHA", () => {
    it("solves a challenge in Laravel's format", async () => {
        const salt = "abc123?expires=9999999999";
        const challenge = { algorithm: "SHA-256", challenge: createHash("sha256").update(salt + 1234).digest("hex"), maxnumber: 5000, salt, signature: "sig" };
        expect(isAltchaChallenge(challenge)).toBe(true);
        const payload = await solveAltcha(challenge);
        const decoded = JSON.parse(Buffer.from(payload!, "base64").toString("utf8"));
        expect(decoded).toEqual({ algorithm: "SHA-256", challenge: challenge.challenge, number: 1234, salt, signature: "sig" });
    });

    it("gives up on a broken challenge or when stopped", async () => {
        const c = { algorithm: "SHA-256", challenge: "nope", maxnumber: 50, salt: "s", signature: "x" };
        expect(await solveAltcha(c)).toBeNull();
        const stop = new AbortController();
        stop.abort();
        expect(await solveAltcha({ ...c, maxnumber: 100000 }, stop.signal)).toBeNull();
        expect(isAltchaChallenge({ algorithm: "MD5" })).toBe(false);
    });
});
