import { describe, it, expect } from "vitest";
import { isPlusPlan, isStoreExpired } from "./subscription";

describe("isPlusPlan", () => {
  it("is true for the Plus plan by name", () => {
    expect(isPlusPlan({ id: 4, name: "Plus" })).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isPlusPlan({ name: "plus" })).toBe(true);
  });

  it("matches the English label too", () => {
    expect(isPlusPlan({ name: "باقة بلس", name_en: "Plus Plan" })).toBe(true);
  });

  it("is false for the Basic plan", () => {
    expect(isPlusPlan({ id: 1, name: "Basic" })).toBe(false);
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
