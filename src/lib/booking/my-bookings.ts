// "My bookings on this device": booking tokens kept in localStorage for convenience only.
// The booking link (/booking/<token>) is what really identifies a booking.

import { isBookingToken } from "./api";

export const MY_BOOKINGS_KEY = "ct_my_bookings";
const MAX_SAVED = 20;

export interface SavedBooking {
  token: string;
  starts_at: string;
  saved_at: number;
  /** The store's WhatsApp link from the booking answer (POST 201 `whatsapp.url`), when there was one. */
  whatsapp_url?: string;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function storage(): StorageLike | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function readMyBookings(store: StorageLike | null = storage()): SavedBooking[] {
  if (!store) return [];
  try {
    const parsed = JSON.parse(store.getItem(MY_BOOKINGS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is SavedBooking => b && isBookingToken(b.token) && typeof b.starts_at === "string",
    );
  } catch {
    return [];
  }
}

/** Adds (or moves to the top) a booking; keeps the newest MAX_SAVED. */
export function saveMyBooking(
  booking: { token: string; starts_at: string; whatsapp_url?: string | null },
  store: StorageLike | null = storage(),
  now = Date.now(),
): SavedBooking[] {
  if (!store || !isBookingToken(booking.token)) return readMyBookings(store);
  const current = readMyBookings(store);
  // A later save without the link (e.g. the status page) keeps the one saved at booking time.
  const whatsapp_url = booking.whatsapp_url || current.find((b) => b.token === booking.token)?.whatsapp_url;
  const entry: SavedBooking = { token: booking.token, starts_at: booking.starts_at, saved_at: now };
  if (whatsapp_url) entry.whatsapp_url = whatsapp_url;
  const list = [entry, ...current.filter((b) => b.token !== booking.token)].slice(0, MAX_SAVED);
  try {
    store.setItem(MY_BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    // storage full or blocked: the booking still works through its link
  }
  return list;
}

export function findMyBooking(token: string, store: StorageLike | null = storage()): SavedBooking | null {
  return readMyBookings(store).find((b) => b.token === token) ?? null;
}
