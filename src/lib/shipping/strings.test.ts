import { describe, expect, it } from "vitest";
import { __STRING_SETS, optionLabel, pickCarrierLang, pickText } from "./strings";
import { countryTimeZone, formatDay, formatMoney } from "./format";

describe("carrier site words", () => {
    it("has every key in Arabic and English, none empty", () => {
        const ar = __STRING_SETS.ar as Record<string, unknown>;
        const en = __STRING_SETS.en as Record<string, unknown>;
        expect(Object.keys(en).sort()).toEqual(Object.keys(ar).sort());
        for (const [key, value] of Object.entries({ ...ar, ...en })) {
            if (typeof value === "string") expect(value.trim(), key).not.toBe("");
        }
        expect(ar.dir).toBe("rtl");
        expect(en.dir).toBe("ltr");
    });

    it("picks the language: ?lang=, then the cookie, then Arabic", () => {
        expect(pickCarrierLang("en", "ar")).toBe("en");
        expect(pickCarrierLang(null, "en")).toBe("en");
        expect(pickCarrierLang("fr", undefined)).toBe("ar");
        expect(pickCarrierLang(null, "xx")).toBe("ar");
    });

    it("falls back to the other language when the company left one empty", () => {
        expect(pickText({ ar: "", en: "Hello" }, "ar")).toBe("Hello");
        expect(pickText({ ar: "أهلاً", en: "Hello" }, "ar")).toBe("أهلاً");
        expect(pickText(null, "en")).toBe("");
        expect(optionLabel({ name_ar: "القاهرة", name_en: "Cairo" }, "en")).toBe("Cairo");
        expect(optionLabel({ label_ar: "ملابس", label_en: "" }, "en")).toBe("ملابس");
    });
});

describe("dates and money", () => {
    it("uses the company's time zone and keeps calendar days as they are", () => {
        expect(countryTimeZone("EG")).toBe("Africa/Cairo");
        expect(countryTimeZone(undefined)).toBe("Africa/Cairo");
        expect(formatDay("2026-11-10", "en")).toContain("2026");
        expect(formatDay("bad", "en")).toBe("");
        expect(formatMoney("850.50", "EGP", "en")).toContain("850.5");
    });
});
