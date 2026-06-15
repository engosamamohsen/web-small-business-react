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

export interface SubscriptionStatus {
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  remaining_days?: number;
  is_grace?: boolean;
  grace_end_date?: string | null;
  remaining_grace_days?: number;
  can_access?: boolean;
}

export interface CurrentSubscriptionPlan {
  id?: number;
  name?: string;
  name_en?: string;
  name_ar?: string;
  type?: string;
  subscription_status?: SubscriptionStatus | null;
  // Other plan fields (price_type, features, …) are passed through untouched.
  [key: string]: unknown;
}

/**
 * True when the store should be locked out (expired subscription + grace, or
 * access explicitly revoked). Missing data → false (store stays available).
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
