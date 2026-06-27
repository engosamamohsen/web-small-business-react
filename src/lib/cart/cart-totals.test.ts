import { describe, it, expect } from "vitest";
import { getCartDiscountSummary, originalUnitPrice } from "./cart-totals";
import { buildWhatsAppOrderMessage } from "@/lib/whatsapp-order";
import type { CartItemType } from "@/types/types";

const item = (over: Partial<CartItemType> = {}): CartItemType =>
  ({
    cart_item_id: 1,
    product_id: "8",
    product_name: "فتة شاورما فراخ",
    qty: "1",
    unit_price: 90,
    item_total: 90,
    variations: [],
    ...over,
  }) as CartItemType;

describe("originalUnitPrice", () => {
  it("returns the original when it is higher than the final", () => {
    expect(originalUnitPrice(item({ unit_price: 90, original_unit_price: 100 }))).toBe(100);
  });

  it("falls back to the final price when no original (or not higher)", () => {
    expect(originalUnitPrice(item({ unit_price: 90 }))).toBe(90);
    expect(originalUnitPrice(item({ unit_price: 90, original_unit_price: 90 }))).toBe(90);
  });
});

describe("getCartDiscountSummary", () => {
  it("sums before/after totals and the saved amount across quantities", () => {
    const items = [
      item({ qty: "2", unit_price: 90, original_unit_price: 100 }), // saves 20
      item({ cart_item_id: 2, qty: "1", unit_price: 99, original_unit_price: 110 }), // saves 11
    ];
    const s = getCartDiscountSummary(items);
    expect(s.originalSubtotal).toBe(310); // 200 + 110
    expect(s.finalSubtotal).toBe(279); // 180 + 99
    expect(s.discountAmount).toBe(31);
    expect(s.hasDiscount).toBe(true);
  });

  it("reports no discount when items carry no original price", () => {
    const s = getCartDiscountSummary([item({ qty: "3", unit_price: 50 })]);
    expect(s.discountAmount).toBe(0);
    expect(s.hasDiscount).toBe(false);
    expect(s.originalSubtotal).toBe(150);
  });
});

describe("WhatsApp message — before/after discount", () => {
  it("includes the before-discount total and the saved amount", () => {
    const items = [item({ qty: "2", unit_price: 90, original_unit_price: 100 })];
    const msg = buildWhatsAppOrderMessage(items, 180, "متجر", "restaurant");
    expect(msg).toContain("الإجمالي قبل الخصم: 200");
    expect(msg).toContain("الخصم: -20");
    expect(msg).toContain("~100~ 90"); // struck original then final unit price
    expect(msg).toContain("الإجمالي: 180");
  });

  it("omits the discount block when there is no discount", () => {
    const items = [item({ qty: "1", unit_price: 100 })];
    const msg = buildWhatsAppOrderMessage(items, 100, "متجر", "restaurant");
    expect(msg).not.toContain("قبل الخصم");
    expect(msg).not.toContain("الخصم:");
  });
});
