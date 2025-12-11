import { cache } from "react";
import { cookies } from "next/headers";
import { fetchHook } from "./fetch-hook";

type SettingsResponse = {
  data?: any;
  is_login?: boolean;
  ok: boolean;
  status?: number;
  error?: unknown;
};

/**
 * Base fetch function - NOT cached, used internally
 */
async function fetchSettingsBase(
  token?: string,
  revalidate: number = 600
): Promise<SettingsResponse> {
  try {
    const res = await fetchHook({
      url: `v1/setting-profile`,
      // Only skip cache if we have a token AND need fresh auth state
      init: token
        ? { next: { revalidate: 60 } } // Revalidate every 60s for authenticated users
        : { next: { revalidate } },     // 10 min cache for public
      token,
    });

    return res.ok
      ? { ...res.data, ok: true }
      : { ok: false, status: res.status, error: res.error, is_login: false };
  } catch (error) {
    return { ok: false, status: 500, error, is_login: false };
  }
}

/**
 * Cached public settings - for metadata and unauthenticated requests
 * This is cached across the entire request lifecycle
 */
export const fetchPublicSettings = cache(
  async (): Promise<SettingsResponse> => {
    return fetchSettingsBase(undefined, 600);
  }
);

/**
 * Cached authenticated settings - for layout and authenticated requests
 * Uses React's cache() to dedupe within the same request
 */
export const fetchSettings = cache(
  async (token?: string): Promise<SettingsResponse> => {
    // If no token, use public settings (already cached)
    if (!token) {
      return fetchPublicSettings();
    }
    return fetchSettingsBase(token, 60);
  }
);

/**
 * Helper to get settings with token from cookies
 * Use this in Server Components to avoid passing token around
 */
export const getSettings = cache(async (): Promise<SettingsResponse> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  return fetchSettings(token);
});