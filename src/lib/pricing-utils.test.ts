import { describe, it, expect } from "vitest";
import {
  getDiscountedPrice,
  getDiscountSavings,
  getEffectiveDiscount,
  getLinePrices,
} from "./pricing-utils";

describe("getEffectiveDiscount", () => {
  it("prefers the explicit discount percentage", () => {
    expect(getEffectiveDiscount(100, 10, 90)).toBe(10);
    expect(getEffectiveDiscount(100, "25")).toBe(25);
  });

  it("derives the percentage from price → price_after when discount is absent", () => {
    // Real-data case: discount field is 0/empty, only price_after carries it.
    expect(getEffectiveDiscount(100, 0, 90)).toBe(10);
    expect(getEffectiveDiscount(100, null, 75)).toBe(25);
  });

  it("returns 0 when there is no discount", () => {
    expect(getEffectiveDiscount(100, 0, 100)).toBe(0);
    expect(getEffectiveDiscount(100)).toBe(0);
    expect(getEffectiveDiscount(100, 0, 120)).toBe(0); // price_after >= price
  });
});

describe("discount applies to the base price only; extras at full price (server rule)", () => {
  // The server (OrderCalculationService) prices the order this way, and so do the
  // dashboard and the cashier app: price 100, +10 EGP extra, 10% off → 90 + 10 = 100.
  const price = 100;
  const addition = 10;

  it("yields 100 when the discount comes from the discount field", () => {
    const discount = getEffectiveDiscount(price, 10, undefined);
    expect(getLinePrices(price, discount, addition)).toEqual({ original: 110, final: 100, saving: 10 });
  });

  it("yields 100 when the discount is encoded only via price_after", () => {
    const discount = getEffectiveDiscount(price, 0, 90);
    expect(getLinePrices(price, discount, addition).final).toBe(100);
  });

  it("counts the extra once per piece, never discounted", () => {
    expect(getLinePrices(100, 0, 10)).toEqual({ original: 110, final: 110, saving: 0 });
    expect(getLinePrices(80, 25, 2.5)).toEqual({ original: 82.5, final: 62.5, saving: 20 });
  });

  it("still discounts the base correctly with no additions", () => {
    const discount = getEffectiveDiscount(price, 0, 90);
    expect(getDiscountedPrice(price, discount)).toBe(90);
    expect(getDiscountSavings(price, discount)).toBe(10);
    expect(getLinePrices(price, discount).final).toBe(90);
  });
});
