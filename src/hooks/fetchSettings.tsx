import { cache } from "react";

// ===== Types =====
/**
 * One tracking service the merchant added in the dashboard (Tracking & pixels).
 * `type` is e.g. meta_pixel, google_analytics, custom; unknown types are skipped.
 */
export type TrackingItem = {
  ref: string;
  type: string;
  id?: string;
  name?: string;
  placement?: "head" | "body";
  code?: string;
};

export type SettingsResponse = {
  data?: any;
  tracking?: TrackingItem[];
  is_login?: boolean;
  cart_count?: number;
  ok: boolean;
  status?: number;
  error?: unknown;
};

// ===== Config =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://emend.cashierthru.com";
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
async function fetchSettingsBase(token?: string, fresh = false): Promise<SettingsResponse> {
  const url = `${API_BASE_URL}/v1/setting-profile`;

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
        // `fresh`: the tracking test view (?ct_debug=1) must show what was saved a second ago
        ...(fresh
          ? { cache: "no-store" as const }
          : { next: { revalidate: token ? 60 : 300 } }), // 1 min for auth, 5 min for public
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
      tracking: Array.isArray(result.tracking) ? result.tracking : [],
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
export const fetchPublicSettings = cache(async (fresh = false): Promise<SettingsResponse> => {
  return fetchSettingsBase(undefined, fresh);
});

/**
 * Cached settings - for authenticated requests
 * Each unique token gets its own cache entry
 */
export const fetchSettings = cache(async (token?: string, fresh = false): Promise<SettingsResponse> => {
  if (!token) {
    return fetchPublicSettings(fresh);
  }
  return fetchSettingsBase(token, fresh);
});