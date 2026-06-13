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
| `SSR_FALLBACK` | Production SSR (no `window`) | `PUBLIC_BASE_URL` from `.env` — the shop URL |
| `DEV_API_ORIGIN` | Local dev (`npm run dev`) | `PUBLIC_DEV_API_ORIGIN` from `.env` — the test tenant admin API |

---

### `getBaseUrl()`

Returns the **shop's own origin**.

```
Browser  →  window.location.origin        e.g. https://asly.cashierthru.com
SSR      →  PUBLIC_BASE_URL               e.g. https://asly.cashierthru.com
Dev      →  DEV_API_ORIGIN                e.g. https://admin-asly.cashierthru.com
```

Used by `getShopName()` to extract the tenant slug.

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
1. Parse `PUBLIC_BASE_URL` (the shop URL from `.env`)
2. Apply the same `admin-` transformation

```
PUBLIC_BASE_URL = https://asly.cashierthru.com
               →  https://admin-asly.cashierthru.com
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

## `.env` File (per server)

Each deployed server has its own `.env`. It is **not committed to git**.

```env
# The shop's public URL — what users type in the browser
PUBLIC_BASE_URL=https://asly.cashierthru.com

# Fallback API for local dev (npm run dev) — no effect on production
PUBLIC_DEV_API_ORIGIN=https://admin-asly.cashierthru.com

# API path prefix
PUBLIC_LAST_ROUTE_API_URL=/api/
```

> Set `PUBLIC_BASE_URL` to the **shop URL**, not the admin URL.
> The admin URL is derived automatically from it.

---

## Flow Summary

```
User visits https://asly.cashierthru.com
                │
                ▼
        getAdminOrigin()
                │
     ┌──────────┴──────────┐
     │ Browser             │ SSR
     │ window.location     │ PUBLIC_BASE_URL (.env)
     │ .hostname           │
     └──────────┬──────────┘
                │
        prepend "admin-"
                │
                ▼
  https://admin-asly.cashierthru.com
                │
                ▼
  getApiUrl() → /api/  →  all fetch calls
```
