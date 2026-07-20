# CashierThru Storefront

Multi-tenant storefront for CashierThru small-business shops — **Astro** (SSR via
`@astrojs/node`) with **React** islands, Tailwind, and TypeScript.

One build serves **every tenant**: each shop lives on its own subdomain
(`darsh.cashierthru.com`, `asly.cashierthru.com`, …) and the API origin is
derived from the request/browser at runtime — never hardcoded. See
[docs/multi-tenant-architecture.md](docs/multi-tenant-architecture.md).

## Getting started

```bash
npm install
cp .env.example .env     # then edit — see "Configuration" below
npm run dev              # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | `astro check` (type-check) + production build |
| `npm start` | Run the built SSR server (`dist/server/entry.mjs`) |
| `npm test` | Unit tests (vitest) |
| `npm run lint` | ESLint |

> `localhost` has no tenant subdomain, so dev calls fall back to the tenant in
> `PUBLIC_DEV_API_ORIGIN`. **Dev hits the live backend** — placing an order in
> dev creates a real order that needs cleaning up.

## Configuration

`.env` (never committed — each server keeps its own). Full reference:
[docs/web-instructions.md](docs/web-instructions.md).

| Var | Purpose |
| --- | --- |
| `PUBLIC_BASE_URL` | SSR/build-time fallback **admin API** origin (not the shop URL) |
| `PUBLIC_DEV_API_ORIGIN` | Tenant used by `npm run dev` (e.g. `https://admin-darsh.cashierthru.com`) |
| `PUBLIC_LAST_ROUTE_API_URL` | API path prefix (`/api/`) |
| `PUBLIC_GA_ID` | GA4 measurement ID — one shared property for all tenants (build-time; empty disables) |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag token (optional) |

`src/lib/store-config.ts` holds the static app-mode flags (`premium` vs `basic`:
auth, cart storage, checkout mode) — a **rebuild** is needed to change them.

## Documentation

**[docs/README.md](docs/README.md) is the index — start there.** Highlights:

| Topic | Doc |
| --- | --- |
| Per-tenant API URL resolution | [multi-tenant-architecture.md](docs/multi-tenant-architecture.md) |
| App mode vs subscription tier (two different "plan" systems) | [docs/README.md](docs/README.md) |
| `Plus` vs `Basic` detection | [subscription-tier-detection.md](docs/subscription-tier-detection.md) |
| **Free trial** — days cap + order quota | [free-trial-plan.md](docs/free-trial-plan.md) |
| Expired-subscription lockout | [expired-subscription-lockout.md](docs/expired-subscription-lockout.md) |
| WhatsApp order flow / message format | [product-details-url-and-whatsapp-order.md](docs/product-details-url-and-whatsapp-order.md) |
| **Which WhatsApp number is used** (fail-closed) | [whatsapp-number-resolution.md](docs/whatsapp-number-resolution.md) |
| Plus-tier guest order | [plus-plan-guest-order.md](docs/plus-plan-guest-order.md) |
| Config values & where to change them | [web-instructions.md](docs/web-instructions.md) |
| SEO / getting a store indexed | [seo-go-live-checklist.md](docs/seo-go-live-checklist.md) |
| Deploy (git + pm2) | [git-deploy-commands.md](docs/git-deploy-commands.md) |

## Two rules worth knowing before you touch the code

1. **The WhatsApp number fails closed.** Resolve it only via
   `resolveWhatsappNumber()` (`whatsapp_phone` → `phone` → *nothing*). A fake,
   default or truncated number would route a customer's order to a stranger, so
   the button hides instead. Details:
   [whatsapp-number-resolution.md](docs/whatsapp-number-resolution.md).
2. **Subscription checks fail open.** Missing plan/status data keeps a store
   available and able to order — a backend hiccup must never blank out or
   silence a paying tenant.

## Deploy

`./setup.sh <tenant>` writes `.env`, builds, and (re)starts pm2 from
`ecosystem.config.cjs`. Nginx config lives in `deploy/nginx/` — it **must**
forward `X-Forwarded-Host` or every tenant collapses onto the fallback API. See
[docs/fix-tenant-api-nginx-host-header.md](docs/fix-tenant-api-nginx-host-header.md)
and [docs/git-deploy-commands.md](docs/git-deploy-commands.md).
