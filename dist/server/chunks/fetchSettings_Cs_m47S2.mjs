import 'react';

const SSR_FALLBACK = "http://localhost:3000";
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return SSR_FALLBACK;
}
function getAdminOrigin() {
  if (typeof window === "undefined") {
    return SSR_FALLBACK;
  }
  const { protocol, hostname } = window.location;
  try {
    const parts = hostname.split(".");
    if (parts[0].startsWith("admin-")) {
      return `${protocol}//${hostname}`;
    }
    if (parts.length >= 3) {
      parts[0] = `admin-${parts[0]}`;
      return `${protocol}//${parts.join(".")}`;
    }
  } catch {
  }
  return window.location.origin;
}
function getApiUrl() {
  return `${getAdminOrigin()}/api/`;
}

const getApiBase = () => getApiUrl();
const FETCH_TIMEOUT = 1e4;
const SETTINGS_CACHE_KEY = "app_settings";
const SETTINGS_CACHE_TIMESTAMP_KEY = "app_settings_timestamp";
const CACHE_DURATION = 1e3 * 60 * 60;
const SERVER_CACHE_DURATION = 1e3 * 60 * 5;
let serverSettingsCache = null;
function getSettingsFromLocalStorage() {
  if (typeof window === "undefined") return null;
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
    return JSON.parse(cached);
  } catch (error) {
    console.log("[Settings] error reading localStorage", error);
    return null;
  }
}
function saveSettingsToLocalStorage(settings) {
  if (typeof window === "undefined") return;
  try {
    console.log("[Settings] save settings to local storage");
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.log("[Settings] error saving to localStorage", error);
  }
}
async function fetchWithTimeout(url, options) {
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
async function fetchSettingsBase(token) {
  console.log("[Settings] fetch settings api");
  const url = new URL("v1/setting-profile", getApiBase()).toString();
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
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
      status: response.status
    };
  } catch (error) {
    if (error.name === "AbortError")
      return { ok: false, status: 408, error: "Request timeout" };
    return { ok: false, status: 500, error: error.message };
  }
}
let ongoingFetch = null;
async function fetchSettings(token, forceRefresh = false) {
  const isServer = typeof window === "undefined";
  if (isServer && !forceRefresh && serverSettingsCache) {
    const age = Date.now() - serverSettingsCache.timestamp;
    if (age < SERVER_CACHE_DURATION) {
      return { data: serverSettingsCache.data, ok: true, status: 200 };
    }
  }
  if (!isServer && !forceRefresh) {
    const cached = getSettingsFromLocalStorage();
    if (cached) {
      const timestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP_KEY);
      const age = timestamp ? Date.now() - parseInt(timestamp, 10) : CACHE_DURATION + 1;
      if (age < CACHE_DURATION) {
        return { data: cached, ok: true, status: 200 };
      }
      console.log("[Settings] cache expired, refreshing in background");
      fetchSettingsBase(token).then((res) => {
        if (res.ok && res.data) {
          saveSettingsToLocalStorage(res.data);
        }
      });
      return { data: cached, ok: true, status: 200 };
    }
  }
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

export { getApiUrl as a, fetchSettings as f, getBaseUrl as g };
