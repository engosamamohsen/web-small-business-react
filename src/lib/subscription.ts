// ─── Subscription / store-availability logic ─────────────────────────────────
//
// The setting-profile API returns a top-level `current_subscription_plan`
// (sibling of `data`). Its `subscription_status` tells us whether the store is
// still reachable. A store is considered EXPIRED / unavailable when:
//   • the paid period AND the grace period are both fully consumed
//     (remaining_days == 0  AND  remaining_grace_days == 0), OR
//   • the backend explicitly revokes access (can_access === false)
//
// We fail OPEN: a missing plan / status (older API, network error, store on a
// plan without a grace concept) keeps the store accessible so a backend hiccup
// never blanks out a paying tenant.
//
// The free trial (`type: "trial"`) is a normal, open store with two caps:
// `remaining_days` (enforced by isStoreExpired, same rule as a paid plan) and
// `orders_limit` / `orders_count` (enforced by isOrderQuotaExhausted, which
// blocks new orders only — the store stays browsable).

export interface SubscriptionStatus {
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  remaining_days?: number;
  is_grace?: boolean;
  grace_end_date?: string | null;
  remaining_grace_days?: number;
  can_access?: boolean;
  // Order quota — reported on plans that cap the number of orders (the free
  // trial caps at `orders_limit`, e.g. 10). See isOrderQuotaExhausted().
  orders_count?: number;
  orders_limit?: number | null;
  remaining_orders?: number | null;
  grace_orders_count?: number;
}

export interface CurrentSubscriptionPlan {
  id?: number;
  name?: string;
  name_en?: string;
  name_ar?: string;
  type?: string;
  /** Backend convenience flag, set alongside `type: "trial"`. */
  is_trial?: boolean;
  max_orders?: number | null;
  subscription_status?: SubscriptionStatus | null;
  // Other plan fields (price_type, features, …) are passed through untouched.
  [key: string]: unknown;
}

/**
 * True when the store is on the **Plus** subscription plan.
 *
 * Keyed off the explicit **`current_subscription_plan.type`** field, which the
 * backend now sets to `"plus"` or `"basic"` on every tenant. `type` is
 * authoritative: a plan typed `"basic"` is Basic even if its display name
 * happens to contain the word "plus", and vice-versa.
 *
 * A plan whose `type` is missing or an unrecognized legacy value (e.g. the old
 * `"normal"`) falls back to the previous name heuristic (`name` / `name_en`
 * containing "plus"), so a tenant on an un-migrated API response still resolves
 * correctly. Any other / missing plan → false, so customer-info features stay
 * hidden by default and the existing flow is never regressed.
 */
export function isPlusPlan(plan?: CurrentSubscriptionPlan | null): boolean {
  if (!plan) return false;

  // Primary, authoritative signal: the plan tier `type` ("plus" | "basic").
  const type = planType(plan);
  if (type === "plus") return true;
  if (type === "basic") return false;
  // A free trial is explicitly NOT Plus: its feature list excludes customer
  // data (name / phone / address), so the cart must stay on the Basic flow.
  // Checked before the name fallback so a trial named "Plus Trial" can't slip
  // through.
  if (type === "trial") return false;

  // Fallback for responses without a recognized tier `type`: match the name.
  return [plan.name, plan.name_en]
    .filter((n): n is string => typeof n === "string")
    .some((n) => n.trim().toLowerCase().includes("plus"));
}

/** Normalized plan tier: "plus" | "basic" | "trial" | "" (unknown/missing). */
function planType(plan: CurrentSubscriptionPlan): string {
  return typeof plan.type === "string" ? plan.type.trim().toLowerCase() : "";
}

/** A finite number, or null for missing / null / non-numeric values. */
function finite(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * True when the store is on the **free trial** plan
 * (`current_subscription_plan.type === "trial"`, e.g. "تجربة مجانية").
 *
 * A trial store is a NORMAL, browsable store — it is capped, not disabled:
 * it runs for `subscription_status.remaining_days` days and accepts at most
 * `subscription_status.orders_limit` orders. Both caps are enforced separately
 * (days by isStoreExpired, orders by isOrderQuotaExhausted), so this predicate
 * on its own never hides anything.
 *
 * Falls back to the backend's `is_trial` flag when `type` is missing.
 */
export function isTrialPlan(plan?: CurrentSubscriptionPlan | null): boolean {
  if (!plan) return false;
  if (planType(plan) === "trial") return true;
  return plan.is_trial === true;
}

/**
 * True when a capped plan has used up its order quota — the store may still
 * have days left, but it must not take another order.
 *
 * Reads `remaining_orders` when present, else `orders_count` vs `orders_limit`.
 * Fails OPEN in every ambiguous case (no status, no quota fields, `orders_limit`
 * null/0 = unlimited), so a paying tenant is never blocked by missing data.
 *
 * Scoped to trial plans on purpose: paid tiers bill per order rather than
 * capping them, and a stray quota field on a paid plan must not stop its orders.
 */
export function isOrderQuotaExhausted(
  plan?: CurrentSubscriptionPlan | null,
): boolean {
  if (!isTrialPlan(plan)) return false;

  const status = plan?.subscription_status;
  if (!status) return false; // no data → fail open

  const remaining = finite(status.remaining_orders);
  if (remaining !== null) return remaining <= 0;

  const used = finite(status.orders_count);
  const limit = finite(status.orders_limit);
  if (used === null || limit === null || limit <= 0) return false; // unlimited / unknown
  return used >= limit;
}

/**
 * True when the store should be locked out (expired subscription + grace, or
 * access explicitly revoked). Missing data → false (store stays available).
 *
 * Trial stores go through the SAME rule: a trial with `remaining_days > 0` is
 * open (grace is always 0 on a trial, so the days check is what decides), and a
 * finished trial (`remaining_days: 0`) locks out exactly like an expired paid
 * plan. Running out of ORDERS does not lock the store — see
 * isOrderQuotaExhausted, which only blocks placing new ones.
 */
export function isStoreExpired(plan?: CurrentSubscriptionPlan | null): boolean {
  const status = plan?.subscription_status;
  if (!status) return false; // no data → fail open

  // Explicit revocation from the backend always wins.
  if (status.can_access === false) return true;

  // Both the subscription window and the grace window are exhausted.
  const daysGone = Number(status.remaining_days) === 0;
  const graceGone = Number(status.remaining_grace_days) === 0;
  return daysGone && graceGone;
}
