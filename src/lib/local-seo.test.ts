import { describe, expect, it } from "vitest";
import {
    branchPlaces,
    buildFoodBusinessJsonLd,
    categoryPageSeo,
    foodBusinessType,
    openingHoursSpecification,
    priceRangeText,
} from "./local-seo";
import { categoryPagePath } from "@/lib/category/category-param";

const ORIGIN = "https://roka.cashierthru.com";
const settings = (extra: Record<string, unknown> = {}) =>
    ({ name: "ROKA’S KITCHEN", shop_type: "restaurant", phone: "+201112124464", logo: "https://x/logo.png", about_us: "مطعم  شاورما\r\nومشويات", ...extra }) as any;

describe("the food store as a local business (schema.org)", () => {
    it("uses the right type per food store, and nothing for other stores", () => {
        expect(foodBusinessType("restaurant")).toBe("Restaurant");
        expect(foodBusinessType("cafe")).toBe("CafeOrCoffeeShop");
        expect(foodBusinessType("bakery")).toBe("Bakery");
        for (const type of ["clothing", "salon", null, undefined, ""]) {
            expect(foodBusinessType(type as any)).toBeNull();
            expect(buildFoodBusinessJsonLd(settings({ shop_type: type }), ORIGIN, {})).toBeNull();
        }
    });

    it("describes roka: address from its branch, price range, menu, linked to the store organization", () => {
        const node = buildFoodBusinessJsonLd(settings(), ORIGIN, {
            branchesBody: { status: true, data: [{ id: 1, address: "شارع الجراج", lat: 30.0444, lng: 31.2357 }] },
            priceRange: { min: 10, max: 370 },
            hours: { enabled: false },
        })!;
        expect(node["@type"]).toBe("Restaurant");
        expect(node["@id"]).toBe(`${ORIGIN}/#business`);
        expect(node.address).toEqual({ "@type": "PostalAddress", streetAddress: "شارع الجراج", addressCountry: "EG" });
        expect(node.geo).toBeUndefined(); // the panel's fixed default point is not a real location
        expect(node.priceRange).toBe("EGP 10 - 370");
        expect(node.hasMenu).toBe(`${ORIGIN}/`);
        expect(node.telephone).toBe("+201112124464");
        expect(node.description).toBe("مطعم شاورما ومشويات");
        expect(node.openingHoursSpecification).toBeUndefined();
        expect(node.parentOrganization).toEqual({ "@id": `${ORIGIN}/#organization` });
        expect(node.servesCuisine).toBeUndefined(); // never guessed
    });

    it("prefers the store's full address, and lists every branch when there are several", () => {
        const node = buildFoodBusinessJsonLd(settings({ full_address: "12 شارع التحرير، الدقي" }), ORIGIN, {
            branchesBody: { data: [
                { address: "فرع الدقي", lat: 30.038, lng: 31.211 },
                { address: "فرع مدينة نصر", lat: 30.0444, lng: 31.2357 },
            ] },
        })!;
        expect((node.address as any).streetAddress).toBe("12 شارع التحرير، الدقي");
        expect(node.geo).toEqual({ "@type": "GeoCoordinates", latitude: 30.038, longitude: 31.211 });
        const departments = node.department as any[];
        expect(departments.map((d) => d.address.streetAddress)).toEqual(["فرع الدقي", "فرع مدينة نصر"]);
        expect(departments[1].geo).toBeUndefined();
    });

    it("has no address when neither the store nor a branch has one", () => {
        const node = buildFoodBusinessJsonLd(settings(), ORIGIN, { branchesBody: null })!;
        expect(node.address).toBeUndefined();
        expect(branchPlaces({ data: [{ address: "  " }, null, "x"] })).toEqual([]);
    });

    it("turns the weekly hours into opening hours (all day, past midnight, closed days)", () => {
        const specs = openingHoursSpecification({
            enabled: true,
            week: [
                { weekday: 0, ranges: [{ opens: "12:00", closes: "23:00" }] },
                { weekday: 5, ranges: [{ opens: "18:00", closes: "02:00" }] },
                { weekday: 6, ranges: [{ opens: "00:00", closes: "00:00" }] },
                { weekday: 1, ranges: [] },
                { weekday: 2, ranges: [{ opens: "bad", closes: "10:00" }] },
            ],
        });
        expect(specs).toEqual([
            { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Sunday", opens: "12:00", closes: "23:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Friday", opens: "18:00", closes: "02:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Saturday", opens: "00:00", closes: "23:59" },
        ]);
        expect(openingHoursSpecification({ enabled: false, week: [{ weekday: 0, ranges: [{ opens: "10:00", closes: "11:00" }] }] })).toEqual([]);
        expect(openingHoursSpecification(null)).toEqual([]);
    });

    it("writes the price range only when it is known", () => {
        expect(priceRangeText({ min: 10, max: 370 })).toBe("EGP 10 - 370");
        expect(priceRangeText({ min: 50, max: 50 })).toBe("EGP 50");
        for (const range of [null, undefined, {}, { min: null, max: null }, { min: 0, max: 0 }]) {
            expect(priceRangeText(range as any)).toBeNull();
        }
    });
});

describe("a category page for search engines", () => {
    it("has one address, used by the sitemap and the canonical alike", () => {
        expect(categoryPagePath({ id: 1, name: "الفراخ" })).toBe("/?category=1-الفراخ");
        expect(categoryPagePath({ id: 2, name: "Hot Drinks" })).toBe("/?category=2-hot-drinks");
        expect(categoryPagePath({ id: 3, name: null })).toBe("/?category=3");
        expect(categoryPagePath(null)).toBe("/");
    });

    it("gets its own title, description, canonical and breadcrumb", () => {
        const seo = categoryPageSeo({
            category: { id: 1, name: "الفراخ" },
            pagePath: categoryPagePath({ id: 1, name: "الفراخ" }),
            storeName: "ROKA’S KITCHEN",
            origin: ORIGIN,
            productNames: ["ربع فرخة + أرز", "شاورما فراخ"],
            food: true,
        });
        expect(seo.title).toBe("الفراخ | ROKA’S KITCHEN");
        expect(seo.description).toBe("اطلب الفراخ من ROKA’S KITCHEN أونلاين: ربع فرخة + أرز، شاورما فراخ.");
        expect(seo.canonical).toBe(`${ORIGIN}/?category=1-%D8%A7%D9%84%D9%81%D8%B1%D8%A7%D8%AE`);
        expect((seo.breadcrumb.itemListElement as any[]).map((i) => i.item)).toEqual([`${ORIGIN}/`, seo.canonical]);
    });

    it("keeps the description short, and says 'shop' for a store that is not food", () => {
        const seo = categoryPageSeo({
            category: { id: 5, name: "ملابس" },
            pagePath: "/?category=5-ملابس",
            storeName: "Moda",
            origin: ORIGIN,
            productNames: Array.from({ length: 20 }, (_, i) => `قميص قطن رجالي موديل رقم ${i + 1}`),
            food: false,
        });
        expect(seo.description.startsWith("تسوّق ملابس من Moda أونلاين: ")).toBe(true);
        expect(seo.description.length).toBeLessThanOrEqual(156);
    });

    it("matches the sitemap's encoding (encodeURI of origin + path)", () => {
        const path = categoryPagePath({ id: 4, name: "المحاشي" });
        expect(categoryPageSeo({ category: { id: 4, name: "المحاشي" }, pagePath: path, storeName: "S", origin: ORIGIN, productNames: [], food: true }).canonical)
            .toBe(encodeURI(`${ORIGIN}${path}`));
    });
});
