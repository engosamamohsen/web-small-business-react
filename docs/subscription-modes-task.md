# Task: Add Subscription Modes (Premium & Basic WhatsApp Ordering)

> **Status:** ✅ Implemented (2026-06-12) — `currentPlan = "basic"` (static).
> Config lives in `src/lib/store-config.ts`; local cart in `src/lib/cart/local-cart.ts`;
> WhatsApp order builder in `src/lib/whatsapp-order.ts`. To switch plans, change
> `CURRENT_PLAN` in store-config.ts. Dynamic (API-driven) plan loading is still
> pending — the user will specify how later.
> **Created:** 2026-06-12
> **Note:** The original spec was written with Kotlin/mobile examples; this document
> adapts it to this project (Astro 5 + React 19 + TypeScript, multi-tenant SaaS).

---

## Objective

The application currently works as a full eCommerce platform with:

- User Authentication / Registration
- Cart Management (server-backed, requires auth token)
- Multiple Addresses
- Checkout Flow
- Order Management

Introduce **two operating modes controlled by a single configuration variable**.
The configuration is **static for now**, but must be designed so it can later be
loaded dynamically from an API or remote configuration **without major refactoring**.

```ts
// TypeScript equivalent of the spec's Kotlin example
export type StorePlan = "premium" | "basic";

export const StoreConfiguration = {
    currentPlan: "premium" as StorePlan,
    // Fallback ONLY — the real number comes from the setting-profile API
    // (data.whatsapp_phone), see "WhatsApp number & shop name source" below.
    shopWhatsappNumber: "201234567890",
};
```

---

## 1. Premium Plan (existing behavior)

When `currentPlan === "premium"` → **keep the existing application behavior unchanged.**

Features enabled: Login, Registration, Forgot Password, User Profile, Multiple
Addresses, Saved Addresses, Standard Checkout, Order Creation APIs, Order
History, Account Management, existing (server-backed) Cart logic.

The user experiences the current full eCommerce platform.

## 2. Basic Plan (WhatsApp ordering)

When `currentPlan === "basic"` → the app behaves like a **catalog + WhatsApp
ordering system**.

### Authentication — hide and disable

- Login / Registration / Forgot Password / OTP screens
- Account & Profile screens
- Order History
- Address Management

The user must **never** be asked to authenticate.

### Cart — keep, but local

Users can browse products, view details, add to cart, update quantities,
remove items, and view the cart.

**Offline cart requirements:**

- Stored locally (e.g. `localStorage`)
- Survives app restart / page refresh
- Works without login; does not depend on a user account

### Checkout — replace the flow

| | Flow |
|---|---|
| Current (premium) | Cart → Address Selection → Payment → Order API |
| New (basic) | Cart → **WhatsApp Order** |

When the user presses Checkout:

1. Collect all cart items.
2. Generate a WhatsApp message (format below).
3. Open WhatsApp chat with the shop number: `https://wa.me/{SHOP_NUMBER}?text={ENCODED_MESSAGE}`
4. **Clear the cart only after successful WhatsApp launch.**

The message **starts with a greeting that includes the shop name** taken from
the setting-profile API (`data.name`):
`مرحبا بك فى مطعم {shop_name}`

Example message (Arabic, RTL — encode with `encodeURIComponent`;
shop name "مطعم عيدو" comes from `data.name`):

```text
مرحبا بك فى مطعم عيدو

السلام عليكم

أرغب في طلب المنتجات التالية:

1. فتة شاورما فراخ
   الكمية: 2
   السعر: 100

2. سندوتش شاورما فراخ
   الكمية: 1
   السعر: 80

الإجمالي: 280 جنيه

شكراً
```

> Note: `data.name` may already contain the word "مطعم" (e.g. "مطعم عيدو") —
> avoid doubling it ("مطعم مطعم عيدو"); prefix only when the name doesn't
> already start with it. `data.shop_type` ("restaurant") is available if the
> wording should differ per shop type later.

### WhatsApp number & shop name source — setting-profile API

Both values come from the **existing settings endpoint** — do not hardcode:

```http
GET v1/setting-profile
```

```json
{
    "status": true,
    "is_login": false,
    "cart_count": 0,
    "message": "Show setting profile",
    "data": {
        "id": 1,
        "name": "مطعم عيدو",
        "about_us": "أصل المأكولات السورية والغربية\r\nجميع أنواع الشاورما(وجبات، ساندوتشات، بالوزن)\r\nألذ فراخ شواية وبروستد",
        "phone": "01277775319",
        "whatsapp_phone": "01093341796",
        "contact_email": "aidochiken251@gmail.com",
        "full_address": "العاشر من رمضان سكاي مول مقابل نادي الرواد",
        "logo": "https://admin-asly.cashierthru.com/image/setting/1778930684_6a0853fcc14ff.png",
        "main_color": null,
        "main_bg": "#921111",
        "facebook_link": "https://www.facebook.com/Aidochiken/",
        "instagram_link": "https://aidochicken.com/index?page=default#",
        "tax": 5,
        "service": 10,
        "vat": "2.00",
        "keywords": ["ffff"],
        "product_default_image": "https://admin-asly.cashierthru.com/image/setting/1776977265_69ea8571b8aa4.jpg",
        "created_at": "2026-04-21 01:22:20",
        "updated_at": "2026-05-16 14:24:44",
        "shop_type": "restaurant"
    }
}
```

