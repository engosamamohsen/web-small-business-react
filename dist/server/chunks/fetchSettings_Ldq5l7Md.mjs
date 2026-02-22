const API_BASE_URL = "https://admin-osama.cashierthru.com/api/";
const FETCH_TIMEOUT = 1e4;
const SETTINGS_CACHE_KEY = "app_settings";
const SETTINGS_TIMESTAMP_KEY = "app_settings_timestamp";
const SETTINGS_CACHE_DURATION = 1e3 * 60 * 60;
function getSettingsFromLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("[getSettingsFromLocalStorage] Error:", error);
  }
  return null;
}
function saveSettingsToLocalStorage(settings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("[saveSettingsToLocalStorage] Error:", error);
  }
}
function isCacheValid() {
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
async function fetchWithTimeout(url, options, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
async function fetchSettingsBase(token) {
  const url = `${API_BASE_URL}v1/setting-profile`;
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetchWithTimeout(
      url,
      {
        headers
        // Removed next: { revalidate } as it is Next.js specific
        // Astro uses standard fetch caching or build-time fetching
      },
      FETCH_TIMEOUT
    );
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}`
      };
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
    if (error.name === "AbortError") {
      console.error("[fetchSettings] Request timed out");
      return { ok: false, status: 408, error: "Request timeout" };
    }
    console.error("[fetchSettings] Error:", error.message);
    return { ok: false, status: 500, error: error.message };
  }
}
const fetchPublicSettings = async () => {
  return fetchSettingsBase(void 0);
};
const fetchSettings = async (token) => {
  if (!token && typeof window !== "undefined") {
    const cachedSettings = getSettingsFromLocalStorage();
    if (cachedSettings && isCacheValid()) {
      console.log("[fetchSettings] Using cached settings from localStorage");
      return {
        data: cachedSettings,
        ok: true,
        status: 200
      };
    }
  }
  const result = await fetchSettingsBase(token);
  if (result.ok && result.data && !token) {
    saveSettingsToLocalStorage(result.data);
    console.log("[fetchSettings] Saved settings to localStorage");
  }
  return result;
};

export { fetchSettings as a, fetchPublicSettings as f, saveSettingsToLocalStorage as s };
