import { describe, it, expect } from "vitest";
import { isPlusPlan, isStoreExpired } from "./subscription";

describe("isPlusPlan", () => {
  it("is true when type is plus", () => {
    expect(isPlusPlan({ id: 4, type: "plus", name: "Plus" })).toBe(true);
  });

  it("is false when type is basic", () => {
    expect(isPlusPlan({ id: 2, type: "basic", name: "Basic" })).toBe(false);
  });

  it("is case-insensitive / trims the type", () => {
    expect(isPlusPlan({ type: " PLUS " })).toBe(true);
    expect(isPlusPlan({ type: "Basic" })).toBe(false);
  });

  it("lets type win over a misleading name", () => {
    // A plan typed basic is Basic even if its name contains "plus".
    expect(isPlusPlan({ type: "basic", name: "Plus Deluxe" })).toBe(false);
    // …and a plan typed plus is Plus even if its name says Basic.
    expect(isPlusPlan({ type: "plus", name: "Basic" })).toBe(true);
  });

  it("falls back to the name when type is missing/legacy", () => {
    expect(isPlusPlan({ id: 4, name: "Plus" })).toBe(true);
    expect(isPlusPlan({ name: "plus" })).toBe(true);
    expect(isPlusPlan({ name: "باقة بلس", name_en: "Plus Plan" })).toBe(true);
    expect(isPlusPlan({ id: 1, name: "Basic" })).toBe(false);
    // Legacy "normal" type is not a recognized tier → fall back to the name.
    expect(isPlusPlan({ type: "normal", name: "خطة الرسوم الثابتة" })).toBe(false);
    expect(isPlusPlan({ type: "normal", name: "Plus" })).toBe(true);
  });

  it("is false for missing / nullish plan (default hide)", () => {
    expect(isPlusPlan(null)).toBe(false);
    expect(isPlusPlan(undefined)).toBe(false);
    expect(isPlusPlan({})).toBe(false);
  });
});

describe("isStoreExpired", () => {
  it("fails open when there is no plan / status", () => {
    expect(isStoreExpired(null)).toBe(false);
    expect(isStoreExpired({})).toBe(false);
    expect(isStoreExpired({ subscription_status: null })).toBe(false);
  });

  it("locks out when access is explicitly revoked", () => {
    expect(isStoreExpired({ subscription_status: { can_access: false } })).toBe(true);
  });

  it("locks out when both paid days and grace days are exhausted", () => {
    expect(
      isStoreExpired({ subscription_status: { remaining_days: 0, remaining_grace_days: 0 } }),
    ).toBe(true);
  });

  it("stays available while paid days remain", () => {
    expect(
      isStoreExpired({ subscription_status: { remaining_days: 5, remaining_grace_days: 0 } }),
    ).toBe(false);
  });

  it("stays available during the grace period", () => {
    expect(
      isStoreExpired({ subscription_status: { remaining_days: 0, remaining_grace_days: 3 } }),
    ).toBe(false);
  });
});
