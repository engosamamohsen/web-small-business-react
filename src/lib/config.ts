import { useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROD_DOMAIN = "cashierthru.com";

// Used only during SSR / Astro build-time where window is unavailable.
// At runtime in the browser, window.location.origin is always used instead.
const SSR_FALLBACK =
  import.meta.env.PUBLIC_BASE_URL || "http://localhost:3000";

// API origin used while developing (`npm run dev`) where localhost has no
// tenant subdomain to derive the admin API from. Test tenant by default.
// import.meta.env.DEV is true only on the dev server, so production builds
// are unaffected and keep the pure window.location.origin behavior.
const DEV_API_ORIGIN =
  import.meta.env.PUBLIC_DEV_API_ORIGIN || "https://admin-asly.cashierthru.com";

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Returns the current tenant's origin.
 * Browser  → window.location.origin  (e.g. "https://myrestaurant.cashierthru.com")
 * SSR/build → PUBLIC_BASE_URL env var or "http://localhost:3000"
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // console.log("osama->> origin:"+window.location.origin)
    return window.location.origin;
  }
  // Dev-server SSR: server-side fetches (fetch-hook.ts) append "/api/" to this,
  // so point them at the test tenant's admin API instead of localhost.
  return import.meta.env.DEV ? DEV_API_ORIGIN : SSR_FALLBACK;
}

/**
 * Returns the admin API origin for the current tenant.
 * Always derived from window.location.origin in the browser — never static.
 *
 * "myrestaurant.cashierthru.com" → "https://admin-myrestaurant.cashierthru.com"
 * "fashionstore.cashierthru.com" → "https://admin-fashionstore.cashierthru.com"
 * "shop1.cashierthru.com"        → "https://admin-shop1.cashierthru.com"
 * "localhost" (npm run dev)      → DEV_API_ORIGIN (test tenant)
 * SSR (prod build)               → PUBLIC_BASE_URL transformed to admin-* origin
 */
export function getAdminOrigin(): string {
  // SSR / Astro build-time
  if (typeof window === "undefined") {
    if (import.meta.env.DEV) return DEV_API_ORIGIN;
    // Transform https://shop.cashierthru.com → https://admin-shop.cashierthru.com
    try {
      const url = new URL(SSR_FALLBACK);
      const parts = url.hostname.split(".");
      if (parts.length >= 3) {
        const adminHost = `admin-${parts[0]}.${parts.slice(1).join(".")}`;
        return `${url.protocol}//${adminHost}`;
      }
    } catch {}
    return SSR_FALLBACK;
  }

  const { protocol, hostname } = window.location;

  // localhost / IP handling
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  ) {
    return DEV_API_ORIGIN;
  }

  const parts = hostname.split(".");

  // MUST be tenant.cashierthru.com
  if (parts.length >= 3) {
    const tenant = parts[0];

    const adminHost = `admin-${tenant}.${parts.slice(1).join(".")}`;

    return `${protocol}//${adminHost}`;
  }

  // fallback
  return `${protocol}//${hostname}`;
}

/**
 * Returns the API base URL for the current tenant.
 *
 * "myrestaurant.cashierthru.com" → "https://admin-myrestaurant.cashierthru.com/api/"
 * "fashionstore.cashierthru.com" → "https://admin-fashionstore.cashierthru.com/api/"
 * "localhost:3000" (npm run dev) → "https://admin-asly.cashierthru.com/api/"
 *
 * Combined with "v1/endpoint" paths this produces:
 *   "https://admin-myrestaurant.cashierthru.com/api/v1/endpoint"
 */
export function getApiUrl(): string {
      // console.log("osama->> origin:"+getAdminOrigin())

  return `${getAdminOrigin()}/api/`;
}

/**
 * Returns the versioned API URL (for display / logging).
 * Example: "https://admin-myrestaurant.cashierthru.com/api/v1/"
 */
export function getApiVersionedUrl(): string {
  return `${getAdminOrigin()}/api/v1/`;
}

/**
 * Extracts the shop subdomain from the current hostname.
 *
 * "myrestaurant.cashierthru.com" → "myrestaurant"
 * "asly.cashierthru.com"        → "asly"
 * "localhost"                   → "localhost"
 */
export function getShopName(): string {
  const origin = getBaseUrl();
  try {
    const { hostname } = new URL(origin);
    return extractSubdomain(hostname);
  } catch {
    return "localhost";
  }
}

/** True when running on localhost / a private IP. */
export function isLocalDev(): boolean {
  if (typeof window === "undefined") return true;
  const { hostname } = window.location;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  );
}

// ─── Internal ─────────────────────────────────────────────────────────────────

function extractSubdomain(hostname: string): string {
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  ) {
    return "localhost";
  }

  const parts = hostname.split(".");

  // "myrestaurant.cashierthru.com" → ["myrestaurant", "cashierthru", "com"]
  if (parts.length >= 3 && parts[parts.length - 2] === PROD_DOMAIN.split(".")[0]) {
    return parts[0];
  }

  // "cashierthru.com" → root domain, no tenant subdomain
  if (parts.length === 2) return hostname;

  return parts[0];
}

// ─── React hook ───────────────────────────────────────────────────────────────

export interface TenantConfig {
  baseUrl: string;
  adminOrigin: string;
  apiUrl: string;
  shopName: string;
  isDev: boolean;
}

/**
 * React hook — returns the current tenant's config.
 * Safe to call in any client component.
 *
 * @example
 * const { shopName, apiUrl } = useShopConfig();
 */
export function useShopConfig(): TenantConfig {
  console.log("osama->> useShopConfig");
  return useMemo(
    () => ({
      baseUrl: getBaseUrl(),
      adminOrigin: getAdminOrigin(),
      apiUrl: getApiUrl(),
      shopName: getShopName(),
      isDev: isLocalDev(),
    }),
    [],
  );
}
