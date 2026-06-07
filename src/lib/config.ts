import { useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROD_DOMAIN = "cashierthru.com";

// Used only during SSR / Astro build-time where window is unavailable.
// At runtime in the browser, window.location.origin is always used instead.
const SSR_FALLBACK =
  import.meta.env.PUBLIC_BASE_URL || "http://localhost:3000";

// ─── Core helpers ─────────────────────────────────────────────────────────────

/**
 * Returns the current tenant's origin.
 * Browser  → window.location.origin  (e.g. "https://myrestaurant.cashierthru.com")
 * SSR/build → PUBLIC_BASE_URL env var or "http://localhost:3000"
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    console.log("osama->> origin:"+window.location.origin)
    return window.location.origin;
  }
  return SSR_FALLBACK;
}

/**
 * Returns the admin API origin for the current tenant.
 * Always derived from window.location.origin in the browser — never static.
 *
 * "myrestaurant.cashierthru.com" → "https://admin-myrestaurant.cashierthru.com"
 * "fashionstore.cashierthru.com" → "https://admin-fashionstore.cashierthru.com"
 * "shop1.cashierthru.com"        → "https://admin-shop1.cashierthru.com"
 * "localhost" / SSR              → origin as-is (no subdomain to transform)
 */
export function getAdminOrigin(): string {
  // SSR / Astro build-time: window unavailable, use env fallback unchanged.
  if (typeof window === "undefined") {
    console.log("osama->> origin:"+SSR_FALLBACK)
    return SSR_FALLBACK;
  }

  const { protocol, hostname } = window.location;

  try {
    const parts = hostname.split(".");

    // Already prefixed — avoid double-prefixing if visiting admin-*.cashierthru.com
    if (parts[0].startsWith("admin-")) {
      return `${protocol}//${hostname}`;
    }

    // "myrestaurant.cashierthru.com" (3+ parts) → "admin-myrestaurant.cashierthru.com"
    if (parts.length >= 3) {
      parts[0] = `admin-${parts[0]}`;
      return `${protocol}//${parts.join(".")}`;
    }
  } catch {
    // fall through
  }

  // localhost or bare hostname — return origin unchanged
  return window.location.origin;
}

/**
 * Returns the API base URL for the current tenant.
 *
 * "myrestaurant.cashierthru.com" → "https://admin-myrestaurant.cashierthru.com/api/"
 * "fashionstore.cashierthru.com" → "https://admin-fashionstore.cashierthru.com/api/"
 * "localhost:3000"               → "http://localhost:3000/api/"
 *
 * Combined with "v1/endpoint" paths this produces:
 *   "https://admin-myrestaurant.cashierthru.com/api/v1/endpoint"
 */
export function getApiUrl(): string {
      console.log("osama->> origin:"+getAdminOrigin())

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
