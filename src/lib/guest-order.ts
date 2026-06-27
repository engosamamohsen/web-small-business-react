// ─── Plus-plan guest order (basket/guest-buy) ────────────────────────────────
//
// Plus-tier stores replace the WhatsApp checkout with a real server order. The
// cart (local for BASIC store mode) is sent directly to the basket/guest-buy
// endpoint together with the customer's name / address / phone and the chosen
// payment method — no authentication / account required (it's a guest order).
//
// Request shape (mirrors the backend contract):
//   {
//     items: [{ note, product_id, quantity, variations?: [{ main_variation_id, choices:[id] }] }],
//     payment_method: 1 | 2,   // 1 = cash on delivery, 2 = online
//     full_name, full_address, phone, notes
//   }

import { $api } from "@/client";
import type { CartItemType } from "@/types/types";

/** 1 = cash on delivery, 2 = online payment. */
export type GuestPaymentMethod = 1 | 2;

export interface GuestOrderVariation {
    main_variation_id: number;
    choices: number[];
}

export interface GuestOrderItem {
    note: string;
    product_id: number;
    quantity: number;
    variations?: GuestOrderVariation[];
}

export interface GuestOrderPayload {
    items: GuestOrderItem[];
    payment_method: GuestPaymentMethod;
    full_name: string;
    full_address: string;
    phone: string;
    notes: string;
}

/**
 * Map cart items (local or basket-API shape) to the `items` array guest-buy
 * expects. The cart's rich variation shape
 * (`{ main_variation_id, main_variation_name, choices: [{ id, name, price }] }`)
 * is normalized back to the API's `{ main_variation_id, choices: [id] }` — the
 * same normalization the basket/add path uses (see hooks/cart/cart.ts).
 */
export function buildGuestOrderItems(items: CartItemType[]): GuestOrderItem[] {
    return items.map((item) => {
        const entry: GuestOrderItem = {
            note: item.product_note ?? "",
            product_id: Number(item.product_id),
            quantity: Number(item.qty) || 1,
        };

        const variations = (item.variations ?? [])
            .filter((variation) => variation?.choices?.length)
            .map((variation) => ({
                main_variation_id: Number(variation.main_variation_id),
                choices: variation.choices.map((choice) =>
                    choice && typeof choice === "object"
                        ? Number(choice.id)
                        : Number(choice),
                ),
            }));

        if (variations.length) entry.variations = variations;
        return entry;
    });
}

/**
 * POST the guest order. Returns the parsed response body (the backend may
 * include a payment URL for online orders). Throws on network / API error so
 * the caller can surface a message and keep the cart intact.
 */
export async function submitGuestOrder(payload: GuestOrderPayload) {
    const { data } = await $api.post("v1/basket/guest-buy", payload);
    return data;
}

/**
 * Best-effort extraction of a gateway redirect URL from the guest-buy response
 * (online payment). The exact field name isn't part of a stable contract yet,
 * so we check the common shapes and return the first usable absolute URL.
 */
export function extractPaymentUrl(response: unknown): string | null {
    if (!response || typeof response !== "object") return null;
    const root = response as Record<string, any>;
    const candidates = [
        root.payment_url,
        root.url,
        root.redirect_url,
        root.invoice_url,
        root.data?.payment_url,
        root.data?.url,
        root.data?.redirect_url,
        root.data?.invoice_url,
    ];
    for (const value of candidates) {
        if (typeof value === "string" && /^https?:\/\//i.test(value)) {
            return value;
        }
    }
    return null;
}
