# Subscription Tier Detection — `Plus` vs `Basic` by `type`

> **Status:** ✅ Implemented (2026-07-06). 🟢 canonical.
> **Code:** `isPlusPlan()` in `src/lib/subscription.ts`; consumed by
> `src/components/Cart/Cart.tsx` (`isPlusOrder`).
> **Related:** [README.md](README.md) (the two "plan" systems),
> [plus-plan-guest-order.md](plus-plan-guest-order.md) (the Plus cart order flow),
> [expired-subscription-lockout.md](expired-subscription-lockout.md) (`isStoreExpired`).

---

## What changed

The **subscription tier** (`Plus` vs `Basic`) is now decided by the explicit
**`current_subscription_plan.type`** field from `GET v1/setting-profile` — **not**
by the plan **name** as before.

| | Before | After |
| --- | --- | --- |
| Signal | `current_subscription_plan.name` / `name_en` contains "plus" | `current_subscription_plan.type` (`"plus"` / `"basic"`) |
| Authority | name heuristic only | `type` is authoritative; name is a legacy fallback only |

The backend now sets `type` to `"plus"` or `"basic"` on **every** tenant, so the
name string no longer needs to be pattern-matched.

## The rule — `isPlusPlan(plan)`

```
plan.type === "plus"   → Plus   (true)
plan.type === "basic"  → Basic  (false)
plan.type === "trial"  → Basic  (false)  ← free trial, see free-trial-plan.md
otherwise              → fall back to the legacy name heuristic
                          (name / name_en contains "plus")
missing / null plan    → false  (default: hide customer-info features)
```

- **`type` wins over the name.** A plan typed `"basic"` is Basic even if its
  display name contains "plus", and vice-versa.
- **`"trial"` (the free trial) is explicitly not Plus** — its feature list
  excludes customer data (name / phone / address), so it takes the Basic cart
  flow. Checked *before* the name fallback, so a trial named "Plus Trial" can't
  slip through. The trial's own caps (days + order quota) are separate:
  [free-trial-plan.md](free-trial-plan.md).
- The `type` comparison is **case-insensitive** and trimmed (`" PLUS "` → Plus).
- The **fallback** covers responses where `type` is missing or an unrecognized
  legacy value (e.g. the old `"normal"`): it matches the plan `name` / `name_en`
  the way the previous implementation did, so an un-migrated tenant still resolves
  correctly.
- **Fails safe:** any missing / nullish / unknown plan → not Plus, so the
  customer-info form and VAT line stay hidden by default and the existing Basic
  flow is never regressed.

## What the tier controls (unchanged)

Only the **detection input** changed — everything downstream flows through
`isPlusPlan()` and is untouched. In WhatsApp checkout mode
(`storeConfig.checkoutMode === "whatsapp"`):

```ts
isPlusOrder = isPlusPlan(subscriptionPlan) && storeConfig.checkoutMode === "whatsapp"
```

| Cart UI | `Basic` (`type: "basic"`) | `Plus` (`type: "plus"`) |
| --- | --- | --- |
| Customer form (name / phone / address) | ❌ hidden | ✅ shown (required) |
| Order notes box | ❌ hidden | ✅ optional |
| VAT (tax) line + recalculated total | ❌ subtotal only | ✅ `subtotal + subtotal×vat%` |
| `POST v1/basket/guest-buy` on order | ✅ background (empty customer fields, best-effort) | ✅ real order (customer data from the form) |

Full Plus order flow: [plus-plan-guest-order.md](plus-plan-guest-order.md).

## Example response (`GET v1/setting-profile`)

```jsonc
{
  "data": { "id": 1, "name": "مطعم عيدو", "vat": "2.00", "shop_type": "restaurant" },
  "current_subscription_plan": {
    "id": 2,
    "name": "Basic",
    "name_en": "Basic",
    "type": "basic",              // ← the tier signal (was matched on `name` before)
    "subscription_status": { "status": "active", "can_access": true }
  }
}
```

> Note: `data.plan_type` also appears in the response, but tier detection reads
> `current_subscription_plan.type` (the plan object), not `data.plan_type`.

## Files

| File | Change |
| --- | --- |
| `src/lib/subscription.ts` | `isPlusPlan()` keys off `plan.type` (authoritative); name heuristic kept as a legacy fallback. |
| `src/lib/subscription.test.ts` | Tests for `type`-based detection + "type wins over name" + legacy-name fallback (11 pass). |

## Verification

Verified live against the dev tenant (`admin-asly`, `npm run dev`), which now
returns `current_subscription_plan.type: "basic"`:

| Case | Customer form | VAT line |
| --- | --- | --- |
| Real tenant — `type: "basic"` | ❌ hidden | ❌ hidden |
| Forced `type: "plus"` (reverted after) | ✅ shown (name/phone/address/notes) | ✅ shown |

Both directions exercised the new `type`-based path; the temporary Plus override
was reverted and the real Basic behavior re-confirmed. Unit tests: `npm test`.
