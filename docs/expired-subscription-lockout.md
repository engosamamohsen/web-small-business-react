# Task: Handle Expired Subscription — Store Visibility Lockout

> **Status:** ✅ Implemented (2026-06-15).
> Expiry rule in `src/lib/subscription.ts`; plan parsing in
> `src/hooks/fetchSettings.tsx`; lockout screen in
> `src/pages/store-unavailable.astro`; enforcement in `src/middleware.ts`.
> **Created:** 2026-06-15
> **Related:** [subscription-modes-task.md](subscription-modes-task.md) (Basic/Premium plans),
> [multi-tenant-architecture.md](multi-tenant-architecture.md) (per-tenant API resolution),
> [free-trial-plan.md](free-trial-plan.md) (the trial's *orders* cap — browsable
> but can't order; the *days* cap is this doc's rule).

---

## Objective

When a tenant's subscription has expired (paid period **and** grace period
consumed, or the backend explicitly revokes access), the storefront must be
locked out: hide all homepage content (banners, categories, products,
promotional sections) and show a full-screen "store unavailable" screen
instead. Users must not be able to browse products or categories.

## Data source — `setting-profile` API

The expiry state comes from the **existing** settings endpoint, as a top-level
sibling of `data` (already fetched via `fetchSettings()`):

```http
GET v1/setting-profile
```

```json
{
  "data": { "id": 1, "name": "مطعم عيدو", "shop_type": "restaurant", "...": "..." },
  "current_subscription_plan": {
    "id": 4,
    "name": "Plus",
    "subscription_status": {
      "status": "grace",
      "remaining_days": 0,
      "remaining_grace_days": 1,
      "can_access": true
    }
  }
}
```

Read from: `current_subscription_plan.subscription_status`.

## Expiry rule

The store is **expired / unavailable** when:

```
can_access === false
  OR
(remaining_days === 0 AND remaining_grace_days === 0)
```

- **Fails open:** a missing plan / `subscription_status` (older API, network
  error, or a plan with no grace concept) keeps the store **available** — a
  backend hiccup must never blank out a paying tenant.
- Example above (`remaining_days: 0, remaining_grace_days: 1, can_access: true`)
  → **not** expired (grace period still active, store stays open).

Implemented as `isStoreExpired(plan)` in `src/lib/subscription.ts`.

### Free trials use this same rule

A trial tenant (`current_subscription_plan.type: "trial"`) has **no grace
concept** — `remaining_grace_days` is always `0` — so the rule above reduces to
`remaining_days`: a running trial is open, a finished trial (`remaining_days: 0`)
locks out exactly like an expired paid plan. No trial-specific code is involved
here.

A trial *also* has an **order quota** (`orders_limit`). Running out of **orders**
does **not** lock the store — it only blocks placing new ones, while browsing
stays fully available. That cap lives in `isOrderQuotaExhausted()` and is
documented separately: **[free-trial-plan.md](free-trial-plan.md)**.

## Enforcement — middleware (single point)

Every storefront page is SSR (`export const prerender = false`), so middleware
runs for the whole site. `src/middleware.ts`, after resolving the tenant
`apiBase`:

1. For `GET` page navigations only (skips the lockout page itself to avoid a
   rewrite loop), fetches settings (`fetchSettings`, server-cached per tenant).
2. If `isStoreExpired(...)` → `return context.rewrite("/store-unavailable")`.

A **rewrite** (not a redirect) preserves the URL and short-circuits *before*
the target page's frontmatter runs, so no product/category/banner data is
fetched for an expired store. Any error in the settings fetch fails open.

## Lockout screen — `/store-unavailable`

`src/pages/store-unavailable.astro` (`prerender = false`):

- Full-screen, centered: inline SVG illustration (shuttered, locked storefront —
  no external asset dependency), the message **"هذا المتجر لم يعد متاحا"**
  centered under it, and the shop logo/name when available (cache hit — no extra
  network call, middleware already warmed the per-tenant settings cache).
- **No Header/Footer** → nothing to navigate to; browsing is blocked both by the
  bare screen and by middleware rewriting every other route here.

## Files

| File | Change |
|---|---|
| `src/lib/subscription.ts` | **New.** `SubscriptionStatus` / `CurrentSubscriptionPlan` types + `isStoreExpired()`; later `isTrialPlan()` + `isOrderQuotaExhausted()` and the order-quota fields |
| `src/components/Cart/Cart.tsx` | Replaces the order button with a neutral notice when the trial order quota is exhausted; same guard inside `handleWhatsAppOrder` |
| `src/hooks/fetchSettings.tsx` | Parse `current_subscription_plan`; add to `SettingsResponse`; persist in the per-tenant server cache |
| `src/pages/store-unavailable.astro` | **New.** Full-screen lockout screen |
| `src/middleware.ts` | Fetch settings + `isStoreExpired` check → rewrite expired GET routes to `/store-unavailable` |

## Notes

- **Cold-cache latency:** the settings fetch moves into middleware (was parallel
  with banner/categories/products on the homepage). The 5-min per-tenant server
  cache means only the first request per tenant pays it; the rest are cache hits,
  and the homepage's own `fetchSettings` call also hits that warm cache.
- **Loop safety:** the lockout path is skipped in the middleware check, so it is
  safe whether or not `context.rewrite()` re-runs middleware.
- **How to verify locally:** there is no expired tenant in dev. Temporarily force
  `isStoreExpired` to return `true`, run `npm run dev`, confirm every route lands
  on the lockout screen, then revert. Dev tenant comes from
  `PUBLIC_DEV_API_ORIGIN` in `.env` — `https://admin-darsh.cashierthru.com` is
  the trial tenant, `admin-asly` a paid one.
- **How to verify the trial order block:** darsh has its full quota, so spoof it
  — in `src/pages/shop/cart.astro` set `remaining_orders = 0` on
  `currentSubscriptionPlan.subscription_status` before passing it to the cart,
  reload `/shop/cart`, confirm the order button is replaced by the notice while
  items/quantities still work, then revert. **Do not** place 10 real orders to
  drain the quota — dev hits the live backend.
