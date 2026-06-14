# Multi-Tenant Architecture & How `config.ts` Works

## The Idea

This project is a **multi-tenant SaaS storefront**. A single codebase serves many
different shops. Each shop gets its own subdomain:

```
https://asly.cashierthru.com        ← shop storefront
https://burger.cashierthru.com      ← another shop
https://fashion.cashierthru.com     ← another shop
```

Each shop has a matching **admin API** that lives on a prefixed subdomain:

```
https://admin-asly.cashierthru.com/api/
https://admin-burger.cashierthru.com/api/
https://admin-fashion.cashierthru.com/api/
```

The frontend **never has a hardcoded API URL**. It always derives the correct API
from whichever subdomain the user is visiting. One build, deployed once, works for
every tenant automatically.

---

## URL Derivation Rule

```
https://{shop}.cashierthru.com
          ↓
https://admin-{shop}.cashierthru.com/api/
```

Example:
```
User visits  →  https://asly.cashierthru.com
API calls go →  https://admin-asly.cashierthru.com/api/
```

---

## How `src/lib/config.ts` Works

### Constants

```ts
const SSR_FALLBACK = import.meta.env.PUBLIC_BASE_URL || "http://localhost:3000";
const DEV_API_ORIGIN = import.meta.env.PUBLIC_DEV_API_ORIGIN || "https://admin-asly.cashierthru.com";
```

| Constant | When used | Value |
|---|---|---|
| `SSR_FALLBACK` | Production SSR (no `window`) | `PUBLIC_BASE_URL` from `.env` — the **admin API origin** (e.g. `https://admin-asly.cashierthru.com`) |
| `DEV_API_ORIGIN` | Local dev (`npm run dev`) | `PUBLIC_DEV_API_ORIGIN` from `.env` — the test tenant admin API |

> **Production SSR normally never reaches `SSR_FALLBACK`.** Each request is
> resolved per-tenant by `src/middleware.ts`, which derives the admin origin from
> the request `Host` / `X-Forwarded-Host` header and exposes it as
> `Astro.locals.apiBase`. `PUBLIC_BASE_URL` is only the **single-tenant fallback**
> used when the proxy doesn't forward the host (see middleware below).

---

### `getBaseUrl()`

Returns the **shop's own origin**.

```
Browser  →  window.location.origin        e.g. https://asly.cashierthru.com
SSR      →  PUBLIC_BASE_URL               e.g. https://admin-asly.cashierthru.com
Dev      →  DEV_API_ORIGIN                e.g. https://admin-asly.cashierthru.com
```

Used by `getShopName()` to extract the tenant slug. In the browser this is the
real shop origin; the SSR value is only a fallback and `getShopName()` is a
client-only concern (analytics, `useShopConfig`), so it always sees the real
shop hostname.

---

### `getAdminOrigin()`

Returns the **admin API origin** for the current tenant.

**Browser path** (window is available):
1. Read `window.location.hostname`
2. If localhost / private IP → return `DEV_API_ORIGIN`
3. Split hostname by `.` and prepend `admin-` to the first part

```
asly.cashierthru.com  →  ["asly", "cashierthru", "com"]
                      →  admin-asly.cashierthru.com
                      →  https://admin-asly.cashierthru.com
```

**SSR path** (no window, production build):
1. Parse `PUBLIC_BASE_URL` (the **admin API origin** from `.env`)
2. **Idempotent guard** — if the first label already starts with `admin-`, return
   it unchanged (never produce `admin-admin-asly`)
3. Otherwise apply the `admin-` transformation (so an old-style shop URL still works)

```
PUBLIC_BASE_URL = https://admin-asly.cashierthru.com   →  used as-is (guard)
PUBLIC_BASE_URL = https://asly.cashierthru.com         →  https://admin-asly.cashierthru.com
```

**Dev path** (`npm run dev`):
- Returns `DEV_API_ORIGIN` directly (localhost has no subdomain to transform)

---

