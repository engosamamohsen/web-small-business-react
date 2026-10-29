import { describe, it, expect } from "vitest";
import { computeOrderTotals, parseVatRate, totalsFromServerOrder } from "./order-totals";
import { getLinePrices } from "@/lib/pricing-utils";
import { buildWhatsAppOrderMessage } from "@/lib/whatsapp-order";
import type { CartItemType } from "@/types/types";

// Worked example (QA product «QA منتج خيارات»): price 100, 10% off the base,
// extras +20, +15, +10, quantity 2, store VAT 14%.
//   piece  = (100 − 10) + 45 = 135
//   sub    = 135 × 2         = 270      (OrderCalculationService::calculateLineItem)
//   VAT    = 14 × 270 / 100  = 37.80    (calculateOrderTotals)
//   total  = 270 + 37.80     = 307.80   (what orders.total stores)
const piece = getLinePrices(100, 10, 20 + 15 + 10).final;
const subtotal = piece * 2;

describe("computeOrderTotals (mirrors BasketController / OrderCalculationService)", () => {
  it("worked example: sub_total 270, VAT 37.80, total 307.80", () => {
    expect(piece).toBe(135);
    expect(subtotal).toBe(270);
    expect(computeOrderTotals({ subtotal, vatRate: "14" })).toEqual({
      subtotal: 270,
      vatRate: 14,
      vat: 37.8,
      shipping: 0,
      total: 307.8,
    });
  });

  it("adds the delivery fee after VAT (VAT is on the sub-total only)", () => {
    const totals = computeOrderTotals({ subtotal, vatRate: 14, shipping: 30 });
    expect(totals.vat).toBe(37.8);
    expect(totals.shipping).toBe(30);
    expect(totals.total).toBe(337.8);
  });

  it("no-VAT store: total = sub-total (+ delivery)", () => {
    for (const vat of [0, "0", "0.00", "", null, undefined, "abc"]) {
      expect(computeOrderTotals({ subtotal, vatRate: vat as any })).toEqual({
        subtotal: 270,
        vatRate: 0,
        vat: 0,
        shipping: 0,
        total: 270,
      });
    }
    expect(computeOrderTotals({ subtotal, vatRate: 0, shipping: 25 }).total).toBe(295);
  });

  it("rounds the shown VAT and total to 2 decimals", () => {
    const totals = computeOrderTotals({ subtotal: 99.99, vatRate: "14.00" });
    expect(totals.vat).toBe(14);
    expect(totals.total).toBe(113.99);
  });
});

describe("parseVatRate", () => {
  it("reads settings.vat strings and numbers, never negative", () => {
    expect(parseVatRate("14.00")).toBe(14);
    expect(parseVatRate(5)).toBe(5);
    expect(parseVatRate("-3")).toBe(0);
    expect(parseVatRate(undefined)).toBe(0);
  });
});

describe("totalsFromServerOrder", () => {
  it("reads the stored totals from the guest-buy response order", () => {
    expect(totalsFromServerOrder({ sub_total: 270, vat: 37.8, shipping: 0, total: 307.8 })).toEqual({
      subtotal: 270,
      vatRate: 14,
      vat: 37.8,
      shipping: 0,
      total: 307.8,
    });
  });

  it("returns null when the response has no total", () => {
    expect(totalsFromServerOrder(undefined)).toBeNull();
    expect(totalsFromServerOrder({ sub_total: 270 })).toBeNull();
    expect(totalsFromServerOrder({ total: "x" })).toBeNull();
  });
});

describe("WhatsApp message carries the VAT line and the server total", () => {
  const item = {
    cart_item_id: 1,
    product_id: "42938",
    product_name: "QA منتج خيارات",
    qty: "2",
    unit_price: 135,
    original_unit_price: 145,
    item_total: 270,
    variations: [],
  } as unknown as CartItemType;

  it("shows VAT 14% and total 307.80", () => {
    const totals = computeOrderTotals({ subtotal: 270, vatRate: 14 });
    const message = buildWhatsAppOrderMessage([item], totals.total, "متجر", null, null, {
      rate: totals.vatRate,
      amount: totals.vat,
    });
    expect(message).toContain("الضريبة (14%): 37.80 ج.م");
    expect(message).toContain("*الإجمالي: 307.80 ج.م*");
  });

  it("no VAT line when the store has none", () => {
    const message = buildWhatsAppOrderMessage([item], 270, "متجر", null, null, null);
    expect(message).not.toContain("الضريبة");
    expect(message).toContain("*الإجمالي: 270 ج.م*");
  });
});
