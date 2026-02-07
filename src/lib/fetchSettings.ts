import { fetchHook } from './fetch-hook';

export interface SettingsData {
  name?: string;
  about_us?: string;
  keywords?: string[];
  logo?: string;
  website_url?: string;
  facebook_link?: string;
  instagram_link?: string;
  mainColor?: string;
  main_font_color?: string;
  status?: boolean;
}

export interface SettingsResponse {
  data: SettingsData | null;
  ok: boolean;
  is_login?: boolean;
  cart_count?: number;
}

let cachedSettings: SettingsResponse | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Fetches business settings with caching
 * Cache duration: 10 minutes
 */
export async function fetchSettings(token?: string): Promise<SettingsResponse> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedSettings && (now - cacheTime) < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const response = await fetchHook<SettingsResponse>({
      url: 'v1/setting-profile',
      token,
    });

    if (response.ok && response.data) {
      cachedSettings = response.data as SettingsResponse;
      cacheTime = now;
      return cachedSettings;
    }

    return {
      data: null,
      ok: false,
    };
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {
      data: null,
      ok: false,
    };
  }
}

/**
 * Clear the settings cache (useful for testing or forced refresh)
 */
export function clearSettingsCache(): void {
  cachedSettings = null;
  cacheTime = 0;
}
