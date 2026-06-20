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
| [product-details-url-and-whatsapp-order.md](product-details-url-and-whatsapp-order.md) | **Source of truth** for the SEO product URL (`/product/{slug}-{seo-name}`, Arabic-safe, spaces→hyphens, id-only lookup, 301 canonical + `encodeURI` redirect) **and** the WhatsApp order message format (friendly/sectioned) + the APIs the order flow uses. |
| [product-list-image-fixes.md](product-list-image-fixes.md) | Product-list image rendering: default image is fallback-only, main image fills its box and shows without a JS opacity flip. |
| [multi-tenant-architecture.md](multi-tenant-architecture.md) | Per-tenant dynamic API URL resolution (`getApiUrl()` from `window.location.origin`). The base URL is **never** hardcoded. |
| [expired-subscription-lockout.md](expired-subscription-lockout.md) | Storefront lockout when a tenant's subscription + grace period are exhausted. |
| [fix-tenant-api-nginx-host-header.md](fix-tenant-api-nginx-host-header.md) | Nginx Host-header fix for per-tenant API routing. |
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
- **Plus = Basic + customer info on the cart.** The only implemented frontend difference:

| Feature | `Basic` | `Plus` |
| --- | --- | --- |
| Customer **Name** field on cart | ❌ hidden | ✅ shown (required) |
| Customer **Full Address** field on cart | ❌ hidden | ✅ shown (required) |
| Customer info in the WhatsApp order message | ❌ excluded | ✅ included (`👤 بيانات العميل` block) |
| Catalog / cart / ordering / prices | same | same |

- Decided by `isPlusPlan()` — matches `name` / `name_en` containing **"plus"** (case-insensitive); anything else (incl. `"Basic"`, unknown, missing) → not Plus, fields stay hidden (safe default).
- **Subscription *expiry* is tier-independent** — `isStoreExpired()` uses `subscription_status` (remaining / grace days, `can_access`) and applies to both tiers. Doc: [expired-subscription-lockout.md](expired-subscription-lockout.md).

### How the two systems interact

The customer-info feature is gated on **both** systems:

```ts
showCustomerInfo = isPlusPlan(subscriptionPlan) && storeConfig.checkoutMode === "whatsapp"
```

i.e. a **Plus**-tier store that is also in **WhatsApp** checkout mode.

> ⚠️ `storeConfig.plan === "basic"` (WhatsApp app **mode**) is NOT the same as
> `current_subscription_plan.name === "Basic"` (subscription **tier** without the
> customer-info fields). They are independent axes.

---

## Quick map: where a feature lives

- **Product URL / slug** → `src/lib/product-url.ts`, `src/utils/utils.ts` (`slugify`), `src/pages/product/[slug].astro`
- **WhatsApp order** → `src/lib/whatsapp-order.ts`, `src/components/Cart/Cart.tsx`
- **Plan / capability flags** → `src/lib/store-config.ts`; subscription status → `src/lib/subscription.ts`
- **Tenant API URL** → `src/lib/config.ts` (`getApiUrl()`)
- **Settings** → `src/hooks/fetchSettings.tsx` (`GET v1/setting-profile`)
- **Tests** → co-located `*.test.ts` (run `npm test`); **lint** → `npm run lint`
