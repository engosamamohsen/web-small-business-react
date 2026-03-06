// src/hooks/fetchSettings.ts
import { useEffect, useState } from "react";

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

const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || "https://admin-osama.cashierthru.com/api";
const FETCH_TIMEOUT = 10000;
const SETTINGS_CACHE_KEY = "app_settings";
const SETTINGS_CACHE_TIMESTAMP_KEY = "app_settings_timestamp";
const CACHE_DURATION = 1000 * 60 * 60; // 60 minutes
const SERVER_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes on server

// ===== Server-side Cache =====
let serverSettingsCache: { data: SettingsData; timestamp: number } | null = null;

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
async function fetchSettingsBase(token?: string): Promise<SettingsResponse> {
  console.log("[Settings] fetch settings api");
  const url = new URL("v1/setting-profile", API_BASE_URL).toString();

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
let ongoingFetch: Promise<SettingsResponse> | null = null;

export async function fetchSettings(
  token?: string,
  forceRefresh: boolean = false
): Promise<SettingsResponse> {
  const isServer = typeof window === "undefined";

  // Check Server Cache
  if (isServer && !forceRefresh && serverSettingsCache) {
    const age = Date.now() - serverSettingsCache.timestamp;
    if (age < SERVER_CACHE_DURATION) {
      return { data: serverSettingsCache.data, ok: true, status: 200 };
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
      fetchSettingsBase(token).then((res) => {
        if (res.ok && res.data) {
          saveSettingsToLocalStorage(res.data);
        }
      });

      return { data: cached, ok: true, status: 200 };
    }
  }

  // Deduplicate concurrent fetches
  if (ongoingFetch) return ongoingFetch;

  ongoingFetch = (async () => {
    try {
      const result = await fetchSettingsBase(token);
      if (result.ok && result.data) {
        if (isServer) {
          serverSettingsCache = { data: result.data, timestamp: Date.now() };
        } else {
          saveSettingsToLocalStorage(result.data);
        }
      }
      return result;
    } finally {
      ongoingFetch = null;
    }
  })();

  return ongoingFetch;
}

// ===== React Hook for Client-side Usage =====
export function useSettings(token?: string) {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchSettings(token).then((res) => {
      if (mounted) {
        if (res.ok && res.data) setSettings(res.data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [token]);

  return { settings, loading };
}