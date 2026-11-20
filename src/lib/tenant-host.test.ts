import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    classifyHost,
    clearCustomDomainCache,
    forgetCustomDomain,
    deriveApiOrigin,
    lookupCustomDomain,
    normalizeHost,
    platformDomains,
} from "./tenant-host";

const prodEnv = {
    dev: false,
    platforms: ["cashierthru.com"],
    devOrigin: (h: string) => `http://admin-${h.split(".")[0]}.localhost:8001`,
    baseUrl: "https://admin-asly.cashierthru.com",
    warn: () => {},
};

describe("normalizeHost", () => {
    it.each([
        ["EmandBuild.com", "emandbuild.com"],
        ["www.emandbuild.com:443", "www.emandbuild.com"],
        ["emandbuild.com.", "emandbuild.com"],
        ["https://emandbuild.com/path?q=1", "emandbuild.com"],
        ["emandbuild.com, proxy.internal", "emandbuild.com"],
        ["", ""],
        [null, ""],
    ])("%j → %j", (raw, expected) => {
        expect(normalizeHost(raw as string | null)).toBe(expected);
    });
});

describe("classifyHost", () => {
    it.each([
        // existing store subdomains and the platform itself
        ["emand.cashierthru.com", "platform"],
        ["admin-emand.cashierthru.com", "platform"],
        ["cashierthru.com", "platform"],
        ["www.cashierthru.com", "platform"],
        ["EMAND.CashierThru.com", "platform"],
        // custom domains: root and www
        ["emandbuild.com", "custom"],
        ["www.emandbuild.com", "custom"],
        ["shop.mybakery.com.eg", "custom"],
        // a look-alike is NOT the platform
        ["evilcashierthru.com", "custom"],
        ["cashierthru.com.evil.net", "custom"],
        // local / proxy without a host
        ["localhost", "local"],
        ["nilebakery.localhost", "local"],
        ["127.0.0.1", "local"],
        ["204.168.163.214", "local"],
        // junk
        ["", "invalid"],
        ["not_a_domain", "invalid"],
        ["-bad-.com", "invalid"],
    ])("%s → %s", (host, kind) => {
        expect(classifyHost(host).kind).toBe(kind);
    });

    it("reads extra platform domains from PUBLIC_PLATFORM_DOMAINS", () => {
        const platforms = platformDomains("cashierthru.com, Staging-CT.net");
        expect(platforms).toEqual(["cashierthru.com", "staging-ct.net"]);
        expect(classifyHost("shop.staging-ct.net", platforms).kind).toBe("platform");
        expect(platformDomains("")).toEqual(["cashierthru.com"]);
        expect(platformDomains(undefined)).toEqual(["cashierthru.com"]);
    });
});

describe("deriveApiOrigin", () => {
    it("custom root domain → the same host, marked custom", () => {
        expect(deriveApiOrigin("emandbuild.com", "https", prodEnv)).toEqual({
            origin: "https://emandbuild.com",
            fallback: false,
            custom: true,
        });
    });

    it("www custom domain → the same www host (was admin-www.emandbuild.com)", () => {
        expect(deriveApiOrigin("www.emandbuild.com", "https", prodEnv)).toEqual({
            origin: "https://www.emandbuild.com",
            fallback: false,
            custom: true,
        });
    });

    it("upper case custom host is lower-cased", () => {
        expect(deriveApiOrigin("WWW.EmandBuild.com", "https", prodEnv).origin).toBe("https://www.emandbuild.com");
    });

    // ── no regressions: the behaviour before custom domains ──
    it.each([
        ["emand.cashierthru.com", "https://admin-emand.cashierthru.com"],
        ["roka.cashierthru.com", "https://admin-roka.cashierthru.com"],
        ["admin-emand.cashierthru.com", "https://admin-emand.cashierthru.com"],
        ["cashierthru.com", "https://cashierthru.com"],
    ])("store subdomain %s → %s (unchanged)", (host, origin) => {
        const out = deriveApiOrigin(host, "https", prodEnv);
        expect(out.origin).toBe(origin);
        expect(out.fallback).toBe(false);
        expect(out.custom).toBeUndefined();
    });

    it("*.localhost (local production build) → the dev origin (unchanged)", () => {
        expect(deriveApiOrigin("nilebakery.localhost", "http", prodEnv)).toEqual({
            origin: "http://admin-nilebakery.localhost:8001",
            fallback: false,
        });
    });

    it("localhost / IP (proxy dropped the host) → PUBLIC_BASE_URL fallback (unchanged)", () => {
        const warn = vi.fn();
        expect(deriveApiOrigin("localhost", "http", { ...prodEnv, warn })).toEqual({
            origin: "https://admin-asly.cashierthru.com",
            fallback: true,
        });
        expect(warn).toHaveBeenCalledOnce();
    });

    it("npm run dev never treats a host as a custom domain (unchanged)", () => {
        const out = deriveApiOrigin("emandbuild.com", "http", { ...prodEnv, dev: true });
        expect(out.custom).toBeUndefined();
        expect(out.origin).toBe("http://admin-emandbuild.localhost:8001");
    });
});