### `getApiUrl()` and `getApiVersionedUrl()`

Convenience wrappers — just append `/api/` or `/api/v1/` to `getAdminOrigin()`.

```ts
getApiUrl()           // https://admin-asly.cashierthru.com/api/
getApiVersionedUrl()  // https://admin-asly.cashierthru.com/api/v1/
```

---

### `getShopName()`

Extracts the tenant slug from the current URL.

```
https://asly.cashierthru.com    →  "asly"
https://burger.cashierthru.com  →  "burger"
localhost                       →  "localhost"
```

---

### `useShopConfig()` — React Hook

Bundles everything into one object for React components:

```ts
const { shopName, apiUrl, adminOrigin, baseUrl, isDev } = useShopConfig();
```

---

## Nginx (production proxy) — REQUIRED for dynamic tenancy

The Node app derives the tenant from the request **`X-Forwarded-Host` header**.
(The `@astrojs/node` adapter does NOT read the plain `Host` header — it always
sees `localhost` — so `X-Forwarded-Host` is the one that matters.) Nginx must
(1) match every subdomain with one server block and (2) forward the real host:

```nginx
server {
    listen 443 ssl;
    server_name ~^(?!admin)(?!www)[\w-]+\.cashierthru\.com$;   # any tenant subdomain

    # Wildcard cert REQUIRED so any *.cashierthru.com loads over HTTPS:
    #   certbot certonly --manual --preferred-challenges dns \
    #     -d cashierthru.com -d "*.cashierthru.com"
    ssl_certificate     /etc/letsencrypt/live/cashierthru.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cashierthru.com/privkey.pem;

    location /_astro/ { root /var/www/cashierthuru-frontend/dist/client; expires 1y; }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;  # ← makes the tenant dynamic (the app reads THIS)
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Without `proxy_set_header X-Forwarded-Host $host;` the app sees `localhost`,
can't tell the tenant apart, and **every** subdomain falls back to
`PUBLIC_BASE_URL` — the middleware logs a loud `[middleware] No tenant host
header …` warning when this happens. The cure is the `X-Forwarded-Host` line
above, **not** editing `.env`. (`Host $host` alone is not enough — the Node
adapter ignores it.)

---

## `.env` File (per server)

Each deployed server has its own `.env`. It is **not committed to git**.

```env
# The ADMIN API origin used for SINGLE-TENANT server-side rendering.
# (Per-request SSR is resolved by middleware from the Host header; this is the
#  fallback when the proxy doesn't forward the host.)
PUBLIC_BASE_URL=https://admin-asly.cashierthru.com

# Fallback API for local dev (npm run dev) — no effect on production
PUBLIC_DEV_API_ORIGIN=https://admin-asly.cashierthru.com

# API path prefix
PUBLIC_LAST_ROUTE_API_URL=/api/
```

> Set `PUBLIC_BASE_URL` to the **admin API origin** (`https://admin-{shop}.cashierthru.com`),
> **not** the shop URL. SSR fetches it directly as `PUBLIC_BASE_URL + /api/`, and the
> middleware fallback uses it verbatim as the admin origin. The browser ignores it
> entirely — `window.location` drives per-tenant client calls. `getAdminOrigin()` keeps
> an idempotent guard so an old-style shop URL still resolves correctly.

---

## Flow Summary

```
User visits https://asly.cashierthru.com
                │
     ┌──────────┴───────────────────────────────┐
     │ Browser                                   │ Production SSR
     │ getAdminOrigin()                          │ middleware.ts reads
     │ window.location.hostname                  │ Host / X-Forwarded-Host
     │   → prepend "admin-"                      │   → derive admin origin
     │                                           │   (fallback: PUBLIC_BASE_URL,
     │                                           │    already an admin origin)
     └──────────┬───────────────────────────────┘
                │
                ▼
  https://admin-asly.cashierthru.com
                │
                ▼
  getApiUrl() → /api/   (client)
  Astro.locals.apiBase  (SSR)   →  all fetch calls
```
