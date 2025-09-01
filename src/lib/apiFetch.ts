// lib/api-fetch.ts

import { getCachedOrigin, getOrigin } from "./getOrigin";

function withBase(pathOrUrl: string, origin: string) {
  // Accept absolute URLs as-is; otherwise prepend the origin.
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, origin).toString();
}

export async function apiFetch(
  pathOrUrl: string,
  init?: RequestInit & { next?: { revalidate?: number } },
  initOrigin?: string,
) {
  if (typeof window !== "undefined") {
    // Client: use relative paths (same-origin automatically)
    return fetch(pathOrUrl, init);
  } else {
    if (!initOrigin) {
      // Server: make it absolute using the per-request origin
      const origin = getCachedOrigin() || (await getOrigin());
      const url = withBase(pathOrUrl, origin);
      console.log("url_apiFetch", url);
      return fetch(url, init);
    } else {
      const url = withBase(pathOrUrl, initOrigin);
      console.log("url_apiFetch", url);
      return fetch(url, init);
    }
  }
}
