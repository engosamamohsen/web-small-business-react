# Web Instructions — configuration values & where to change them

Practical operator guide: every value you may need to set for a deployment, the
**exact file** that holds it, the format, and whether changing it needs a
**rebuild**. 🟢 canonical.

> Multi-tenant note: ONE build serves every storefront subdomain (roka.*,
> asly.*, …). Values in `.env` / code are **shared by all tenants**. Per-tenant
> values (shop name, WhatsApp number, VAT, logo) come from the backend
> `GET v1/setting-profile` API, NOT from this repo — see the last section.

---

## 0. The golden rule about rebuilds

`PUBLIC_*` variables are read through `import.meta.env.PUBLIC_*`, which Astro
**inlines at build time**. So after changing any `PUBLIC_*` value you MUST:

```bash
npm run build      # bakes the new value into dist/
# then restart the server, e.g.
pm2 restart <app>  # or: npm start
```

A server restart **without** a rebuild will keep the OLD value. (See
[git-deploy-commands.md](git-deploy-commands.md) for the full deploy flow.)

---

## 1. Environment variables — `.env`

File: **`.env`** (gitignored — each server keeps its own copy).
Template + docs: **`.env.example`**.

| Variable | What it does | Example value | Rebuild? |
| --- | --- | --- | --- |
| `PUBLIC_BASE_URL` | SSR/build-time fallback admin API origin (browser ignores it — it derives `admin-<tenant>` from the host). | `https://admin-asly.cashierthru.com` | ✅ |
| `PUBLIC_DEV_API_ORIGIN` | Admin API used by `npm run dev` (localhost has no tenant subdomain). | `https://admin-asly.cashierthru.com` | ✅ |
| `PUBLIC_LAST_ROUTE_API_URL` | API path prefix appended to the origin. | `/api/` | ✅ |
| `PUBLIC_GA_ID` | Google Analytics 4 Measurement ID. Empty = analytics off. | `G-XXXXXXXXXX` | ✅ |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag token (DNS method needs none). Empty = no meta tag. | the `content="…"` token | ✅ |

### How to set a variable
1. Open `.env` on the server (copy from `.env.example` if it doesn't exist).
2. Put the value after the `=` (no quotes, no spaces): `PUBLIC_GA_ID=G-XXXXXXXXXX`.
3. `npm run build` + restart.

---

## 2. Google Analytics (GA4)

- **Code (already wired):** `src/components/Analytics.astro` — emits the standard
  **main-thread** gtag.js (Google's exact snippet) only when `PUBLIC_GA_ID` is
  set; included on every page via `src/layouts/Layout.astro`. (Partytown was
  removed — it ran gtag in a web worker, unreliable for GA4 Realtime.)
- **Value to set:** `PUBLIC_GA_ID` in `.env`.

### Steps
1. Open https://analytics.google.com/
2. Create a property (Admin → Create → Property). Timezone **Egypt**, currency
   **EGP**. Guide: https://support.google.com/analytics/answer/9304153
3. Create a **Web** data stream (Admin → Data streams → Add stream → Web). URL:
   `https://cashierthru.com`. One stream covers every `*.cashierthru.com`
   subdomain automatically.
4. Copy the **Measurement ID** `G-XXXXXXXXXX` (Admin → Data streams → your stream
   → top-right). How-to: https://support.google.com/analytics/answer/12270356
5. Set `PUBLIC_GA_ID=G-XXXXXXXXXX` in `.env` → `npm run build` → restart.
6. Verify in **GA → Reports → Realtime** (open a store, see your visit):
   https://support.google.com/analytics/answer/9271392
7. Break traffic down per store with the built-in **Hostname** dimension in an
   Exploration.

> gtag loads on the main thread (the standard Google install), so Realtime
> should populate within ~30s of a page view.

---

## 3. Google Search Console (SEO verification)

- **Code:** `src/components/SEO.astro` reads `PUBLIC_GOOGLE_SITE_VERIFICATION`.
- **Best method (covers ALL tenants at once):** verify a **Domain property** for
  `cashierthru.com` via a **DNS TXT** record — needs NO env value.
  https://support.google.com/webmasters/answer/9008080
- **HTML-tag method (alternative):** put only the token (the `content="…"` part)
  in `PUBLIC_GOOGLE_SITE_VERIFICATION`, then rebuild.
- Submit each store's sitemap in Search Console: `https://<store>.cashierthru.com/sitemap.xml`
  (the sitemap/robots are generated per tenant — see
  [../src/pages/sitemap.xml.ts](../src/pages/sitemap.xml.ts)).

---

## 4. Store mode & WhatsApp fallbacks — `src/lib/store-config.ts`

Static, build-time. Change the constant, then rebuild.

| Value | Meaning | Change to |
| --- | --- | --- |
| `CURRENT_PLAN` | `"basic"` (localStorage cart + WhatsApp checkout) or `"premium"` (API cart + login + `/shop/checkout`). | `"basic"` / `"premium"` |
| `fallbackWhatsappNumber` | Last-resort only — the REAL number comes from the settings API. Kept on the placeholder reject-list. | leave as-is |
| `whatsappCountryCode` | Prefix for local numbers (`01…` → `201…`). | `"20"` (Egypt) |

> The live WhatsApp number is **never** hardcoded — it's `settings.whatsapp_phone`
> from the backend, routed through guarded helpers in `src/lib/whatsapp-order.ts`.

---

## 5. Base domain (SEO/canonical fallback) — `astro.config.mjs`

`site: 'https://cashierthru.com'` — the base domain used only as a fallback;
per-tenant canonical/OG/sitemap URLs are resolved at runtime from the request
host (`src/lib/site-origin.ts`). Change only if the platform domain changes.
Rebuild after editing.

---

## 6. Order-counter database — `src/lib/firebase-tracker.ts`

`FIREBASE_DB` = `https://cashier-thru-default-rtdb.firebaseio.com` — the Firebase
Realtime DB that counts WhatsApp orders per shop (`web_order/{subdomain}/count`).
Change only if the Firebase project changes.

---

## 7. Per-tenant values — NOT in this repo

These differ per store and are set by the store owner in the **admin backend**
(`admin-<tenant>.cashierthru.com`), surfaced via `GET v1/setting-profile`:

- Shop **name**, **logo**, **shop_type**
- **WhatsApp number** (`whatsapp_phone`)
- **VAT %** (`vat`) — drives the cart tax line
- Facebook / Instagram links, about us, keywords
- Subscription tier / status (Plus vs Basic, expiry)

To change any of these for a single store, edit them in that store's admin panel
— do **not** hardcode them here.

---

## Quick checklist for "add a new value"
1. Decide scope: shared (this repo) vs per-store (backend admin).
2. If shared & secret/per-env → add to `.env` (+ document in `.env.example`).
   If shared & code-level → the relevant file in §4–6 above.
3. `npm run build` + restart.
4. Verify on a live store.
