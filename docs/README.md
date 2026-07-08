# Docs Index

Single entry point for this project's documentation. Read the **canonical** docs
first — the **historical** ones are session logs kept for context, with any
superseded parts marked inline.

> Conventions: 🟢 canonical (reflects current code) · 🕒 historical (a past
> task/session; superseded parts are flagged and point to the canonical doc).

---

## 🟢 Canonical — current behavior

| Doc | What it covers |
| --- | --- |
| [product-details-url-and-whatsapp-order.md](product-details-url-and-whatsapp-order.md) | **Source of truth** for the SEO product URL (`/product/{slug}-{seo-name}`, Arabic-safe, spaces→hyphens, id-only lookup, 301 canonical + `encodeURI` redirect) **and** the WhatsApp order message format (friendly/sectioned) + the APIs the order flow uses. WhatsApp order is now **Basic-tier only**. |
| [plus-plan-guest-order.md](plus-plan-guest-order.md) | **Plus-tier** cart: the WhatsApp button is replaced by a **Confirm Order** button that places a real order via `POST v1/basket/guest-buy` (adds a required **phone** field + payment method + order notes). |
| [subscription-tier-detection.md](subscription-tier-detection.md) | **How `Plus` vs `Basic` is detected** — now keyed off `current_subscription_plan.type` (`"plus"`/`"basic"`), authoritative over the plan name; name kept only as a legacy fallback. `isPlusPlan()` in `src/lib/subscription.ts`. |
| [product-list-image-fixes.md](product-list-image-fixes.md) | Product-list image rendering: default image is fallback-only, main image fills its box and shows without a JS opacity flip. |
| [multi-tenant-architecture.md](multi-tenant-architecture.md) | Per-tenant dynamic API URL resolution (`getApiUrl()` from `window.location.origin`). The base URL is **never** hardcoded. |
| [expired-subscription-lockout.md](expired-subscription-lockout.md) | Storefront lockout when a tenant's subscription + grace period are exhausted. |
| [fix-tenant-api-nginx-host-header.md](fix-tenant-api-nginx-host-header.md) | Nginx Host-header fix for per-tenant API routing. |
| [web-instructions.md](web-instructions.md) | **Config values & where to change them** — `.env` vars (incl. `PUBLIC_GA_ID` for Google Analytics, `PUBLIC_GOOGLE_SITE_VERIFICATION`), `store-config.ts`, base domain, and which values live in the backend instead. Includes the rebuild rule. |
| [seo-go-live-checklist.md](seo-go-live-checklist.md) | **Get a store indexed & ranking** — Search Console DNS verification, submit the (dynamic, per-tenant) sitemap, request indexing, Google Business Profile. Notes the sitemap + SEO metadata are sourced live from the per-tenant catalogue + settings APIs (no rebuild). |
| [git-deploy-commands.md](git-deploy-commands.md) | Git + server deploy steps (pm2). Note: deploy the branch you actually pushed. |
| [API-Failures-Backend-Stories.md](API-Failures-Backend-Stories.md) | Backend stories / API failure handling reference. |

## 🕒 Historical — session logs (superseded parts flagged inline)

| Doc | Notes |
| --- | --- |
| [subscription-modes-task.md](subscription-modes-task.md) | The Premium/Basic-WhatsApp plan spec (still the design reference). Its URL line and example message are flagged → see the canonical doc for the live format. |
| [basic-plan-activation-product-url-listing-cart.md](basic-plan-activation-product-url-listing-cart.md) | 2026-06-13 session log. §3 (product URL) is **superseded** by the SEO format. |
| [whatsapp-variations-fix.md](whatsapp-variations-fix.md) | Variations-in-order fix (still valid); the message *example* is the old format — current format is in the canonical doc. |
| [../plans/project-planning.md](../plans/project-planning.md) | Original high-level plan, kept current at the top; some body sections predate subscription modes / dynamic tenant URLs. |

---

## Plans & subscription tiers (two different systems)

This project has **two unrelated "plan" concepts**. The word *Basic* appears in
both — don't conflate them.

### 1. Store operating mode — `premium` vs `basic`

- **File:** `src/lib/store-config.ts` (`CURRENT_PLAN`) — a **static** build-time flag (currently `basic`).
- **Controls the whole app mode**, via derived flags (consumers read these, never the raw plan):

| Flag | `premium` | `basic` |
| --- | --- | --- |
| `canAuthenticate` | login / register / profile / orders exist | no auth at all |
| `usesLocalCart` | server `v1/basket` API cart | `localStorage` cart |
| `checkoutMode` | `"api"` (address → payment → order) | `"whatsapp"` (wa.me order) |

- Doc: [subscription-modes-task.md](subscription-modes-task.md).

### 2. Subscription tier — `Plus` vs `Basic`

