// src/hooks/fetch-hook.ts
import getSubdomain from "@/lib/subdomain";

// utils/fetchingData.ts
type CacheMode = "force-cache" | "no-store";
// type NextConfig = { revalidate?: number | false; tags?: string[] }; // Removed NextConfig

type FetchConfig = Omit<RequestInit, "headers" | "signal"> & {
  cache?: CacheMode;
  // next?: NextConfig; // Removed next config
  headers?: HeadersInit;
};

interface FetchingProps {
  url: string; // path or absolute
  init?: FetchConfig; // cache/next/etc.
  token?: string; // bearer token (optional)
  timeoutMs?: number; // request timeout
  baseUrl?: string; // override base (optional)
}

/**
 * Safe fetch wrapper for GET-like data requests.
 * - Aborts on timeout
 * - Merges headers (adds JSON Accept + optional Bearer)
 * - Handles empty/204 bodies
 * - Returns a stable shape for success/failure
 */
export async function fetchHook<T = any>({
  url,
  init,
  token,
  timeoutMs = 15000,
  baseUrl,
}: FetchingProps): Promise<{
  data: T | any;
  status: number;
  ok: boolean;
  error?: string;
}> {
  const subdomain = await getSubdomain();

  const currentUrl =
    baseUrl ?? `${subdomain}${import.meta.env.PUBLIC_LAST_ROUTE_API_URL}`;
  const fullUrl = `${currentUrl}${url}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isGet = !init?.method || init.method === "GET";

    const headers: HeadersInit = {
      Accept: "application/json, text/plain, */*",
      ...(isGet
        ? {}
        : {
          "Content-Type": "application/json",
        }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    };

    const res = await fetch(fullUrl, {
      ...init,
      // For data-only requests we default to GET unless caller overrides.
      method: init?.method ?? "GET",
      headers,
      signal: controller.signal,
    });

    const { status, ok } = res;

    // Try to parse body safely (may be empty or non-JSON)
    const contentType = res.headers.get("content-type") ?? "";
    let body: unknown = null;

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
      const message =
        (typeof body === "object" &&
          body &&
          "message" in body &&
          (body as any).message) ||
        (typeof body === "object" &&
          body &&
          "error" in body &&
          (body as any).error) ||
        (typeof body === "string" && body) ||
        res.statusText ||
        "Request failed";

      return { data: null, status, ok, error: String(message) };
    }

    // 204 No Content => data: null but ok: true
    return { data: (body as T) ?? null, status, ok };
  } catch (err: any) {
    const aborted = err?.name === "AbortError";
    return {
      data: null,
      status: aborted ? 408 : 500,
      ok: false,
      error: aborted ? "Request timed out" : (err?.message ?? "Unknown error"),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
