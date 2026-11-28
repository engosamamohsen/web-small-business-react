import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildProductSchema, productPageJsonLd, type ProductSchemaInput } from "./product-schema";

const org = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://shop.test/#store", name: "Emad Build" };
const base = (product: ProductSchemaInput["product"], extra: Partial<ProductSchemaInput> = {}): ProductSchemaInput => ({
    product,
    canonicalUrl: "https://shop.test/product/7/tiles",
    images: ["https://shop.test/image/products/7.jpg"],
    brandName: "Emad Build",
    sellerId: "https://shop.test/#store",
    ...extra,
});

describe("Product structured data only with a real price (owner decision 2026-11-28)", () => {
    it("sends no Product for a price-on-request product, only the Organization", () => {
        for (const price of [0, "0", null, undefined, -5, "abc"]) {
            expect(buildProductSchema(base({ name: "Tiles", price }))).toBeNull();
            expect(productPageJsonLd(base({ name: "Tiles", price }), org)).toEqual([org]);
        }
        // A discount on a 0 price is still no price.
        expect(buildProductSchema(base({ name: "Tiles", price: 0, discount: 10 }))).toBeNull();
    });

    it("sends a full Product with its Offer when the product has a real price", () => {
        const schema = buildProductSchema(base({ name: "Tiles", description: "<p>Strong</p> tiles", price: 120, discount: 25 }))!;
        expect(schema["@type"]).toBe("Product");
        expect(schema.name).toBe("Tiles");
        expect(schema.description).toBe("Strong tiles");
        expect(schema.image).toEqual(["https://shop.test/image/products/7.jpg"]);
        expect(schema.offers).toEqual({
            "@type": "Offer",
            url: "https://shop.test/product/7/tiles",
            priceCurrency: "EGP",
            price: 90,
            availability: "https://schema.org/InStock",
            seller: { "@id": "https://shop.test/#store" },
        });
        expect(productPageJsonLd(base({ name: "Tiles", price: 120 }), org)).toHaveLength(2);
    });

    it("is dynamic: the same product becomes eligible as soon as it gets a price", () => {
        const product: { name: string; price: number } = { name: "Tiles", price: 0 };
        expect(productPageJsonLd(base(product), org)).toEqual([org]);
        product.price = 75;
        const [schema] = productPageJsonLd(base(product), org);
        expect((schema.offers as { price: number }).price).toBe(75);
    });

    it("never invents ratings, reviews or a category", () => {
        const schema = buildProductSchema(base({ name: "Tiles", price: 50 }))!;
        for (const key of ["aggregateRating", "review", "category"]) expect(schema).not.toHaveProperty(key);
    });

    it("marks an out-of-stock product and adds shipping only inside a priced Offer", () => {
        const shippingDetails = { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 40, currency: "EGP" } };
        const priced = buildProductSchema(base({ name: "Cake", price: 50, in_stock: false }, { shippingDetails }))!;
        expect(priced.offers).toMatchObject({ availability: "https://schema.org/OutOfStock", shippingDetails });
        // Shipping data never makes an unpriced product eligible.
        expect(buildProductSchema(base({ name: "Tiles", price: 0 }, { shippingDetails }))).toBeNull();
    });

    it("leaves the image out when the product has no real photo", () => {
        expect(buildProductSchema(base({ name: "Tiles", price: 10 }, { images: [] }))).not.toHaveProperty("image.0");
        expect(buildProductSchema(base({ name: "Tiles", price: 10 }, { images: [] }))!.image).toBeUndefined();
    });

    it("never sends Product or Offer for zero, empty, invalid or negative prices", () => {
        const noPrice = [0, "0", "0.00", "", "   ", null, undefined, -1, "-20", Number.NaN, "abc", Number.POSITIVE_INFINITY, "Infinity", {} as unknown as number];
        for (const price of noPrice) {
            const ld = productPageJsonLd(base({ name: "Tiles", price }), org);
            expect(ld, `price ${String(price)}`).toEqual([org]);
            expect(JSON.stringify(ld)).not.toMatch(/"Product"|"Offer"/);
        }
        // A discount never turns "no price" into a price, and rounding a tiny price to 0 is still no price.
        expect(buildProductSchema(base({ name: "Tiles", price: 0, discount: 50 }))).toBeNull();
        expect(buildProductSchema(base({ name: "Tiles", price: -10, discount: 10 }))).toBeNull();
        expect(buildProductSchema(base({ name: "Tiles", price: 0.01, discount: 99 }))).toBeNull();
        // No product at all.
        expect(buildProductSchema(base(null))).toBeNull();
        expect(productPageJsonLd(base(undefined), org)).toEqual([org]);
    });

    it("uses the final discounted price for discounted products", () => {
        const price = (p: number | string, discount?: number | string | null) =>
            (buildProductSchema(base({ name: "Tiles", price: p, discount }))!.offers as { price: number }).price;
        expect(price(200, 10)).toBe(180);
        expect(price("120", "25")).toBe(90);
        expect(price(99.99, 15)).toBe(84.99); // rounded to 2 decimals like the cart
        expect(price(100, 0)).toBe(100);
        expect(price(100, null)).toBe(100);
        // Out-of-range discounts are not applied (the page and cart ignore them too): never a free or negative offer.
        expect(price(50, 100)).toBe(50);
        expect(price(50, 150)).toBe(50);
        expect(price(50, -20)).toBe(50);
    });

    it("no other storefront file builds Product structured data", () => {
        const src = fileURLToPath(new URL("..", import.meta.url));
        const files: string[] = [];
        const walk = (dir: string) => {
            for (const name of readdirSync(dir)) {
                const path = join(dir, name);
                if (statSync(path).isDirectory()) walk(path);
                else if (/\.(astro|tsx?|jsx?)$/.test(name) && !/\.test\./.test(name)) files.push(path);
            }
        };
        walk(src);
        const builders = files.filter((f) => /["']@type["']\s*:\s*["']Product["']|schema\.org\/Product|itemtype=/.test(readFileSync(f, "utf8")));
        const rel = builders.map((f) => f.slice(src.length).replace(/\\/g, "/").replace(/^\//, "")).sort();
        expect(rel).toEqual(["lib/product-schema.ts"]);
        // StructuredData.astro has an old Product case (`case "Product":`) that nothing uses: it must stay unused.
        const importers = files.filter((f) => !f.endsWith("StructuredData.astro") && /StructuredData(\.astro)?["']/.test(readFileSync(f, "utf8")));
        expect(importers).toEqual([]);
    });

    it("the product page uses this builder and still passes canonical, description and image to the layout", () => {
        const page = readFileSync(new URL("../pages/product/[...slug].astro", import.meta.url), "utf8");
        expect(page).toContain("productPageJsonLd(");
        expect(page).not.toMatch(/"@type":\s*"Product"/);
        for (const prop of ["canonical={canonicalUrl}", "description={pageDescription}", "image={productImage}", "title={pageTitle}"]) {
            expect(page).toContain(prop);
        }
    });
});
