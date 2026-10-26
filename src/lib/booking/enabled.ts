// Does this store take bookings (setting-profile `booking.enabled`)?
//   • server: src/middleware.ts runs the request inside a holder registered on globalThis
//     (node:async_hooks stays out of the client bundle, like store-config.ts);
//   • browser: Layout.astro prints it in window.__CT_STORE__.booking before islands hydrate.
// So the header renders the same on both sides.

import type { BookingSetting } from "./types";

type BookingHolder = { getStore(): boolean | undefined };

export function bookingEnabled(): boolean {
  if (typeof window !== "undefined") {
    const store = (window as unknown as { __CT_STORE__?: { booking?: BookingSetting } }).__CT_STORE__;
    return Boolean(store?.booking?.enabled);
  }
  const holder = (globalThis as unknown as { __ctBookingStore?: BookingHolder }).__ctBookingStore;
  return Boolean(holder?.getStore());
}

/** setting-profile `booking` → {enabled}; anything unexpected is off. */
export function bookingFromSettings(value: unknown): BookingSetting {
  return { enabled: Boolean(value && typeof value === "object" && (value as BookingSetting).enabled === true) };
}
