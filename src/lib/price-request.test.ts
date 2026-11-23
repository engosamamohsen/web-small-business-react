import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { askPriceHref, askPriceMessage, hasPricedChoice, isOnRequestProduct, ASK_PRICE } from "./price-request";

vi.mock("@/hooks/cart/cart", () => ({ useCartHook: () => ({ loading: false, addToCart: vi.fn() }) }));
vi.mock("@/lib/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("js-cookie", () => ({ default: { get: () => undefined } }));

const choice = (price: number, enable = true) => ({ id: String(price), name: `+${price}`, enable, price });
const group = (choices: any[], enable = true) => ({ id: "g", name: "Size", is_required: true, enable, choices });

// "Ask for the price" (owner decision 2026-11-23): a price-0 product never goes into the cart at 0.
describe("price on request products", () => {
    it("is a product with nothing to pay and no paid option", () => {
        expect(isOnRequestProduct({ price: 0 })).toBe(true);
        expect(isOnRequestProduct({ price: "0", variations: [] })).toBe(true);
        expect(isOnRequestProduct({ price: 50, discount: 100 })).toBe(true);
        expect(isOnRequestProduct({ price: 0, variations: [group([choice(0)])] as any })).toBe(true);
        expect(isOnRequestProduct({ price: 0, variations: [group([choice(20, false)])] as any })).toBe(true); // switched-off choice
        expect(isOnRequestProduct({ price: 0, variations: [group([choice(20)], false)] as any })).toBe(true); // switched-off group
    });

    it("is not a priced product, nor one whose price comes from an option", () => {
        expect(isOnRequestProduct({ price: 45 })).toBe(false);
        expect(isOnRequestProduct({ price: 100, discount: 10 })).toBe(false);
        expect(isOnRequestProduct({ price: 0, variations: [group([choice(0), choice(25)])] as any })).toBe(false);
        expect(hasPricedChoice([group([choice(25)])] as any)).toBe(true);
    });

    it("asks on WhatsApp with the product and its link, else calls, else nothing", () => {
        const url = "https://emandbuild.com/product/739/زوايا";
        const wa = askPriceHref({ whatsapp: "01012345678", phone: "0223456789" }, "زوايا الحوائط PS RT32", url)!;
        expect(wa.startsWith("https://wa.me/201012345678?text=")).toBe(true);
        expect(decodeURIComponent(wa.split("?text=")[1])).toBe(`السلام عليكم، عايز أعرف سعر: زوايا الحوائط PS RT32\n${url}`);
        expect(askPriceHref({ whatsapp: null, phone: "02 2345 6789" }, "X", url)).toBe("tel:0223456789");
        expect(askPriceHref({ whatsapp: "123", phone: null }, "X", url)).toBeNull();
        expect(askPriceHref(null, "X", url)).toBeNull();
        expect(askPriceMessage("  ", null)).toBe("السلام عليكم، عايز أعرف سعر: المنتج ده");
    });
});

describe("the product card button", () => {
    it("is 'اسأل عن السعر' for a price-0 product, and add-to-cart otherwise", async () => {
        const { ButtonAddToCart } = await import("@/components/Product/ButtonAddToCart");
        const ask = renderToStaticMarkup(createElement(ButtonAddToCart, { product: { id: 9, name: "Panel", price: 0, variations: [] } as any }));
        expect(ask).toContain(ASK_PRICE);
        expect(ask).not.toContain("أضف إلى السلة");
        const add = renderToStaticMarkup(createElement(ButtonAddToCart, { product: { id: 8, name: "Kofta", price: 120, variations: [] } as any }));
        expect(add).toContain("أضف إلى السلة");
        expect(add).not.toContain(ASK_PRICE);
        const fromOption = renderToStaticMarkup(createElement(ButtonAddToCart, {
            product: { id: 7, name: "Tray", price: 0, variations: [group([choice(150), choice(250)])] } as any,
        }));
        expect(fromOption).toContain("اختر الخيارات"); // the customer picks a paid size, then orders normally
    });
});
