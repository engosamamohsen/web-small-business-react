"use client";

import { useState, useEffect } from "react";
import { getSettingsFromLocalStorage, SettingsData } from "./fetchSettings";

/**
 * Hook to get settings from localStorage
 * Returns cached settings without making API calls
 * Use this when you need settings in client components without fetching from API
 */
export function useSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get settings from localStorage (client-side only)
    const cachedSettings = getSettingsFromLocalStorage();
    if (cachedSettings) {
      setSettings(cachedSettings);
    }
    setLoading(false);
  }, []);

  return { settings, loading };
}
