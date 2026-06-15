# Task: Handle Expired Subscription — Store Visibility Lockout

> **Status:** ✅ Implemented (2026-06-15).
> Expiry rule in `src/lib/subscription.ts`; plan parsing in
> `src/hooks/fetchSettings.tsx`; lockout screen in
> `src/pages/store-unavailable.astro`; enforcement in `src/middleware.ts`.
> **Created:** 2026-06-15
> **Related:** [subscription-modes-task.md](subscription-modes-task.md) (Basic/Premium plans),
> [multi-tenant-architecture.md](multi-tenant-architecture.md) (per-tenant API resolution).

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
| `src/lib/subscription.ts` | **New.** `SubscriptionStatus` / `CurrentSubscriptionPlan` types + `isStoreExpired()` |
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
  on the lockout screen, then revert. Dev tenant: `https://admin-asly.cashierthru.com`.
