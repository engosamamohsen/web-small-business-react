/**
 * Fetch Hook - Safe fetch wrapper for all API requests
 *
 * Features:
 * - Automatic timeout handling with AbortController
 * - Bearer token injection
 * - JSON/text response parsing
 * - Subdomain-based URL construction
 * - Consistent error handling
 */

type FetchConfig = Omit<RequestInit, 'signal'> & {
  headers?: HeadersInit;
};

interface FetchingProps {
  url: string; // API endpoint path
  init?: FetchConfig; // Request configuration
  token?: string; // Bearer token (optional)
  timeoutMs?: number; // Request timeout (default: 15000ms)
  baseUrl?: string; // Override base URL (optional)
}

interface FetchResponse<T> {
  data: T | null;
  status: number;
  ok: boolean;
  error?: string;
}

/**
 * Get the subdomain/base URL for API requests
 * Uses environment variable for configuration
 */
function getSubdomain(): string {
  // return  import.meta.env.PUBLIC_API_BASE_URL || '';
  if (import.meta.env.PUBLIC_IS_LOCAL) {
    return import.meta.env.PUBLIC_BASE_URL || '';
  }
  return '';
}

/**
 * Safe fetch wrapper for GET-like data requests.
 * - Aborts on timeout
 * - Merges headers (adds JSON + optional Bearer)
 * - Handles empty/204 bodies
 * - Returns a stable shape for success/failure
 */
export async function fetchHook<T = any>({
  url,
  init,
  token,
  timeoutMs = 15000,
  baseUrl,
}: FetchingProps): Promise<FetchResponse<T>> {
  const subdomain = getSubdomain();

  const currentUrl =
    baseUrl ??
    `${subdomain}${import.meta.env.PUBLIC_LAST_ROUTE_API_URL || '/admin/api/'}`;
  const fullUrl = `${currentUrl}${url}`;
  console.log('fullUrl', fullUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = init?.body instanceof FormData;

    const headers: HeadersInit = {
      // Only set Content-Type for non-FormData requests
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    };

    const res = await fetch(fullUrl, {
      ...init,
      method: init?.method ?? 'GET',
      headers,
      signal: controller.signal,
    });

    const { status, ok } = res;

    // Try to parse body safely (may be empty or non-JSON)
    const contentType = res.headers.get('content-type') ?? '';
    let body: unknown = null;

    if (status !== 204) {
      if (contentType.includes('application/json')) {
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
        (typeof body === 'object' &&
          body &&
          'message' in body &&
          (body as any).message) ||
        (typeof body === 'object' &&
          body &&
          'error' in body &&
          (body as any).error) ||
        (typeof body === 'string' && body) ||
        res.statusText ||
        'Request failed';
      return { data: null, status, ok, error: String(message) };
    }

    // 204 No Content => data: null but ok: true
    return { data: (body as T) ?? null, status, ok };
  } catch (err: any) {
    const aborted = err?.name === 'AbortError';
    return {
      data: null,
      status: aborted ? 408 : 500,
      ok: false,
      error: aborted ? 'Request timed out' : (err?.message ?? 'Unknown error'),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Server-side fetch wrapper - for use in Astro page frontmatter
 * Returns data with optional caching headers hint
 */
export async function serverFetch<T = any>(
  url: string,
  options?: {
    token?: string;
    revalidate?: number;
  }
): Promise<FetchResponse<T>> {
  return fetchHook<T>({
    url,
    token: options?.token,
    // Note: Astro handles caching at build time for static pages
  });
}