describe("lookupCustomDomain", () => {
    beforeEach(() => clearCustomDomainCache());

    const reply = (status: number) => vi.fn(async () => new Response(null, { status }));

    it("200 → connected, asking the central API with the host", async () => {
        const fetchImpl = reply(200);
        await expect(
            lookupCustomDomain("www.emandbuild.com", { centralOrigin: "https://cashierthru.com/", fetchImpl }),
        ).resolves.toBe("connected");
        expect(fetchImpl).toHaveBeenCalledWith(
            "https://cashierthru.com/api/v1/custom-domains/allowed?domain=www.emandbuild.com",
            expect.anything(),
        );
    });

    it("404 → unknown domain", async () => {
        await expect(lookupCustomDomain("unknown-shop.com", { fetchImpl: reply(404) })).resolves.toBe("unknown");
    });

    it("5xx or network error → error (fail open), never cached", async () => {
        await expect(lookupCustomDomain("emandbuild.com", { fetchImpl: reply(500) })).resolves.toBe("error");
        const boom = vi.fn(async () => {
            throw new Error("down");
        });
        await expect(lookupCustomDomain("emandbuild.com", { fetchImpl: boom })).resolves.toBe("error");
        const ok = reply(200);
        await expect(lookupCustomDomain("emandbuild.com", { fetchImpl: ok })).resolves.toBe("connected");
        expect(ok).toHaveBeenCalledOnce();
    });

    it("forgetCustomDomain asks again on the next request (domain just disconnected)", async () => {
        const ok = reply(200);
        await lookupCustomDomain("emandbuild.com", { fetchImpl: ok });
        await lookupCustomDomain("emandbuild.com", { fetchImpl: ok });
        expect(ok).toHaveBeenCalledOnce();
        forgetCustomDomain("emandbuild.com");
        const gone = reply(404);
        await expect(lookupCustomDomain("emandbuild.com", { fetchImpl: gone })).resolves.toBe("unknown");
        expect(gone).toHaveBeenCalledOnce();
    });

    it("caches connected for 5 minutes and unknown for 1 minute", async () => {
        let t = 0;
        const now = () => t;
        const ok = reply(200);
        await lookupCustomDomain("emandbuild.com", { fetchImpl: ok, now });
        t = 4 * 60_000;
        await lookupCustomDomain("emandbuild.com", { fetchImpl: ok, now });
        expect(ok).toHaveBeenCalledOnce();
        t = 6 * 60_000;
        await lookupCustomDomain("emandbuild.com", { fetchImpl: ok, now });
        expect(ok).toHaveBeenCalledTimes(2);

        const missing = reply(404);
        t = 0;
        await lookupCustomDomain("gone.com", { fetchImpl: missing, now });
        t = 30_000;
        await lookupCustomDomain("gone.com", { fetchImpl: missing, now });
        expect(missing).toHaveBeenCalledOnce();
        t = 61_000;
        await lookupCustomDomain("gone.com", { fetchImpl: missing, now });
        expect(missing).toHaveBeenCalledTimes(2);
    });
});
