# Free Trial Plan — `type: "trial"` (days cap + orders cap)

> **Status:** ✅ Implemented (2026-07-20). 🟢 canonical.
> **Code:** `isTrialPlan()` / `isOrderQuotaExhausted()` in `src/lib/subscription.ts`;
> enforced in `src/components/Cart/Cart.tsx` (`orderingBlocked`).
> **Related:** [subscription-tier-detection.md](subscription-tier-detection.md)
> (`Plus` vs `Basic`), [expired-subscription-lockout.md](expired-subscription-lockout.md)
> (the days cap / lockout screen), [README.md](README.md) (the two "plan" systems).

---

## What a trial store is

A tenant on the free trial returns `current_subscription_plan.type: "trial"`
(display name «تجربة مجانية» / "Free Trial"). It is a **normal, fully browsable
store with two caps** — not a disabled one:

| Cap | Field(s) | Rule | Effect when hit |
| --- | --- | --- | --- |
| **Days** | `subscription_status.remaining_days` | the **same** `isStoreExpired()` rule as a paid plan (grace is always `0` on a trial, so days alone decide) | **full lockout** → `/store-unavailable` |
| **Orders** | `subscription_status.remaining_orders`, else `orders_count` vs `orders_limit` | `isOrderQuotaExhausted()` | store **stays browsable**; only *placing a new order* is blocked |

Nothing else about a trial differs from a Basic store.

## Full response (`GET v1/setting-profile`, tenant `darsh`)

```jsonc
{
  "status": true,
  "data": {
    "id": 1,
    "plan_type": "trial",          // mirror of the plan type — NOT the field we read
    "plan_max_orders": 10,
    "name": "darsh",
    "phone": "0123653214",
    "whatsapp_phone": null,        // → falls back to `phone`, see the WhatsApp doc
    "vat": "0.00",
    "shop_type": "restaurant"
  },
  "current_subscription_plan": {
    "id": 3,
    "name": "تجربة مجانية",
    "name_en": "Free Trial",
    "type": "trial",               // ← the signal we read
    "is_trial": true,              // ← fallback signal
    "max_orders": 10,
    "trial_days": 8,
    "price_per_order": null,
    "total_price": 0,
    "features": { "max_users": null, "max_branches": 2, "max_products": 10, "max_categories": 4 },
    "subscription_status": {
      "status": "trial",
      "start_date": "2026-07-16 00:00:00",
      "end_date": "2026-07-24 00:00:00",
      "remaining_days": 4,         // ← days cap
      "orders_count": 0,           // ← orders cap
      "orders_limit": 10,
      "remaining_orders": 10,
      "grace_orders_count": 0,
      "is_grace": false,
      "grace_end_date": null,
      "remaining_grace_days": 0,   // trials have no grace concept
      "can_access": true
    }
  }
}
```

> As with tier detection, we read **`current_subscription_plan.type`**, not
> `data.plan_type`.

## The rules

### `isTrialPlan(plan)`

```
plan.type === "trial"   → true     (case-insensitive, trimmed)
plan.is_trial === true  → true     (fallback when `type` is missing)
otherwise               → false
```

On its own this predicate **hides nothing** — the two caps are enforced
separately, so it is only ever an input to them.

### Trial is **not** Plus

`isPlusPlan()` returns **false** for `type: "trial"`, checked *before* the legacy
name heuristic so a trial whose display name contains "plus" can't be misread.
This is correct per the trial's own feature list, which excludes
«عرض بيانات العميل (الاسم - رقم الهاتف - العنوان)» — so the cart keeps the
**Basic** WhatsApp flow (no customer form, no VAT line).

### `isOrderQuotaExhausted(plan)`

```
not a trial plan                       → false   (never blocks a paid tenant)
no subscription_status                 → false   (fail open)
remaining_orders present               → remaining_orders <= 0
else orders_count & orders_limit > 0   → orders_count >= orders_limit
else                                   → false   (unlimited / unknown → fail open)
```

- **Fails OPEN everywhere ambiguous** — missing plan, missing status, missing
  quota fields, or `orders_limit` null/`0` (= unlimited). A backend hiccup must
  never stop a store from taking orders.
- **Scoped to trial plans on purpose.** Paid tiers bill *per order* rather than
  capping them, so a stray quota field on a Basic/Plus plan must not block it.
- `null` is treated as "no value", not as `0` — `remaining_orders: null` means
  unknown (fail open), **not** exhausted.

## What the shopper sees when the order quota runs out

In `OrderSummary` (`src/components/Cart/Cart.tsx`) the order button is replaced
by a neutral notice:

> المتجر لا يستقبل طلبات جديدة حالياً

- **Deliberately says nothing about plans, trials, quotas or remaining days.**
  The store's billing state is none of the shopper's business — remaining days /
  orders are **never** rendered anywhere customer-facing.
- Everything else keeps working: catalogue, product pages, cart, quantity
  +/−, remove, totals, the contact-WhatsApp button.
- `handleWhatsAppOrder()` re-checks the same flag and toasts the same message —
  the plan can arrive *after* first paint via the client-side settings refresh
  (a `localStorage` cache hit omits `current_subscription_plan`, so the SSR prop
  is authoritative until a fresh response replaces it).

> ⚠️ If the backend *also* flips `can_access: false` once the quota is spent, the
> existing lockout wins and the store goes fully unavailable. That is the
> backend's call — the frontend does not override it. Worth confirming which
> behavior the backend implements.

## Files

| File | Change |
| --- | --- |
| `src/lib/subscription.ts` | **New:** `isTrialPlan()`, `isOrderQuotaExhausted()`, the `orders_count` / `orders_limit` / `remaining_orders` / `grace_orders_count` fields on `SubscriptionStatus`, and `is_trial` / `max_orders` on `CurrentSubscriptionPlan`. `isPlusPlan()` now returns false for `"trial"` explicitly. |
| `src/components/Cart/Cart.tsx` | `orderingBlocked` → `OrderSummary` renders the notice instead of the order button; same guard inside `handleWhatsAppOrder`. |
| `src/lib/subscription.test.ts` | Trial detection, both caps, fail-open cases, "paid plan is never blocked" (28 new tests). |

## Verification (2026-07-20, live `admin-darsh`)

`npm test` → **92 pass**; `astro check` → **0 errors**. In the browser
(`npm run dev`, `PUBLIC_DEV_API_ORIGIN=https://admin-darsh.cashierthru.com`):

| Case | Result |
| --- | --- |
| Trial with `remaining_days: 4` | ✅ store browses normally — no lockout |
| Cart with quota intact (`remaining_orders: 10`) | ✅ existing path unchanged (here: the WhatsApp-unavailable notice, since darsh has no usable number) |
| `remaining_orders` spoofed to `0` | ✅ order button replaced by «المتجر لا يستقبل طلبات جديدة حالياً»; items, quantities and totals still work |

**How to re-verify the block without draining the real quota:** dev hits the
**live** backend — do **not** place 10 real orders. Temporarily set
`remaining_orders = 0` on `currentSubscriptionPlan.subscription_status` in
`src/pages/shop/cart.astro` before it is passed to the cart, reload
`/shop/cart`, then revert.
