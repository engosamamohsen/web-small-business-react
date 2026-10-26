// Public booking API client (Laravel routes/tenant-api.php → booking/*). Works on the server
// (pass Astro.locals.apiBase) and in the browser (pass getApiUrl()). Every failure becomes a
// BookingApiError whose `kind` the pages switch on; `message` is the server's Arabic text
// when it sent one.

import { t } from "./strings";
import type {
  AppointmentView,
  BookingCatalog,
  BookingRequest,
  BookingServiceDetail,
  BookingStaff,
  BookingWhatsApp,
  SlotsResult,
} from "./types";

export type BookingErrorKind =
  | "off" // 404 booking_off: the store doesn't take bookings
  | "not_found" // 404: unknown token
  | "slot_taken" // 409: someone took the time; see nextFree
  | "too_many" // 429: per phone / per day limit or throttle
  | "too_late" // 422 too_late: past the cancel window
  | "invalid" // 422: validation, honeypot, closed day…
  | "network" // no answer / timeout
  | "unknown";

export class BookingApiError extends Error {
  constructor(
    public kind: BookingErrorKind,
    message: string,
    public status: number,
    public nextFree: string[] = [],
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

const TIME_RE = /^\d{2}:\d{2}$/;
const TIMEOUT_MS = 15_000;

function firstValidationMessage(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (typeof value === "string") return value;
  }
  return null;
}

/** Maps an HTTP status + JSON body (may be null) to a BookingApiError. */
export function parseBookingError(status: number, body: unknown): BookingApiError {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const code = typeof b.error_code === "string" ? b.error_code : null;
  const serverMessage = typeof b.message === "string" && b.message.trim() ? b.message.trim() : null;

  if (status === 0) return new BookingApiError("network", t.errNetwork, 0);
  if (status === 404) {
    return code === "booking_off"
      ? new BookingApiError("off", serverMessage ?? t.errOff, status)
      : new BookingApiError("not_found", t.notFound, status);
  }
  if (status === 409 || code === "slot_taken") {
    const nextFree = Array.isArray(b.next_free)
      ? b.next_free.filter((v): v is string => typeof v === "string" && TIME_RE.test(v))
      : [];
    return new BookingApiError("slot_taken", serverMessage ?? t.errSlotTaken, status, nextFree);
  }
  if (status === 429) return new BookingApiError("too_many", code === "too_many" && serverMessage ? serverMessage : t.errTooMany, status);
  if (status === 422) {
    if (code === "too_late") return new BookingApiError("too_late", serverMessage ?? t.tooLate, status);
    return new BookingApiError("invalid", firstValidationMessage(b.errors) ?? serverMessage ?? t.errUnknown, status);
  }
  return new BookingApiError("unknown", serverMessage && status < 500 ? serverMessage : t.errUnknown, status);
}

function withLang(base: string, path: string, params?: URLSearchParams): string {
  const url = new URL(path, base);
  if (params) params.forEach((value, key) => url.searchParams.append(key, value));
  url.searchParams.set("lang", "ar");
  return url.toString();
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  return (await requestBody<{ data: T }>(url, init)).data;
}

async function requestBody<B>(url: string, init: RequestInit = {}): Promise<B> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      signal: init.signal ?? controller.signal,
      headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
    });
  } catch (error) {
    if ((error as { name?: string })?.name === "AbortError" && init.signal?.aborted) throw error;
    throw parseBookingError(0, null);
  } finally {
    clearTimeout(timer);
  }
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok || (body as { status?: unknown })?.status === false) throw parseBookingError(res.ok ? 422 : res.status, body);
  return body as B;
}

function idsParams(serviceIds: number[], extra: Record<string, string | number | null | undefined> = {}): URLSearchParams {
  const params = new URLSearchParams();
  for (const id of serviceIds) params.append("service_ids[]", String(id));
  for (const [key, value] of Object.entries(extra)) {
    if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
  }
  return params;
}

export function getCatalog(base: string, init?: RequestInit): Promise<BookingCatalog> {
  return request<BookingCatalog>(withLang(base, "v1/booking/services"), init);
}

/** One service by its slug (only the leading id counts); 404 → kind "not_found". */
export function getService(base: string, slug: string, init?: RequestInit): Promise<BookingServiceDetail> {
  return request<BookingServiceDetail>(withLang(base, `v1/booking/services/${encodeURIComponent(slug)}`), init);
}

export function getStaff(base: string, serviceIds: number[], branchId?: number | null, init?: RequestInit): Promise<BookingStaff[]> {
  return request<BookingStaff[]>(withLang(base, "v1/booking/staff", idsParams(serviceIds, { branch_id: branchId })), init);
}

export function getSlots(
  base: string,
  query: { serviceIds: number[]; date: string; staffId?: number | null; branchId?: number | null; location?: "salon" | "home" },
  init?: RequestInit,
): Promise<SlotsResult> {
  const params = idsParams(query.serviceIds, {
    date: query.date,
    staff_id: query.staffId,
    branch_id: query.branchId,
    // Home visits have fewer times (road time is blocked); the salon is the default.
    location: query.location === "home" ? "home" : null,
  });
  return request<SlotsResult>(withLang(base, "v1/booking/slots", params), init);
}

/**
 * The store's WhatsApp hand-off from a 201, or null. Only WhatsApp's own https addresses are
 * accepted, since the page sends the customer there.
 */
export function parseBookingWhatsApp(value: unknown): BookingWhatsApp | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.url !== "string") return null;
  let url: URL;
  try {
    url = new URL(v.url);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !["api.whatsapp.com", "wa.me", "web.whatsapp.com"].includes(url.hostname)) return null;
  return {
    url: url.toString(),
    number: typeof v.number === "string" ? v.number : "",
    message: typeof v.message === "string" ? v.message : "",
  };
}

export async function createBooking(
  base: string,
  body: BookingRequest,
): Promise<{ booking: AppointmentView; whatsapp: BookingWhatsApp | null }> {
  const res = await requestBody<{ data: AppointmentView; whatsapp?: unknown }>(withLang(base, "v1/booking"), {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { booking: res.data, whatsapp: parseBookingWhatsApp(res.whatsapp) };
}

/** Tokens are 32 letters/digits (the server 404s anything else). */
export function isBookingToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9]{32}$/.test(value);
}

export function getBooking(base: string, token: string, init?: RequestInit): Promise<AppointmentView> {
  return request<AppointmentView>(withLang(base, `v1/booking/${encodeURIComponent(token)}`), init);
}

export function cancelBooking(base: string, token: string, reason?: string): Promise<AppointmentView> {
  return request<AppointmentView>(withLang(base, `v1/booking/${encodeURIComponent(token)}/cancel`), {
    method: "POST",
    body: JSON.stringify(reason ? { reason } : {}),
  });
}
