import { g as getBaseUrl } from './fetchSettings_Cs_m47S2.mjs';

async function getSubdomain() {
  return getBaseUrl();
}

async function fetchHook({
  url,
  init,
  token,
  timeoutMs = 15e3,
  baseUrl
}) {
  const subdomain = await getSubdomain();
  const currentUrl = baseUrl ?? `${subdomain}${"/api/"}`;
  const fullUrl = `${currentUrl}${url}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const isGet = !init?.method || init.method === "GET";
    const headers = {
      Accept: "application/json, text/plain, */*",
      ...isGet ? {} : {
        "Content-Type": "application/json"
      },
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...init?.headers ?? {}
    };
    const res = await fetch(fullUrl, {
      ...init,
      // For data-only requests we default to GET unless caller overrides.
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

export { fetchHook as f };