- **File:** `src/lib/subscription.ts` (`isPlusPlan`, `isStoreExpired`) — **dynamic**, from `GET v1/setting-profile` → `current_subscription_plan` (per tenant, at runtime).
- **Both tiers order via a WhatsApp button, and both now place a `guest-buy` API order** — Plus with the customer's real name/phone/address (and a shared order image), Basic in the background with empty customer fields (and a wa.me text order). Within WhatsApp checkout mode:

| Feature | `Basic` | `Plus` |
| --- | --- | --- |
| Cart order button | **اطلب عبر واتساب** | **اطلب عبر واتساب** (same button) |
| On click | open wa.me **text order** (full details) → **`POST v1/basket/guest-buy`** in background (empty customer fields, best-effort) | validate form → **`POST v1/basket/guest-buy`** (real customer data) → **share** order image via `navigator.share` (fallback: wa.me text) |
| WhatsApp **text** | full order details — the wa.me text IS the order | share caption = greeting only; wa.me text fallback carries full details |
| **Order image (PNG)** | ❌ none (text order) | products+variations, qty, name/phone/address, subtotal, VAT, total |
| Customer **Name / Phone / Full Address** fields | ❌ hidden (sent empty) | ✅ shown (required) → `full_name`/`phone`/`full_address` |
| **Order notes** box | ❌ hidden (sent empty) | ✅ optional → `notes` |
| **Payment method** | always cash (`payment_method = 1`) | always cash (`payment_method = 1`, static — **no selector**) |
| **Tax (VAT) line + recalculated total** | ❌ subtotal only | ✅ `subtotal + subtotal×vat%` (from `settings.vat`) |
| Catalog / cart / prices | same | same |

- Decided by `isPlusPlan()` — keyed off **`current_subscription_plan.type`** (`"plus"` → Plus, `"basic"` → Basic; the backend now sets this on every tenant). `type` is authoritative and wins over the display name. A response with a missing/legacy `type` (e.g. the old `"normal"`) falls back to the previous name heuristic (`name` / `name_en` containing "plus"); anything else (unknown, missing) → not Plus, so the click takes the Basic path — a wa.me text order plus a background `guest-buy` with empty customer fields, and no customer form (safe default).
- The **Plus** WhatsApp order is an **image, shared — never downloaded**: a clean `<OrderReceipt>` element is rendered to PNG via **html2canvas** (`src/lib/cart-screenshot.ts`) and pushed into WhatsApp with `navigator.share` (the greeting is the caption). Devices that can't share a file fall back to a `wa.me` **full-text** order (`buildWhatsAppOrderUrl`) — still no download. Full spec: [plus-plan-guest-order.md](plus-plan-guest-order.md).
- **Subscription *expiry* is tier-independent** — `isStoreExpired()` uses `subscription_status` (remaining / grace days, `can_access`) and applies to both tiers. Doc: [expired-subscription-lockout.md](expired-subscription-lockout.md).
- Full spec for the Plus order flow: [plus-plan-guest-order.md](plus-plan-guest-order.md).

### How the two systems interact

The Plus extras (the form + `guest-buy` API call + VAT line) are gated on **both** systems:

```ts
isPlusOrder = isPlusPlan(subscriptionPlan) && storeConfig.checkoutMode === "whatsapp"
```

i.e. a **Plus**-tier store that is also in **WhatsApp** checkout mode. Both tiers
show the same green WhatsApp button and both place a `guest-buy` order on click;
when `isPlusOrder` is true the click additionally shows the customer form (real
name/phone/address on the order), shares an order image, and adds the VAT line.
Basic sends the `guest-buy` with empty customer fields (best-effort, in the
background) and delivers the item details to the shop as a wa.me text order. In
`premium` store mode neither applies — the cart links to `/shop/checkout`.

> ⚠️ `storeConfig.plan === "basic"` (WhatsApp app **mode**) is NOT the same as
> `current_subscription_plan.type === "basic"` (subscription **tier** without the
> customer-info fields). They are independent axes.

---

## Quick map: where a feature lives

- **Product URL / slug** → `src/lib/product-url.ts`, `src/utils/utils.ts` (`slugify`), `src/pages/product/[slug].astro`
- **WhatsApp order (Basic tier)** → `src/lib/whatsapp-order.ts`, `src/components/Cart/Cart.tsx`
- **Plus-tier cart order (guest-buy API)** → `src/lib/guest-order.ts`, `src/components/Cart/Cart.tsx`
- **Plan / capability flags** → `src/lib/store-config.ts`; subscription status → `src/lib/subscription.ts`
- **Tenant API URL** → `src/lib/config.ts` (`getApiUrl()`)
- **Settings** → `src/hooks/fetchSettings.tsx` (`GET v1/setting-profile`)
- **Tests** → co-located `*.test.ts` (run `npm test`); **lint** → `npm run lint`
