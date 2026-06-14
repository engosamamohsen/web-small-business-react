// src/hooks/fetchSettings.ts
import { getApiUrl } from "@/lib/config";

export interface SettingsData {
  id: number;
  name?: string;
  about_us?: string;
  phone?: string;
  whatsapp_phone?: string;
  logo?: string;
  main_color?: string;
  main_bg?: string;
  main_font_color?: string;
  facebook_link?: string;
  instagram_link?: string;
  tax?: number;
  service?: number;
  vat?: string;
  keywords?: string[];
  product_default_image?: string;
  full_address?: string;
  contact_email?: string;
  created_at?: string;
  updated_at?: string;
  plan_type?: string;
  shop_type?: string;
}

export type SettingsResponse = {
  data?: SettingsData;
  is_login?: boolean;
  cart_count?: number;
  ok: boolean;
  status?: number;
  error?: unknown;
};

// Resolved at call time from window.location.origin — never a hardcoded domain.
// Returns e.g. "https://myrestaurant.cashierthru.com/api/"
const getApiBase = () => getApiUrl();
const FETCH_TIMEOUT = 10000;
const SETTINGS_CACHE_KEY = "app_settings";
const SETTINGS_CACHE_TIMESTAMP_KEY = "app_settings_timestamp";
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes — storefront settings (e.g. WhatsApp number) propagate within this window on the client
const SERVER_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes on server

// ===== Server-side Cache =====
// Keyed by apiBase so different tenants never share cached settings.
const serverSettingsCache = new Map<string, { data: SettingsData; timestamp: number }>();

// ===== LocalStorage Helpers =====
export function getSettingsFromLocalStorage(): SettingsData | null {
  if (typeof window === "undefined") return null; // SSR safe
  try {
    console.log("[Settings] get settings from local storage");
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    const timestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP_KEY);
    if (!cached || !timestamp) return null;

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_DURATION) {
      console.log("[Settings] cached settings expired");
      return null;
    }

    return JSON.parse(cached) as SettingsData;
  } catch (error) {
    console.log("[Settings] error reading localStorage", error);
    return null;
  }
}

function saveSettingsToLocalStorage(settings: SettingsData): void {
  if (typeof window === "undefined") return; // SSR safe
  try {
    console.log("[Settings] save settings to local storage");
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.log("[Settings] error saving to localStorage", error);
  }
}

// ===== Fetch with Timeout =====
async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ===== Base API Fetch =====
async function fetchSettingsBase(token?: string, baseUrl?: string): Promise<SettingsResponse> {
  console.log("[Settings] fetch settings api 2", baseUrl);
  const url = new URL("v1/setting-profile", baseUrl ?? getApiBase()).toString();

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetchWithTimeout(url, { headers });

    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return {
      data: result.data,
      is_login: result.is_login ?? false,
      cart_count: result.cart_count ?? 0,
      ok: true,
      status: response.status,
    };
  } catch (error: any) {
    if (error.name === "AbortError")
      return { ok: false, status: 408, error: "Request timeout" };
    return { ok: false, status: 500, error: error.message };
  }
}

// ===== Public Fetch Function (with caching and dedup) =====
// Per-tenant dedup map so concurrent requests for the same tenant share one fetch.
const ongoingFetches = new Map<string, Promise<SettingsResponse>>();

export async function fetchSettings(
  token?: string,
  forceRefresh: boolean = false,
  // SSR pages pass Astro.locals.apiBase so the correct tenant's API is used.
  // Client-side calls omit this; getApiUrl() reads window.location instead.
  baseUrl?: string,
): Promise<SettingsResponse> {
  const isServer = typeof window === "undefined";
  // Cache key per tenant — prevents cross-tenant contamination in the server cache.
  const cacheKey = baseUrl ?? (isServer ? getApiBase() : "client");

  // Check Server Cache
  if (isServer && !forceRefresh) {
    const cached = serverSettingsCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < SERVER_CACHE_DURATION) {
        return { data: cached.data, ok: true, status: 200 };
      }
    }
  }

  // Check Client Cache
  if (!isServer && !forceRefresh) {
    const cached = getSettingsFromLocalStorage();
    if (cached) {
      const timestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP_KEY);
      const age = timestamp ? Date.now() - parseInt(timestamp, 10) : CACHE_DURATION + 1;

      // Return immediately if within duration
      if (age < CACHE_DURATION) {
        return { data: cached, ok: true, status: 200 };
      }

      // Background refresh if expired
      console.log("[Settings] cache expired, refreshing in background");
      fetchSettingsBase(token, baseUrl).then((res) => {
        if (res.ok && res.data) {
          saveSettingsToLocalStorage(res.data);
        }
      });

      return { data: cached, ok: true, status: 200 };
    }
  }

  // Deduplicate concurrent fetches per tenant
  const existing = ongoingFetches.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const result = await fetchSettingsBase(token, baseUrl);
      if (result.ok && result.data) {
        if (isServer) {
          serverSettingsCache.set(cacheKey, { data: result.data, timestamp: Date.now() });
        } else {
          saveSettingsToLocalStorage(result.data);
        }
      }
      return result;
    } finally {
      ongoingFetches.delete(cacheKey);
    }
  })();

  ongoingFetches.set(cacheKey, promise);
  return promise;
}