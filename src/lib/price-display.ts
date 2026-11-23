// ─── "Price on request" (owner decision 2026-11-23) ────────────────────────────────────────────────
//
// A product saved with price 0 is a "price on request" item (emandbuild.com: building materials
// priced per job), not a free one. Every place a shopper sees a product price — the product cards of
// every theme, the product page, the add-to-cart button, the search box, the quick view — shows
// "اطلب السعر" instead of "0 ج.م", and the page's product data sends no offer to search engines
// (a price-0 offer reads as "free" and Google refuses or flags it).
// Cart, checkout and order totals are amounts already agreed, so they keep showing numbers.

import { getDiscountedPrice } from "@/lib/pricing-utils";

export const PRICE_ON_REQUEST = "اطلب السعر";

/** True when there is no price to show: 0, negative or not a number. */
export function isPriceOnRequest(amount: number | string | null | undefined): boolean {
    const n = Number(amount);
    return !Number.isFinite(n) || n <= 0;
}

/**
 * The price a search engine's Offer should carry: what the customer pays for the product itself
 * (its discount applied), or null for a "price on request" product (then the page sends no offer).
 */
export function schemaOfferPrice(product: { price?: number | string | null; discount?: number | string | null } | null | undefined): number | null {
    const price = Number(product?.price);
    if (isPriceOnRequest(price)) return null;
    const discount = Number(product?.discount) || 0;
    const paid = discount > 0 && discount < 100 ? getDiscountedPrice(price, discount) : price;
    return isPriceOnRequest(paid) ? null : paid;
}