- **WhatsApp number** → `data.whatsapp_phone` (e.g. `"01093341796"`)
- **Shop name for the greeting** → `data.name` (e.g. `"مطعم عيدو"`)
- This endpoint is already wrapped by `fetchSettings()` in
  `src/hooks/fetchSettings.tsx` (it calls `v1/setting-profile` with
  localStorage + server-side caching built in) — reuse it; the static
  `shopWhatsappNumber` constant is only a last-resort fallback.
- `wa.me` needs the number in international digits-only format — normalize the
  local number (e.g. `01093341796` → `2010 9334 1796` → `201093341796`) the way
  `buildWhatsAppLink()` in `src/pages/product/[slug].astro` strips non-digits,
  plus the country-code prefix.

### Address handling

Do not show: Address List / Add / Edit / Delete. Addresses are not required —
customers provide delivery details directly inside WhatsApp.

## 3. Architecture requirements

- **Central feature-flag system** — a dedicated configuration layer.
- All UI and business logic read from this configuration.
- **Do not scatter plan checks throughout the project** — prefer derived
  capability flags (e.g. `canAuthenticate`, `usesLocalCart`,
  `checkoutMode: "api" | "whatsapp"`) over raw `plan === "basic"` checks.

## 4. Future compatibility

Today the plan flag is static. Future:

```http
GET /store-config

{ "plan": "basic", "whatsapp_number": "201234567890" }
```

The static config module must be swappable for an API-driven one without
touching consumers. Note the WhatsApp number and shop name are **already**
API-driven today via `v1/setting-profile` — only the `plan` flag remains
static until `/store-config` (or a `plan` field on setting-profile) exists.

## Expected result

**Premium:** full eCommerce experience (current behavior, zero regressions).

**Basic:** product catalog + product details + offline cart + WhatsApp ordering;
no authentication, no addresses, no checkout API; cart cleared after WhatsApp
launch; all of it controlled by a single configuration variable.

---

## Codebase mapping (this repo)

Where each requirement lands in `web-small-business-react`:

| Concern | Current implementation | Work needed for BASIC |
|---|---|---|
| Config layer | `src/lib/config.ts` is the single source of truth for tenant/API URLs | Add `src/lib/store-config.ts` (plan + WhatsApp number + derived capability flags). Future: hydrate from settings/`/store-config` API |
| WhatsApp number + shop name | `GET v1/setting-profile` via `fetchSettings()` (`src/hooks/fetchSettings.tsx`) → `data.whatsapp_phone`, `data.name`; already consumed by `WhatsAppButton` and the product page float button; `buildWhatsAppLink()` precedent in `src/pages/product/[slug].astro` | Use settings values (number for the `wa.me` link, name for the "مرحبا بك فى مطعم {name}" greeting); static constant is only a fallback |
| Auth pages | `src/pages/auth/*.astro` (login, register, verify, forgot/reset password) | Gate/redirect to home in BASIC |
| Account pages | `src/pages/user/profile.astro`, `src/pages/user/orders.astro`, `src/pages/order/[id].astro` | Gate/redirect in BASIC |
| Header auth UI | `src/layouts/Header/Header.tsx` (`initialIsLoggedIn`, login state), `LoginHandler` | Hide login/account entries in BASIC |
| Cart (server-backed) | `src/hooks/cart/cart.ts` — `useCartHook`/`useCartServices`, API + `app_token` cookie; `ButtonAddToCart.tsx` redirects to `/auth/login` when no token | Introduce a cart interface with two implementations: existing API cart (premium) and a new localStorage cart (basic). `ButtonAddToCart` must not require auth in BASIC |
| Cart UI | `src/components/Cart/Cart.tsx`, `src/pages/shop/cart.astro` | Render from the active cart implementation; checkout button label/action switches by plan |
| Checkout | `src/pages/shop/checkout.astro` (address selection → payment → order API) | In BASIC: replace with WhatsApp message generation + `wa.me` launch + clear local cart on success |
| Cart count badge | `SettingsProvider` carries `cartCount` from settings SSR | In BASIC derive from local cart |

### Implementation notes for next time

- The tenant test environment is `https://admin-asly.cashierthru.com` (dev default
  via `PUBLIC_DEV_API_ORIGIN` in `.env`; `npm run dev` already points there).
- Product URLs are canonical at `/product/{id}-{slug}` (see `src/lib/product-url.ts`).
- "Successful WhatsApp launch" on web: opening `wa.me` in a new tab — treat a
  non-blocked `window.open` as success before clearing the cart; popup blockers
  must not wipe the cart.
- Plan checks belong in the config layer / a few top-level gates (pages,
  Header, cart provider) — not sprinkled in leaf components.
