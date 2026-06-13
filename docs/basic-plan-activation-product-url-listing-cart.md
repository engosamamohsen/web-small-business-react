# Session Summary — 2026-06-13

---

## 1. Activated Basic Plan (static)

**File:** `src/lib/store-config.ts`

Changed `CURRENT_PLAN` from `"premium"` to `"basic"`.

```ts
const CURRENT_PLAN: StorePlan = "basic";
```

With this single change the entire app switches modes:

| Concern | Basic behaviour |
|---|---|
| Auth pages (`/auth/*`) | Redirect → `/` |
| Header | Login button hidden; cart always accessible |
| Cart | Reads/writes localStorage via `src/lib/cart/local-cart.ts` |
| `ButtonAddToCart` | No login gate |
| Checkout (`/shop/checkout`) | Redirects → `/shop/cart` |
| Cart page | No auth required |

> **Future:** when the plan should come from the API (`v1/setting-profile` or a `/store-config` endpoint), replace the static constant — all consumers already read derived capability flags (`canAuthenticate`, `usesLocalCart`, `checkoutMode`) so no consumer changes are needed.

---

## 2. Code Review Findings

Running a 7-angle review over the subscription-modes diff produced 10 findings ranked by severity:

| # | File | Summary |
|---|---|---|
| 1 | `src/pages/order/[id].astro` (+ 5 others) | `buildWhatsAppLink` strips non-digits but does **not** prepend the `20` country code — `wa.me/01093341796` is invalid |
| 2 | `src/hooks/fetchSettings.tsx` | Server-side settings cache has no tenant/token key; first SSR request's data is served to all within the 5-min window |
| 3 | `src/components/Cart/Cart.tsx` | `window.open()` non-null is not a reliable "WhatsApp opened" signal on mobile; cart is cleared even on silent redirect failures |
| 4 | `src/hooks/cart/cart.ts` | `addToCart` (BASIC) never calls `retry()` on the cart page — item list stays stale after add from the product detail page |
| 5 | `src/lib/cart/local-cart.ts` | Merging a duplicate line recomputes `item_total` from the **stored** (possibly stale) `unit_price`, ignoring the freshly-resolved price |
| 6 | `src/hooks/cart/cart.ts` | `removeFromCart` calling convention wraps the full `CartItemType` as `{ cart_item_id: item }` — future callers passing a numeric ID hit a silent no-op |
| 7 | `src/layouts/Header/Header.tsx` | `handleLogout` navigates to `/auth/login` (which redirects to `/` in basic plan) — unreachable today, latent redirect loop |
| 8 | `src/lib/cart/local-cart.ts` | Every mutation re-reads localStorage immediately after writing (double parse) |
| 9 | `src/components/products/detail-components/CartActions.tsx` | `finalPrice` and `finalUnitPrice` duplicate the same discount formula independently |
| 10 | `src/hooks/cart/cart.ts` | Double badge update on every BASIC mutation (event + explicit `setCartCount`) |

> These are **not yet fixed** — logged here for future work.

---

## 3. Product URL Format Change

**Files changed:** `src/lib/product-url.ts`, `src/pages/product/[slug].astro`

### Before
```
/product/{id}-{slug}   e.g. /product/8-ft-shaorma-frakh-8
```
`parseProductParam` extracted the **leading** number as the id.

### After
```
/product/{slug}        e.g. /product/ft-shaorma-frakh-8
```
The API slug already embeds the id as the **trailing** number (`ft-shaorma-frakh-8`), so no separate id prefix is needed.

**`parseProductParam` regex:**

```ts
// Before
const match = param.match(/^(\d+)(?:-(.*))?$/);
return { id: match[1], slug: match[2] ?? "" };

// After
const match = param.match(/^(.*)-(\d+)$/);
return { id: match[2], slug: param };
```

`buildProductPath` was already returning `/product/${slug}` and needed no change — only comments were updated.

---

## 4. Add-to-Cart Button on Product Listing

**Files changed:** `src/components/Product/ButtonAddToCart.tsx`, `src/components/Product/Product.tsx`

### Behaviour

| Product type | Button | Action |
|---|---|---|
| `variations` is empty | Round white button with ShoppingCart icon | Adds directly to cart |
| `variations` has items | Pill button (`--main-color` bg) with "اختر الخيارات" | Navigates to product detail page |

The button is rendered in the **card content row** alongside the price (no longer inside the image `<Link>` wrapper).

### Key change in `ButtonAddToCart`

