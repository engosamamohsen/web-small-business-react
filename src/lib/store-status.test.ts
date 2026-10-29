import { describe, it, expect, vi, afterEach } from "vitest";
import {
    decideStoreAccess,
    forgetTenant,
    isStoreGoneResponse,
    onTenantForgotten,
    storeUnavailableStatus,
} from "./store-status";

describe("isStoreGoneResponse", () => {
    it("is the API's JSON 404 (unknown / deleted store) or a 410", () => {
        expect(isStoreGoneResponse(404, "application/json")).toBe(true);
        expect(isStoreGoneResponse(404, "application/json; charset=utf-8")).toBe(true);
        expect(isStoreGoneResponse(410, null)).toBe(true);
    });

    it("is not a 404 HTML page (a proxy during a deploy), a 5xx, a timeout or a success", () => {
        expect(isStoreGoneResponse(404, "text/html")).toBe(false);
        expect(isStoreGoneResponse(404, null)).toBe(false);
        expect(isStoreGoneResponse(500, "application/json")).toBe(false);
        expect(isStoreGoneResponse(502, "text/html")).toBe(false);
        expect(isStoreGoneResponse(408, null)).toBe(false);
        expect(isStoreGoneResponse(200, "application/json")).toBe(false);
    });
});

describe("decideStoreAccess", () => {
    it("a store the API says doesn't exist is missing", () => {
        expect(decideStoreAccess({ ok: false, notFound: true })).toBe("missing");
    });

    it("a temporary failure keeps the store open", () => {
        expect(decideStoreAccess({ ok: false })).toBe("open");
        expect(decideStoreAccess({ ok: false, notFound: false })).toBe("open");
    });

    it("never marks the PUBLIC_BASE_URL fallback tenant missing", () => {
        expect(decideStoreAccess({ ok: false, notFound: true, tenantUnknown: true })).toBe("open");
    });

    it("keeps the expired-subscription lockout and open stores as before", () => {
        expect(decideStoreAccess({ ok: true, expired: true })).toBe("expired");
        expect(decideStoreAccess({ ok: true })).toBe("open");
    });

    it("the unavailable page answers 404 only for a missing store", () => {
        expect(storeUnavailableStatus(true)).toBe(404);
        expect(storeUnavailableStatus(false)).toBe(200);
    });
});

describe("forgetTenant", () => {
    afterEach(() => vi.restoreAllMocks());

    it("calls every registered per-host cache, even if one throws", () => {
        const a = vi.fn(() => {
            throw new Error("boom");
        });
        const b = vi.fn();
        const offA = onTenantForgotten(a);
        const offB = onTenantForgotten(b);
        forgetTenant("https://admin-gone.cashierthru.com/api/");
        expect(a).toHaveBeenCalledWith("https://admin-gone.cashierthru.com/api/");
        expect(b).toHaveBeenCalledWith("https://admin-gone.cashierthru.com/api/");
        offA();
        offB();
    });
});
