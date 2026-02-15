const API_BASE_URL = "https://admin-emend.cashierthru.com/api/";
const FETCH_TIMEOUT = 1e4;
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
  const url = `${API_BASE_URL}/v1/setting-profile`;
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
  if (!token) {
    return fetchPublicSettings();
  }
  return fetchSettingsBase(token);
};

export { fetchSettings as a, fetchPublicSettings as f };
