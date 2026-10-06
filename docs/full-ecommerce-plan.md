# Full e-commerce mode (from the store's plan)

The store mode in `src/lib/store-config.ts` is no longer a constant. It comes from the store's plan:
`GET v1/setting-profile` → `features.full_ecommerce: true` turns on **premium** (the full shop);
everything else stays **basic** (local cart + WhatsApp ordering), unchanged.
The plan itself is described in the dashboard repo: `docs/full-ecommerce-plan.md`.

## Per request

One server renders every store, so the mode can't be a module constant:

- `src/middleware.ts` reads the settings, sets `Astro.locals.plan`, and renders the request inside an
  `AsyncLocalStorage` (`planContext`), so `storeConfig.*` answers for this store during SSR.
- `Layout.astro` prints `window.__CT_PLAN__` / `window.__CT_STORE__` (plan, social login options,
  online payment) before islands hydrate; the middleware also sets a `ct_plan` cookie for pages
  that don't use the Layout (the auth pages).

## What premium stores get

- Auth pages; Google / Facebook buttons from `social_login` (`components/auth/SocialLoginButtons.tsx`)
  and the return page `/auth/social` (`SocialLoginCallback.tsx`, swaps the one-time code for a token).
  Firebase Google sign-in is no longer used on these forms.
- My account `/user/profile`: profile edit, address book (add / edit / delete / default).
- Checkout: default address pre-selected, payment method (cash; online when the store turned it on),
  `payment_method` sent to `v1/basket/buy`, redirect to the payment page when asked.
- Orders: status tabs, real statuses 1-6 (`src/lib/order-status.ts`), cancel button
  (`POST v1/orders/customer-cancel`) while the store hasn't started preparing.
- Product list: search / price / sort (`components/products/ProductFilters.tsx`, `src/lib/products-query.ts`);
  Enter in the header search opens all results.

## Fixes that premium needed

- `$api` sent `Authorization: Token …`; Sanctum needs `Bearer`, so every signed-in call failed.
- Profile hooks called `/get-profile` without `v1/`.
- Auth pages loaded the default tenant's settings (no `apiBase`).
- The product page rendered the lazy login dialog on the server (Suspense error); it now mounts on demand.

Tests: `src/lib/full-ecommerce.test.ts`.
