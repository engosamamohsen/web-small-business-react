import { describe, expect, it, vi } from "vitest";
import { clampDescription, DESCRIPTION_MAX } from "./meta-text";
import { classifyProductResponse, lookupProduct } from "./product-lookup";
import { isPriceOnRequest, PRICE_ON_REQUEST, schemaOfferPrice } from "./price-display";

// SEO batch 2 (owner decision 2026-11-23): descriptions, 404 vs "try again", price on request.

describe("page descriptions", () => {
    it("keeps a short text as it is (one clean line)", () => {
        expect(clampDescription("مطعم  شاورما\r\nومشويات")).toBe("مطعم شاورما ومشويات");
        expect(clampDescription(null)).toBe("");
        expect(clampDescription("<p>بديل <b>الخشب</b></p>")).toBe("بديل الخشب");
    });

    it("cuts a long 'about us' at a whole word, within 155 characters", () => {
        const about = "إيماند للمقاولات متخصصة في بديل الخشب والرخام وديكورات الحوائط ".repeat(10);
        const out = clampDescription(about);
        expect(out.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
        expect(out.endsWith("…")).toBe(true);
        expect(about.startsWith(out.slice(0, -1))).toBe(true); // nothing invented
        expect(out.slice(0, -1).endsWith(" ")).toBe(false);
        expect(about.charAt(out.length - 1)).toBe(" "); // the cut is between two words
    });

    it("still cuts a text with no spaces", () => {
        const out = clampDescription("x".repeat(400));
        expect(out.length).toBe(DESCRIPTION_MAX);
    });
});

describe("product lookup: missing vs temporarily unavailable", () => {
    it("classifies the API's answers", () => {
        expect(classifyProductResponse({ ok: true, status: 200, data: { data: { id: 5 } } })).toEqual({ kind: "found", product: { id: 5 } });
        expect(classifyProductResponse({ ok: true, status: 200, data: { data: null } }).kind).toBe("missing");
        for (const status of [404, 410, 422]) expect(classifyProductResponse({ ok: false, status }).kind).toBe("missing");
        for (const status of [0, 500, 502, 503, 429]) expect(classifyProductResponse({ ok: false, status }).kind).toBe("unavailable");
        expect(classifyProductResponse(null).kind).toBe("unavailable");
    });

    it("tries a failing API once more, so one hiccup never shows a real product as gone", async () => {
        const fetcher = vi.fn()
            .mockResolvedValueOnce({ ok: false, status: 0, data: null })
            .mockResolvedValueOnce({ ok: true, status: 200, data: { data: { id: 9 } } });
        expect(await lookupProduct("9", "http://api/", fetcher as any)).toEqual({ kind: "found", product: { id: 9 } });
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("is 'unavailable' (503) after two failures, and 'missing' (404) at once when the API says so", async () => {
        const down = vi.fn().mockRejectedValue(new Error("timeout"));
        vi.spyOn(console, "error").mockImplementation(() => {});
        expect((await lookupProduct("9", "http://api/", down as any)).kind).toBe("unavailable");
        expect(down).toHaveBeenCalledTimes(2);
        const gone = vi.fn().mockResolvedValue({ ok: false, status: 404, data: null });
        expect((await lookupProduct("9", "http://api/", gone as any)).kind).toBe("missing");
        expect(gone).toHaveBeenCalledTimes(1);
    });
});

describe("price on request", () => {
    it("is a price of 0, a negative one or none", () => {
        for (const v of [0, "0", -5, null, undefined, "abc", NaN]) expect(isPriceOnRequest(v as any), String(v)).toBe(true);
        for (const v of [1, "45", 0.5]) expect(isPriceOnRequest(v), String(v)).toBe(false);
        expect(PRICE_ON_REQUEST).toBe("اطلب السعر");
    });

    it("sends search engines the price paid, or no offer at all", () => {
        expect(schemaOfferPrice({ price: 100 })).toBe(100);
        expect(schemaOfferPrice({ price: 100, discount: 10 })).toBe(90);
        expect(schemaOfferPrice({ price: "120", discount: "25" })).toBe(90);
        expect(schemaOfferPrice({ price: 0 })).toBeNull();
        expect(schemaOfferPrice({ price: 0, discount: 10 })).toBeNull();
        expect(schemaOfferPrice({ price: 50, discount: 100 })).toBe(50); // a 100% "discount" is not a free offer
        expect(schemaOfferPrice(null)).toBeNull();
    });
});
