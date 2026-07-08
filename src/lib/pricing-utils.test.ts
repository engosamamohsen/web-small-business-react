import { describe, it, expect } from "vitest";
import {
  getDiscountedPrice,
  getDiscountSavings,
  getEffectiveDiscount,
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

describe("discount applies to the full total (base + additions)", () => {
  // Reproduces the reported bug: price 100, +10 EGP addition, 10% off.
  const price = 100;
  const addition = 10;
  const preDiscountTotal = price + addition; // 110

  it("yields 99, not 100, when discount comes from the discount field", () => {
    const discount = getEffectiveDiscount(price, 10, undefined);
    expect(getDiscountedPrice(preDiscountTotal, discount)).toBe(99);
  });

  it("yields 99 when the discount is encoded only via price_after", () => {
    const discount = getEffectiveDiscount(price, 0, 90);
    expect(getDiscountedPrice(preDiscountTotal, discount)).toBe(99);
  });

  it("still discounts the base correctly with no additions", () => {
    const discount = getEffectiveDiscount(price, 0, 90);
    expect(getDiscountedPrice(price, discount)).toBe(90);
    expect(getDiscountSavings(price, discount)).toBe(10);
  });
});
