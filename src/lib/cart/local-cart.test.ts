import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { addLocalCartItem, readLocalCart, updateLocalCartQty } from "./local-cart";
import { getCartDiscountSummary } from "./cart-totals";
import { buildGuestOrderItems } from "@/lib/guest-order";

// A tiny in-memory window/localStorage so the BASIC-plan cart runs under node.
function stubBrowser() {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
    });
    vi.stubGlobal("window", { dispatchEvent: () => true });
    vi.stubGlobal("CustomEvent", class { constructor(public type: string) {} });
}

beforeEach(stubBrowser);
afterEach(() => vi.unstubAllGlobals());

// Base 100, required single choice +5 (auto-selected), customer picked +10: unit 115.
const payload = (choices: number[] = [11, 21], extra = { qty: 1 }) => ({
    id: 7,
    name: "برجر",
    price: 100,
    count: extra.qty,
    variations: [
        { main_variation_id: "2", main_variation_name: "الحجم", choices: [{ id: choices[1], name: "كبير", price: 5 }] },
        { main_variation_id: "1", main_variation_name: "الصوص", choices: [{ id: choices[0], name: "جبنة", price: 10 }] },
    ],
    local_unit_price: 115,
    local_original_unit_price: 115,
});

describe("local cart lines with option extras", () => {
    it("merges a re-add with the same choices (even in another order) into one line", () => {
        addLocalCartItem(payload());
        const reordered = payload();
        reordered.variations.reverse();
        addLocalCartItem(reordered);

        const cart = readLocalCart();
        expect(cart.cart_items).toHaveLength(1);
        expect(cart.cart_items[0].qty).toBe("2");
        expect(cart.cart_items[0].unit_price).toBe(115);
        expect(cart.cart_items[0].item_total).toBe(230);
        expect(cart.total_price).toBe(230);
    });

    it("keeps different choices on separate lines", () => {
        addLocalCartItem(payload([11, 21]));
        addLocalCartItem(payload([12, 21]));
        expect(readLocalCart().cart_items).toHaveLength(2);
    });

    it("editing the quantity reprices from the unit price (extras once per unit)", () => {
        addLocalCartItem(payload());
        const id = readLocalCart().cart_items[0].cart_item_id;
        updateLocalCartQty(id, 3);
        const cart = readLocalCart();
        expect(cart.cart_items[0].item_total).toBe(345);
        expect(getCartDiscountSummary(cart.cart_items)).toMatchObject({ finalSubtotal: 345, hasDiscount: false });
    });

    it("without a precomputed price, the original unit price is base + extras once", () => {
        const p = payload();
        delete (p as any).local_original_unit_price;
        addLocalCartItem(p);
        expect(readLocalCart().cart_items[0].original_unit_price).toBe(115);
    });

    it("the guest-buy payload sends choice ids only", () => {
        addLocalCartItem(payload());
        const items = buildGuestOrderItems(readLocalCart().cart_items);
        expect(items[0].variations).toEqual([
            { main_variation_id: 2, choices: [21] },
            { main_variation_id: 1, choices: [11] },
        ]);
        expect(JSON.stringify(items)).not.toContain("price");
    });
});

describe("server pricing rule: discount on the base only, extras at full price", () => {
    it("price 100, +10 extra, 10% off → unit 100 (90 + 10), original 110", () => {
        const p: any = payload();
        p.variations = [{ main_variation_id: "1", main_variation_name: "الصوص", choices: [{ id: 11, name: "جبنة", price: 10 }] }];
        p.discount = 10;
        delete p.local_unit_price;
        delete p.local_original_unit_price;
        addLocalCartItem({ ...p, count: 2 });
        const item = readLocalCart().cart_items[0];
        expect(item.unit_price).toBe(100);
        expect(item.original_unit_price).toBe(110);
        expect(item.item_total).toBe(200);
        expect(getCartDiscountSummary(readLocalCart().cart_items)).toEqual({
            originalSubtotal: 220,
            finalSubtotal: 200,
            discountAmount: 20,
            hasDiscount: true,
        });
    });

    it("with only price_after from the API, the extra is still added once", () => {
        const p: any = payload();
        p.variations = [{ main_variation_id: "1", main_variation_name: "الصوص", choices: [{ id: 11, name: "جبنة", price: 10 }] }];
        p.price_after = 90;
        delete p.local_unit_price;
        addLocalCartItem(p);
        expect(readLocalCart().cart_items[0].unit_price).toBe(100);
    });
});
