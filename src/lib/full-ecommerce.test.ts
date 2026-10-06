import { describe, expect, it } from "vitest";
import { productsUrl, filtersFromParams, hasActiveFilters } from "./products-query";
import { orderStatus, orderSteps, stepIndex, ORDER_TABS } from "./order-status";
import { planFromSettings, storeConfig } from "./store-config";
import { isFoodStore, productsWording } from "./shop-type";

describe("store mode from the plan", () => {
    it("is premium only when the plan has full e-commerce", () => {
        expect(planFromSettings({ features: { full_ecommerce: true } })).toBe("premium");
        expect(planFromSettings({ features: { full_ecommerce: false } })).toBe("basic");
        expect(planFromSettings({})).toBe("basic");
        expect(planFromSettings(null)).toBe("basic");
    });

    it("defaults to the basic store outside a request", () => {
        expect(storeConfig.plan).toBe("basic");
        expect(storeConfig.canAuthenticate).toBe(false);
        expect(storeConfig.checkoutMode).toBe("whatsapp");
    });
});

describe("product filters in the URL", () => {
    it("builds the API query with category, search, price and sort", () => {
        const url = productsUrl(new URLSearchParams("category=3-shoes&q=red&min_price=100&max_price=500&sort=price_asc&page=2"));
        const query = new URLSearchParams(url.split("?")[1]);
        expect(url.startsWith("v1/product?")).toBe(true);
        expect(Object.fromEntries(query)).toEqual({
            category_id: "3", q: "red", min_price: "100", max_price: "500", sort: "price_asc", page: "2", limit: "10",
        });
    });

    it("drops invalid values", () => {
        const f = filtersFromParams(new URLSearchParams("min_price=-5&max_price=abc&sort=hack&q=%20%20"));
        expect(f).toEqual({ q: undefined, minPrice: undefined, maxPrice: undefined, sort: undefined });
        expect(hasActiveFilters(f)).toBe(false);
    });
});

describe("order statuses", () => {
    it("knows the dashboard statuses 1-6", () => {
        expect(orderStatus(3)?.label).toBe("جاري التجهيز");
        expect(orderStatus("6")?.label).toBe("ملغي");
        expect(orderStatus(9)).toBeNull();
    });

    it("shows the payment step only while it applies", () => {
        expect(orderSteps(2).map((s) => s.id)).toEqual([1, 2, 3, 4, 5]);
        expect(orderSteps(3).map((s) => s.id)).toEqual([1, 3, 4, 5]);
        expect(stepIndex(4)).toBe(2);
    });

    it("sorts orders into tabs", () => {
        const tab = (key: string) => ORDER_TABS.find((t) => t.key === key)!;
        expect([1, 2, 3, 4].every((id) => tab("active").match(id))).toBe(true);
        expect(tab("delivered").match(5)).toBe(true);
        expect(tab("cancelled").match(6)).toBe(true);
        expect(tab("active").match(6)).toBe(false);
    });
});

describe("store type wording", () => {
    it("treats restaurants and untyped stores as food stores", () => {
        expect(isFoodStore("restaurant")).toBe(true);
        expect(isFoodStore(null)).toBe(true);
        expect(isFoodStore("ecommerce")).toBe(false);
        expect(isFoodStore("handmade")).toBe(false);
        // Newer types: cafés and bakeries are food stores, the shop types are online stores.
        expect(isFoodStore("cafe")).toBe(true);
        expect(isFoodStore("bakery")).toBe(true);
        for (const type of ["fashion", "electronics", "home", "beauty", "grocery", "pharmacy", "books", "gifts", "service"]) {
            expect(isFoodStore(type), type).toBe(false);
        }
    });

    it("renames the menu on online shops", () => {
        expect(productsWording("ecommerce", "المنيو", "شوف المنيو")).toEqual({ title: "منتجاتنا", cta: "تصفح المنتجات" });
        expect(productsWording("restaurant", "المنيو", "شوف المنيو")).toEqual({ title: "المنيو", cta: "شوف المنيو" });
    });
});
