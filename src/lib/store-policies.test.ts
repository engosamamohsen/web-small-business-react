import { describe, expect, it } from "vitest";
import { productShippingDetails, shippingPolicyFrom, shippingTexts } from "@/lib/store-policies";

// S1 (docs/seo-merchant-data-plan.md): the storefront renders the backend's shipping policy as is, and adds
// shippingDetails to the Product JSON-LD only when the backend sent a complete, valid block.

const texts = {
    ar: { coverage: "نقوم بالتوصيل إلى: القاهرة.", prep: "يتم تجهيز الطلب في نفس يوم تأكيده.", transit: "يتم التوصيل عادة في نفس اليوم أو في اليوم التالي.", fees: "رسوم الشحن 30 جنيه لجميع مناطق التوصيل، ويتم توضيحها للعميل قبل إتمام عملية الشراء." },
    en: { coverage: "We deliver to: Cairo.", prep: "Orders are prepared on the day they are confirmed.", transit: "Delivery is usually the same day or the next day.", fees: "Shipping costs EGP 30 to every delivery area and is shown before you complete your order." },
};

const google = (rate: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", currency: "EGP", ...rate },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "EG" },
    deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    },
    ...extra,
});

describe("shipping policy from the store API", () => {
    it("is null for an older store API (no `shipping`) or a malformed value", () => {
        expect(shippingPolicyFrom(undefined)).toBeNull();
        expect(shippingPolicyFrom(null)).toBeNull();
        expect(shippingPolicyFrom("x")).toBeNull();
        expect(shippingTexts(null)).toBeNull();
        expect(productShippingDetails(null)).toBeUndefined();
    });

    it("gives the backend's texts in the page language, Arabic when English is missing", () => {
        const p = shippingPolicyFrom({ kind: "food", coverage: "areas", google: null, google_reason: "areas_only", texts });
        expect(shippingTexts(p, "ar")).toEqual(texts.ar);
        expect(shippingTexts(p, "en")).toEqual(texts.en);
        expect(shippingTexts(shippingPolicyFrom({ google: null, texts: { ar: texts.ar } }), "en")).toEqual(texts.ar);
    });

    it("keeps the old page text when a line is missing or empty", () => {
        expect(shippingTexts(shippingPolicyFrom({ google: null, texts: { ar: { ...texts.ar, fees: "" } } }))).toBeNull();
        expect(shippingTexts(shippingPolicyFrom({ google: null, texts: { ar: { coverage: "x" } } }))).toBeNull();
    });
});

describe("Product JSON-LD shippingDetails", () => {
    it("is added for one fee (value) and for different fees (maxValue), exactly as sent", () => {
        const one = google({ value: 45 });
        const upTo = google({ maxValue: 60 });
        expect(productShippingDetails(shippingPolicyFrom({ google: one }))).toEqual(one);
        expect(productShippingDetails(shippingPolicyFrom({ google: upTo }))).toEqual(upTo);
    });

    it("is never added when the backend sent nothing (no areas, or only my areas)", () => {
        expect(productShippingDetails(shippingPolicyFrom({ google: null, google_reason: "no_areas" }))).toBeUndefined();
        expect(productShippingDetails(shippingPolicyFrom({ google: null, google_reason: "areas_only" }))).toBeUndefined();
    });

    it.each([
        ["both value and maxValue", google({ value: 30, maxValue: 60 })],
        ["neither value nor maxValue", google({})],
        ["another currency", google({ value: 30, currency: "USD" })],
        ["a negative fee", google({ value: -5 })],
        ["a region Google does not support for Egypt", google({ value: 30 }, { shippingDestination: { "@type": "DefinedRegion", addressCountry: "EG", addressRegion: "EG-C" } })],
        ["another country", google({ value: 30 }, { shippingDestination: { "@type": "DefinedRegion", addressCountry: "SA" } })],
        ["no delivery time", google({ value: 30 }, { deliveryTime: undefined })],
        ["days that are not whole", google({ value: 30 }, { deliveryTime: { handlingTime: { minValue: 0.5, maxValue: 1, unitCode: "DAY" }, transitTime: { minValue: 0, maxValue: 1, unitCode: "DAY" } } })],
        ["min above max", google({ value: 30 }, { deliveryTime: { handlingTime: { minValue: 3, maxValue: 1, unitCode: "DAY" }, transitTime: { minValue: 0, maxValue: 1, unitCode: "DAY" } } })],
        ["another type", { ...google({ value: 30 }), "@type": "Offer" }],
    ])("is refused (never sent incomplete or unsupported) with %s", (_label, block) => {
        expect(productShippingDetails(shippingPolicyFrom({ google: block }))).toBeUndefined();
    });
});
