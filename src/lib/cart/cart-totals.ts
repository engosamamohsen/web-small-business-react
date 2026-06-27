// ─── Cart discount totals ────────────────────────────────────────────────────
//
// Single source of truth for the "before / after discount" numbers shown in the
// cart UI, the order-receipt PNG, and the WhatsApp text fallback — so all three
// always agree.
//
// `unit_price` is the FINAL (already-discounted, variation-inclusive) per-unit
// price. `original_unit_price` is the pre-discount per-unit price (set for the
// local/BASIC cart by CartActions). When an item has no original price — older
// localStorage entries, or a backend cart that doesn't expose one — it falls
// back to `unit_price`, so that item simply contributes no discount.

import type { CartItemType } from "@/types/types";

export interface CartDiscountSummary {
    /** Σ original_unit_price × qty (pre-discount products subtotal). */
    originalSubtotal: number;
    /** Σ unit_price × qty (post-discount products subtotal). */
    finalSubtotal: number;
    /** originalSubtotal − finalSubtotal, never negative. */
    discountAmount: number;
    /** True when there is a real discount to display. */
    hasDiscount: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Pre-discount per-unit price for one item (falls back to the final price). */
export function originalUnitPrice(item: CartItemType): number {
    const original = Number(item.original_unit_price);
    const final = Number(item.unit_price) || 0;
    return Number.isFinite(original) && original > final ? original : final;
}

export function getCartDiscountSummary(
    items: CartItemType[],
): CartDiscountSummary {
    let originalSubtotal = 0;
    let finalSubtotal = 0;

    for (const item of items) {
        const qty = Number(item.qty) || 0;
        finalSubtotal += (Number(item.unit_price) || 0) * qty;
        originalSubtotal += originalUnitPrice(item) * qty;
    }

    originalSubtotal = round2(originalSubtotal);
    finalSubtotal = round2(finalSubtotal);
    const discountAmount = round2(Math.max(0, originalSubtotal - finalSubtotal));

    return {
        originalSubtotal,
        finalSubtotal,
        discountAmount,
        hasDiscount: discountAmount > 0,
    };
}
