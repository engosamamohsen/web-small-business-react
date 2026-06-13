// ─── Local (offline) cart for the BASIC store plan ───────────────────────────
//
// Stored in localStorage so it survives refresh/restart and never needs an
// account. Items intentionally mirror the API cart's CartItemType shape
// ({cart_item_id, product_id, product_name, qty, unit_price, item_total, …})
// so Cart.tsx renders either backend unchanged.

import type { CartItemType, CartResponseType } from "@/types/types";

const STORAGE_KEY = "local_cart_v1";
/** Fired on every mutation so headers/badges can resync. */
export const LOCAL_CART_EVENT = "local-cart-changed";

function isBrowser(): boolean {
    return typeof window !== "undefined";
}

function notifyChange(): void {
    if (isBrowser()) window.dispatchEvent(new CustomEvent(LOCAL_CART_EVENT));
}

function readItems(): CartItemType[] {
    if (!isBrowser()) return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeItems(items: CartItemType[]): void {
    if (!isBrowser()) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // storage full/blocked — cart simply won't persist
    }
    notifyChange();
}

/** Same response shape as GET v1/basket so consumers don't care which backend. */
export function readLocalCart(): CartResponseType {
    const cart_items = readItems();
    return {
        cart_items,
        total_price: cart_items.reduce(
            (sum, item) => sum + (Number(item.item_total) || 0),
            0,
        ),
        items_count: cart_items.reduce(
            (sum, item) => sum + (Number(item.qty) || 0),
            0,
        ),
    } as CartResponseType;
}

export function localCartCount(): number {
    return readItems().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

/** Resolve the final per-unit price from an addToCart payload. */
function resolveUnitPrice(product: any): number {
    // local_unit_price is set by CartActions and is ALREADY discounted and
    // includes variation extras; everything else falls back to base price.
    if (product?.local_unit_price != null)
        return Number(product.local_unit_price) || 0;
    if (product?.price_after != null) return Number(product.price_after) || 0;
    const base = Number(product?.price) || 0;
    const discount = parseFloat(String(product?.discount ?? 0)) || 0;
    return discount > 0
        ? Math.round(base * (1 - discount / 100) * 100) / 100
        : base;
}

/** Two payloads are the same cart line if product + options + note match. */
function lineKey(product: any): string {
    return JSON.stringify([
        product?.id,
        product?.variations ?? null,
        product?.currentSize?.id ?? null,
        product?.currentColor?.id ?? null,
        product?.product_note || null,
    ]);
}

/**
 * Add a product (the same payload useCartHook.addToCart receives:
 * {...product, count, currentColor, currentSize, product_note, variations}).
 */
export function addLocalCartItem(product: any): CartResponseType {
    const items = readItems();
    const qty = Number(product?.count) || 1;
    const unitPrice = resolveUnitPrice(product);
    const key = lineKey(product);

    const existing = items.find((item) => (item as any).line_key === key);
    if (existing) {
        const newQty = (Number(existing.qty) || 0) + qty;
        existing.qty = String(newQty);
        existing.item_total =
            Math.round(Number(existing.unit_price) * newQty * 100) / 100;
    } else {
        items.push({
            cart_item_id: Date.now() + Math.floor(Math.random() * 1000),
            product_id: String(product?.id ?? ""),
            product_name: product?.name ?? "",
            product_image:
                product?.product_image ||
                product?.main_image ||
                product?.image ||
                "",
            qty: String(qty),
            unit_price: unitPrice,
            item_total: Math.round(unitPrice * qty * 100) / 100,
            product_note: product?.product_note || null,
            variations: [],
            // internal — used to merge repeated adds of the same line
            line_key: key,
        } as CartItemType & { line_key: string });
    }

    writeItems(items);
    return readLocalCart();
}

export function updateLocalCartQty(
    cartItemId: number,
    qty: number,
): CartResponseType {
    const items = readItems();
    const item = items.find((i) => i.cart_item_id === cartItemId);
    if (item) {
        const newQty = Math.max(1, Number(qty) || 1);
        item.qty = String(newQty);
        item.item_total =
            Math.round(Number(item.unit_price) * newQty * 100) / 100;
        writeItems(items);
    }
    return readLocalCart();
}

export function removeLocalCartItem(cartItemId: number): CartResponseType {
    writeItems(readItems().filter((i) => i.cart_item_id !== cartItemId));
    return readLocalCart();
}

export function clearLocalCart(): void {
    writeItems([]);
}
