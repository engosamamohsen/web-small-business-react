// ─── Product structured data (JSON-LD) for the product page ───────────────────────────────────────
//
// Owner decision 2026-11-28 (emandbuild.com, a catalogue/inquiry store where every product is
// "price on request"): Google's Product rich results need `offers`, `review` or `aggregateRating`.
// We never invent prices, ratings or reviews, so a product without a real price sends NO Product
// object at all (a Product without offers is reported as invalid). The page itself stays indexable:
// title, description, canonical, Open Graph image and links are rendered by the page and are not
// touched here. The store Organization is still sent on every product page.
//
// It is dynamic: the decision comes from the product's current price (schemaOfferPrice), so a
// product that gets a real price later sends a full Product with its Offer on the next render.
// Shipping (S1, shippingDetails) is only ever added inside an Offer; it never replaces a price.

import { schemaOfferPrice } from "@/lib/price-display";

type PriceFields = { price?: number | string | null; discount?: number | string | null };

export type ProductSchemaInput = {
    product: (PriceFields & { name?: string | null; description?: string | null; in_stock?: boolean | null }) | null | undefined;
    canonicalUrl: string;
    images: string[];
    brandName?: string | null;
    sellerId: string;
    shippingDetails?: Record<string, unknown> | null;
};

/** The Product JSON-LD object, or null when the product has no real price (price on request). */
export function buildProductSchema(input: ProductSchemaInput): Record<string, unknown> | null {
    const { product } = input;
    const offerPrice = schemaOfferPrice(product);
    if (!product || offerPrice === null) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description?.replace(/<[^>]*>/g, ""),
        image: input.images.length ? input.images : undefined,
        brand: { "@type": "Brand", name: input.brandName || "Store" },
        offers: {
            "@type": "Offer",
            url: input.canonicalUrl,
            priceCurrency: "EGP",
            // What the customer pays for the product itself (its discount applied).
            price: offerPrice,
            // Made from a recipe and an item ran out (API in_stock): tell search engines too.
            availability: product.in_stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            seller: { "@id": input.sellerId },
            ...(input.shippingDetails ? { shippingDetails: input.shippingDetails } : {}),
        },
        // No `category`: Google Merchant listings wants a Google product taxonomy value there and flags the
        // store's own category name ("Invalid value in field category", Search Console 2026-11-26).
    };
}

/** Everything the product page sends: the Product (only with a real price) and the store Organization. */
export function productPageJsonLd(input: ProductSchemaInput, storeOrganization: Record<string, unknown>): Array<Record<string, unknown>> {
    const product = buildProductSchema(input);
    return product ? [product, storeOrganization] : [storeOrganization];
}
