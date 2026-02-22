// import { cache } from "react";

// ===== Types =====
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
  created_at?: string;
  updated_at?: string;
}

export type SettingsResponse = {
  data?: SettingsData;
  is_login?: boolean;
  cart_count?: number;
  ok: boolean;
  status?: number;
  error?: unknown;
};

// ===== Config =====
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "https://admin-osama.cashierthru.com/api";
const FETCH_TIMEOUT = 10000; // 10 seconds
const SETTINGS_CACHE_KEY = "app_settings";
const SETTINGS_TIMESTAMP_KEY = "app_settings_timestamp";
const SETTINGS_CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

// ===== LocalStorage Functions =====

/**
 * Get settings from localStorage
 */
export function getSettingsFromLocalStorage(): SettingsData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as SettingsData;
    }
  } catch (error) {
    console.error("[getSettingsFromLocalStorage] Error:", error);
  }
  return null;
}

/**
 * Save settings to localStorage
 */
export function saveSettingsToLocalStorage(settings: SettingsData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("[saveSettingsToLocalStorage] Error:", error);
  }
}

/**
 * Check if cached settings are still valid
 */
function isCacheValid(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const timestamp = localStorage.getItem(SETTINGS_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const age = Date.now() - parseInt(timestamp, 10);
    return age < SETTINGS_CACHE_DURATION;
  } catch {
    return false;
  }
}

/**
 * Clear settings cache
 */
export function clearSettingsCache(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SETTINGS_CACHE_KEY);
    localStorage.removeItem(SETTINGS_TIMESTAMP_KEY);
  } catch (error) {
    console.error("[clearSettingsCache] Error:", error);
  }
}

/**
 * Fetch with timeout to prevent hanging requests
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Base fetch function - NOT cached
 */
async function fetchSettingsBase(token?: string): Promise<SettingsResponse> {
  const url = `${API_BASE_URL}v1/setting-profile`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetchWithTimeout(
      url,
      {
        headers,
        // Removed next: { revalidate } as it is Next.js specific
        // Astro uses standard fetch caching or build-time fetching
      },
      FETCH_TIMEOUT
    );

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
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
    // Handle timeout
    if (error.name === "AbortError") {
      console.error("[fetchSettings] Request timed out");
      return { ok: false, status: 408, error: "Request timeout" };
    }

    console.error("[fetchSettings] Error:", error.message);
    return { ok: false, status: 500, error: error.message };
  }
}

/**
 * Cached public settings - for metadata and unauthenticated requests
 * Deduped within the same request using React cache()
 */
export const fetchPublicSettings = async (): Promise<SettingsResponse> => {
  // console.log("[fetchPublicSettings] Fetching public settings");
  return fetchSettingsBase(undefined);
};

/**
 * Cached settings - for authenticated requests
 * Uses localStorage cache to avoid multiple API calls
 * Checks localStorage first, then calls API only if not cached or cache is invalid
 */
export const fetchSettings = async (token?: string): Promise<SettingsResponse> => {
  // Check localStorage cache first (only for client-side, without token)
  if (!token && typeof window !== "undefined") {
    const cachedSettings = getSettingsFromLocalStorage();
    if (cachedSettings && isCacheValid()) {
      console.log("[fetchSettings] Using cached settings from localStorage");
      return {
        data: cachedSettings,
        ok: true,
        status: 200,
      };
    }
  }

  // Fetch from API
  const result = await fetchSettingsBase(token);

  // Save to localStorage if successful (only for public settings without token)
  if (result.ok && result.data && !token) {
    saveSettingsToLocalStorage(result.data);
    console.log("[fetchSettings] Saved settings to localStorage");
  }

  return result;
};
