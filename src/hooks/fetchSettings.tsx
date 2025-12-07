import { cache } from "react";
import { fetchHook } from "./fetch-hook";

type SettingsResponse = {
  data?: any;
  is_login?: boolean;
  ok: boolean;
  status?: number;
  error?: unknown;
};

export async function fetchSettings(
  token?: string,
  { revalidate = 600 }: { revalidate?: number } = {},
): Promise<SettingsResponse> {
  try {
    const res = await fetchHook({
      url: `v1/setting-profile`,
      init: token ? { cache: "no-store" } : { next: { revalidate } },
      token,
    });

    return res.ok
      ? { ...res.data, ok: true }
      : { ok: false, status: res.status, error: res.error, is_login: false };
  } catch (error) {
    return { ok: false, status: 500, error, is_login: false };
  }
}

// Cache public settings for reuse across server calls like metadata generation.
export const fetchPublicSettings = cache(async () => fetchSettings(undefined));