```tsx
const hasVariations = (product?.variations?.length ?? 0) > 0;

if (hasVariations) {
    return (
        <button onClick={() => router.push(buildProductPath(product))}
            className="... rounded-full bg-[var(--main-color)] ...">
            اختر الخيارات
        </button>
    );
}

// No variations — add directly
return (
    <Button onClick={async () => { await addToCart(product); }} ...>
        <ShoppingCart />
    </Button>
);
```

---

## 5. Fixed: Add-to-Cart Button Did Nothing on Home Page

Two root causes were identified and fixed.

### Cause 1 — No `ToastContainer` on the home page

`useCartHook.addToCart` calls `toast.success(...)` after a BASIC-plan add, but the home page had no `ToastContainer` so the toast was silently discarded.

**Fix — `src/pages/index.astro`:**
```astro
import { ToastContainer } from "react-toastify";
...
<ToastContainer position="top-right" rtl={true} client:load />
```

### Cause 2 — Header badge never updated on the home page

`SettingsContext` has a **no-op default** (no throw) so the app doesn't crash. But on the home page, each component is an isolated Astro island — no `SettingsProvider` wraps the Header, so:
- `cartCount` from context was always `0`
- The `LOCAL_CART_EVENT` listener inside `SettingsProvider` never ran

**Fix — `src/layouts/Header/Header.tsx`:**

Added a direct `LOCAL_CART_EVENT` listener in the Header itself for BASIC plan. The derived `cartCount` variable now always reflects localStorage whether or not a `SettingsProvider` is present above it.

```tsx
const [localCount, setLocalCount] = useState(0);

useEffect(() => {
    if (!storeConfig.usesLocalCart) return;
    const sync = () => setLocalCount(localCartCount());
    sync();
    window.addEventListener(LOCAL_CART_EVENT, sync);
    return () => window.removeEventListener(LOCAL_CART_EVENT, sync);
}, []);

const cartCount = storeConfig.usesLocalCart ? localCount : contextCartCount;
```

On pages that DO have a `SettingsProvider` (cart, checkout, etc.) this is harmless — both `localCount` and the context count reflect the same localStorage state.

---

## 6. WhatsApp Order Counter — Firebase Realtime Database

**Files changed:** `src/lib/firebase-tracker.ts` (new), `src/components/Cart/Cart.tsx`

Every time a customer clicks "Order via WhatsApp", a counter is atomically incremented in Firebase Realtime Database — before the WhatsApp window opens, without blocking the user.

### Database structure

```
web_order/
  {subdomain}/
    count: 126
```

- **Database:** `https://cashier-thru-default-rtdb.firebaseio.com/`
- **Subdomain** is resolved at runtime from `window.location.hostname` via the existing `getShopName()` helper in `src/lib/config.ts`  
  (`"asly.cashierthru.com"` → `"asly"`, `"localhost"` → `"localhost"`)

### Implementation — `src/lib/firebase-tracker.ts`

No Firebase SDK — uses the REST API directly with the **server-side increment sentinel**, which is atomic even under concurrent clicks:

```ts
await fetch(
    `https://cashier-thru-default-rtdb.firebaseio.com/web_order/${subdomain}/count.json`,
    {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ".sv": { increment: 1 } }),
    }
);
```

- If `count` does not exist, Firebase initialises it to `1`
- If multiple users click simultaneously, each write is handled atomically server-side — no lost increments
- Any error (network, Firebase outage) is caught and logged as a warning; the function never throws

### Integration — `Cart.tsx` `handleWhatsAppOrder`

```ts
// Fire-and-forget — counter increments in background; failure never blocks
trackWhatsAppOrder().catch(() => {});

const win = window.open(url, "_blank");
```

The call is fire-and-forget (`.catch(() => {})`) so a slow or failed Firebase write never delays the WhatsApp redirect or affects the cart.

---

## Files Changed This Session

| File | Change |
|---|---|
| `src/lib/store-config.ts` | `CURRENT_PLAN` → `"basic"` |
| `src/lib/product-url.ts` | `parseProductParam` regex: trailing-id extraction; updated comments |
| `src/pages/product/[slug].astro` | Updated stale URL format comments |
| `src/components/Product/ButtonAddToCart.tsx` | Variations check; "اختر الخيارات" pill; no-variation direct add |
| `src/components/Product/Product.tsx` | Uncommented and always render `ButtonAddToCart` in price row |
| `src/pages/index.astro` | Added `ToastContainer` |
| `src/layouts/Header/Header.tsx` | Added `LOCAL_CART_EVENT` listener + `localCount` state for BASIC plan badge |
| `src/lib/firebase-tracker.ts` | **New** — atomic Firebase REST increment for WhatsApp order tracking |
| `src/components/Cart/Cart.tsx` | Call `trackWhatsAppOrder()` fire-and-forget before opening WhatsApp |
