function getSubdomain() {
  {
    return "https://admin-emend.cashierthru.com";
  }
}
async function fetchHook({
  url,
  init,
  token,
  timeoutMs = 15e3,
  baseUrl
}) {
  const subdomain = getSubdomain();
  const currentUrl = baseUrl ?? `${subdomain}${"/api/"}`;
  const fullUrl = `${currentUrl}${url}`;
  console.log("fullUrl", fullUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const isFormData = init?.body instanceof FormData;
    const headers = {
      // Only set Content-Type for non-FormData requests
      ...isFormData ? {} : { "Content-Type": "application/json" },
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...init?.headers ?? {}
    };
    const res = await fetch(fullUrl, {
      ...init,
      method: init?.method ?? "GET",
      headers,
      signal: controller.signal
    });
    const { status, ok } = res;
    const contentType = res.headers.get("content-type") ?? "";
    let body = null;
    if (status !== 204) {
      if (contentType.includes("application/json")) {
        try {
          body = await res.json();
        } catch {
          body = null;
        }
      } else {
        try {
          body = await res.text();
        } catch {
          body = null;
        }
      }
    }
    if (!ok) {
      const message = typeof body === "object" && body && "message" in body && body.message || typeof body === "object" && body && "error" in body && body.error || typeof body === "string" && body || res.statusText || "Request failed";
      return { data: null, status, ok, error: String(message) };
    }
    return { data: body ?? null, status, ok };
  } catch (err) {
    const aborted = err?.name === "AbortError";
    return {
      data: null,
      status: aborted ? 408 : 500,
      ok: false,
      error: aborted ? "Request timed out" : err?.message ?? "Unknown error"
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

let cachedSettings = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1e3;
async function fetchSettings(token) {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_DURATION) {
    return cachedSettings;
  }
  try {
    const response = await fetchHook({
      url: "v1/setting-profile",
      token
    });
    if (response.ok && response.data) {
      cachedSettings = response.data;
      cacheTime = now;
      return cachedSettings;
    }
    return {
      data: null,
      ok: false
    };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {
      data: null,
      ok: false
    };
  }
}

export { fetchSettings as a, fetchHook as f };
