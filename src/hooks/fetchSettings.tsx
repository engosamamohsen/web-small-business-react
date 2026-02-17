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
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "https://admin-emend.cashierthru.com/api";
const FETCH_TIMEOUT = 10000; // 10 seconds

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
 * Each unique token gets its own cache entry
 */
export const fetchSettings = async (token?: string): Promise<SettingsResponse> => {

  // if (!token) {
  //   return fetchPublicSettings();
  // }
  return fetchSettingsBase(token);
};
