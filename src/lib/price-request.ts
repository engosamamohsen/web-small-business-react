// ─── "Ask for the price" (owner decision 2026-11-23) ───────────────────────────────────────────────
//
// A product priced 0 is "price on request" (src/lib/price-display.ts). It used to go into the cart at
// 0 and make orders with a total of 0. Now the cart buttons give way to one "اسأل عن السعر" button:
//   • the store's WhatsApp, with "I'd like the price of <product>" and the product's link written;
//   • else a call to the store's phone;
//   • else the product page (which says "اطلب السعر").
// A product whose price comes from an option (base 0, a paid size) is NOT on request: the customer
// picks the option and orders normally. The server refuses a 0-priced line anyway
// (Laravel App\Support\Catalogue\PriceOnRequest), so no 0 order can be placed.

import type { Variation } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp-order";
import { isPriceOnRequest } from "@/lib/price-display";

export const ASK_PRICE = "اسأل عن السعر";

/** The store's contact numbers (printed by Layout.astro in window.__CT_STORE__.contact). */
export interface StoreContact {
    whatsapp?: string | null;
    phone?: string | null;
}

/** True when an enabled option group has a choice that costs something. */
export function hasPricedChoice(variations: Variation[] | null | undefined): boolean {
    return (variations ?? []).some(
        (group) => group?.enable !== false && (group?.choices ?? []).some((c) => c?.enable !== false && Number(c?.price) > 0),
    );
}

/** A product with no price to order at: price 0 after its discount, and no paid option to pick. */
export function isOnRequestProduct(product: {
    price?: number | string | null;
    discount?: number | string | null;
    variations?: Variation[] | null;
} | null | undefined): boolean {
    const price = Number(product?.price) || 0;
    const discount = Number(product?.discount) || 0;
    const paid = discount > 0 ? price - (price * Math.min(discount, 100)) / 100 : price;
    return isPriceOnRequest(paid) && !hasPricedChoice(product?.variations);
}

/** The WhatsApp message: which product, with its link so the store sees exactly what is meant. */
export function askPriceMessage(productName: string | null | undefined, productUrl: string | null | undefined): string {
    const name = (productName ?? "").replace(/\s+/g, " ").trim();
    return [`السلام عليكم، عايز أعرف سعر: ${name || "المنتج ده"}`, productUrl ?? ""].filter(Boolean).join("\n");
}

/** Where "اسأل عن السعر" goes: WhatsApp with the message, else a call, else null. */
export function askPriceHref(
    contact: StoreContact | null | undefined,
    productName: string | null | undefined,
    productUrl: string | null | undefined,
): string | null {
    const whatsapp = buildWhatsAppLink(contact?.whatsapp ?? null);
    if (whatsapp) return `${whatsapp}?text=${encodeURIComponent(askPriceMessage(productName, productUrl))}`;
    const phone = (contact?.phone ?? "").replace(/[^\d+]/g, "");
    return phone.length >= 8 ? `tel:${phone}` : null;
}

/** The contact printed for this store (browser only; null on the server). */
export function storeContact(): StoreContact | null {
    if (typeof window === "undefined") return null;
    return (window as unknown as { __CT_STORE__?: { contact?: StoreContact } }).__CT_STORE__?.contact ?? null;
}
