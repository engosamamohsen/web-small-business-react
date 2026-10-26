import { useEffect, useMemo, useState } from "react";
import { closedText, storeStatus, type HoursLang, type StoreHoursSetting, type StoreStatus } from "@/lib/store-hours";

/** How often the open / closed state is looked at again. */
const TICK_MS = 60_000;

/** The `hours` block Layout.astro printed in window.__CT_STORE__ ({enabled:false} when off). */
export function bootHours(): StoreHoursSetting {
  if (typeof window === "undefined") return { enabled: false };
  const store = (window as unknown as { __CT_STORE__?: { hours?: StoreHoursSetting } }).__CT_STORE__;
  return store?.hours?.enabled ? store.hours : { enabled: false };
}

export interface StoreHoursState {
  hours: StoreHoursSetting;
  status: StoreStatus;
  /** The closed notice ("" while the store takes orders). */
  text: string;
  /** Not taking website orders right now (a hint: the server's 422 is final). */
  closed: boolean;
}

/**
 * Whether the store takes website orders now, re-checked every minute.
 *
 * `hours` / `initialNow` let a server-rendered island (the banner) draw the same thing on
 * the server and on first hydration; without them the hook starts "open" and reads
 * window.__CT_STORE__ after mounting, so it never disagrees with the server's HTML.
 */
export function useStoreHours(
  hours?: StoreHoursSetting | null,
  initialNow?: string | null,
  lang: HoursLang = "ar",
): StoreHoursState {
  const [setting, setSetting] = useState<StoreHoursSetting>(hours ?? { enabled: false });
  const [now, setNow] = useState<number>(() => {
    const parsed = initialNow ? Date.parse(initialNow) : NaN;
    return Number.isFinite(parsed) ? parsed : Date.now();
  });

  useEffect(() => {
    if (!hours) setSetting(bootHours());
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    // A tab coming back from the background catches up at once.
    const onVisible = () => document.visibilityState === "visible" && setNow(Date.now());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [hours]);

  return useMemo(() => {
    const at = new Date(now);
    const status = storeStatus(setting, at);
    return { hours: setting, status, text: closedText(setting, status, at, lang), closed: !status.accepting };
  }, [setting, now, lang]);
}
