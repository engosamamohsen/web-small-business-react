import { describe, it, expect } from "vitest";
import {
  isPlusPlan,
  isStoreExpired,
  isTrialPlan,
  isOrderQuotaExhausted,
} from "./subscription";

// The real free-trial plan as admin-darsh returns it (v1/setting-profile).
const trialPlan = {
  id: 3,
  name: "تجربة مجانية",
  name_en: "Free Trial",
  type: "trial",
  is_trial: true,
  max_orders: 10,
  trial_days: 8,
  subscription_status: {
    status: "trial",
    remaining_days: 4,
    orders_count: 0,
    orders_limit: 10,
    remaining_orders: 10,
    grace_orders_count: 0,
    is_grace: false,
    remaining_grace_days: 0,
    can_access: true,
  },
};

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

  it("keeps a running free trial available (days left, no grace concept)", () => {
    expect(isStoreExpired(trialPlan)).toBe(false);
  });

  it("locks out a finished free trial (no days, no grace)", () => {
    expect(
      isStoreExpired({
        ...trialPlan,
        subscription_status: {
          ...trialPlan.subscription_status,
          remaining_days: 0,
        },
      }),
    ).toBe(true);
  });

  it("does NOT lock out a trial that only ran out of orders", () => {
    expect(
      isStoreExpired({
        ...trialPlan,
        subscription_status: {
          ...trialPlan.subscription_status,
          orders_count: 10,
          remaining_orders: 0,
        },
      }),
    ).toBe(false);
  });
});

describe("isTrialPlan", () => {
  it("detects the free trial by type", () => {
    expect(isTrialPlan(trialPlan)).toBe(true);
    expect(isTrialPlan({ type: " TRIAL " })).toBe(true);
  });

  it("falls back to the is_trial flag when type is missing", () => {
    expect(isTrialPlan({ is_trial: true })).toBe(true);
  });

  it("is false for paid plans and missing data", () => {
    expect(isTrialPlan({ type: "basic" })).toBe(false);
    expect(isTrialPlan({ type: "plus" })).toBe(false);
    expect(isTrialPlan(null)).toBe(false);
    expect(isTrialPlan({})).toBe(false);
  });

  it("is not treated as Plus (trial has no customer-info features)", () => {
    expect(isPlusPlan(trialPlan)).toBe(false);
    // even if the display name happens to say "plus"
    expect(isPlusPlan({ type: "trial", name: "Plus Trial" })).toBe(false);
  });
});

describe("isOrderQuotaExhausted", () => {
  it("allows orders while the trial quota remains", () => {
    expect(isOrderQuotaExhausted(trialPlan)).toBe(false);
  });

  it("blocks orders once remaining_orders hits 0", () => {
    expect(
      isOrderQuotaExhausted({
        ...trialPlan,
        subscription_status: {
          ...trialPlan.subscription_status,
          orders_count: 10,
          remaining_orders: 0,
        },
      }),
    ).toBe(true);
  });

  it("falls back to orders_count vs orders_limit when remaining_orders is absent", () => {
    const status = { status: "trial", orders_count: 10, orders_limit: 10 };
    expect(isOrderQuotaExhausted({ type: "trial", subscription_status: status })).toBe(
      true,
    );
    expect(
      isOrderQuotaExhausted({
        type: "trial",
        subscription_status: { ...status, orders_count: 9 },
      }),
    ).toBe(false);
  });

  it("fails open on missing / unlimited quota data", () => {
    expect(isOrderQuotaExhausted({ type: "trial" })).toBe(false);
    expect(isOrderQuotaExhausted({ type: "trial", subscription_status: {} })).toBe(false);
    // orders_limit null/0 means "no cap" — must not read as an exhausted quota
    expect(
      isOrderQuotaExhausted({
        type: "trial",
        subscription_status: { orders_count: 5, orders_limit: null },
      }),
    ).toBe(false);
  });

  it("never blocks a paid plan, even if it reports a quota", () => {
    const status = { orders_count: 50, orders_limit: 50, remaining_orders: 0 };
    expect(isOrderQuotaExhausted({ type: "basic", subscription_status: status })).toBe(
      false,
    );
    expect(isOrderQuotaExhausted({ type: "plus", subscription_status: status })).toBe(
      false,
    );
  });
});
