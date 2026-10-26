// ─── Opening hours (docs/talent-booking.md 4, phase C) ───────────────────────
//
// The setting-profile API returns the store's `hours` block. This file works out, in the
// browser, whether the store takes website orders right now. It mirrors the backend's
// App\Support\StoreHours (intervals() + status()):
//   • weekly ranges per weekday (0 = Sunday); a range whose close is not after its open runs
//     past midnight; 00:00–00:00 is open 24 hours; a weekday with no range is closed;
//   • touching / overlapping ranges are one opening (Fri 18:00–00:00 + Sat 00:00–02:00);
//   • days off (closures) cut time out;
//   • "accepting" = open AND now + last_order_minutes ≤ end of the current opening.
// All wall times are in the store's timezone (Africa/Cairo), via Intl — no date library.
//
// This is only a hint: settings are cached for minutes, and the order endpoints answer
// 422 store_closed / last_orders_closed, which is final (see closedRefusal in guest-order.ts).

export interface StoreHoursRange {
  opens: string; // "HH:MM"
  closes: string; // "HH:MM"
}

export interface StoreHoursClosure {
  starts_at: string; // ISO
  ends_at: string; // ISO
  reason?: string | null;
}

export interface StoreHoursSetting {
  enabled: boolean;
  timezone?: string;
  open_now?: boolean;
  accepting_orders?: boolean;
  closes_at?: string | null;
  next_open_at?: string | null;
  last_order_minutes?: number;
  /** The owner's closed message (or the default), in the requested language. */
  message?: string;
  week?: { weekday: number; ranges: StoreHoursRange[] }[];
  closures_next_14_days?: StoreHoursClosure[];
}

export interface StoreStatus {
  enabled: boolean;
  open: boolean;
  accepting: boolean;
  closesAt: Date | null;
  nextOpenAt: Date | null;
  /** Accepting, but the last-order cut-off is 30 minutes away or less. */
  closingSoon: boolean;
}

export type HoursLang = "ar" | "en";

export const DEFAULT_TIMEZONE = "Africa/Cairo";
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
/** Days ahead searched for the next opening. Closures are only known 14 days ahead. */
const HORIZON_DAYS = 15;
const CLOSING_SOON_MINUTES = 30;

const ALWAYS_OPEN: StoreStatus = {
  enabled: false,
  open: true,
  accepting: true,
  closesAt: null,
  nextOpenAt: null,
  closingSoon: false,
};

// ── Timezone helpers ─────────────────────────────────────────────────────────

const formatters = new Map<string, Intl.DateTimeFormat>();
function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Wall-clock fields of `ms` in `timeZone`. */
export function zonedParts(ms: number, timeZone: string) {
  const out: Record<string, number> = {};
  for (const p of partsFormatter(timeZone).formatToParts(new Date(ms))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  const hour = out.hour === 24 ? 0 : out.hour;
  return { year: out.year, month: out.month, day: out.day, hour, minute: out.minute, second: out.second };
}

/** Offset (ms) of `timeZone` from UTC at instant `ms`. */
function offsetAt(ms: number, timeZone: string): number {
  const p = zonedParts(ms, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** The instant of a wall-clock time in `timeZone` (month 1-12; day may overflow). */
export function zonedTime(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  let ms = guess - offsetAt(guess, timeZone);
  // Second pass settles a DST change between the guess and the answer.
  const again = guess - offsetAt(ms, timeZone);
  if (again !== ms) ms = again;
  return ms;
}

function minutesOf(time: string): [number, number] {
  const [h, m] = String(time).split(":").map((v) => parseInt(v, 10) || 0);
  return [h, m];
}

// ── Intervals ────────────────────────────────────────────────────────────────

type Interval = [number, number]; // [start, end) in ms

/** Open intervals around `now`: weekly ranges on the calendar, touching ones merged, closures cut out. */
export function openIntervals(hours: StoreHoursSetting, now: number, horizonDays = HORIZON_DAYS): Interval[] {
  const tz = hours.timezone || DEFAULT_TIMEZONE;
  const byDay = new Map<number, StoreHoursRange[]>();
  for (const day of hours.week ?? []) byDay.set(Number(day.weekday), day.ranges ?? []);

  const today = zonedParts(now, tz);
  const intervals: Interval[] = [];
  for (let k = -1; k <= horizonDays; k++) {
    // Calendar date k days from today (Date.UTC normalises overflow)
    const cal = new Date(Date.UTC(today.year, today.month - 1, today.day + k));
    const y = cal.getUTCFullYear();
    const m = cal.getUTCMonth() + 1;
    const d = cal.getUTCDate();
    for (const range of byDay.get(cal.getUTCDay()) ?? []) {
      const [oh, om] = minutesOf(range.opens);
      const [ch, cm] = minutesOf(range.closes);
      const start = zonedTime(y, m, d, oh, om, tz);
      let end = zonedTime(y, m, d, ch, cm, tz);
      if (end <= start) end = zonedTime(y, m, d + 1, ch, cm, tz);
      intervals.push([start, end]);
    }
  }
  intervals.sort((a, b) => a[0] - b[0]);

  let merged: Interval[] = [];
  for (const interval of intervals) {
    const last = merged[merged.length - 1];
    if (last && interval[0] <= last[1]) {
      if (interval[1] > last[1]) last[1] = interval[1];
      continue;
    }
    merged.push([interval[0], interval[1]]);
  }

  for (const closure of hours.closures_next_14_days ?? []) {
    const cs = Date.parse(closure.starts_at);
    const ce = Date.parse(closure.ends_at);
    if (!Number.isFinite(cs) || !Number.isFinite(ce)) continue;
    const cut: Interval[] = [];
    for (const [start, end] of merged) {
      if (ce <= start || cs >= end) {
        cut.push([start, end]);
        continue;
      }
      if (cs > start) cut.push([start, cs]);
      if (ce < end) cut.push([ce, end]);
    }
    merged = cut;
  }
  return merged;
}

/** Where the store stands at `now`. Hours off (or missing) → always open and accepting. */
export function storeStatus(hours: StoreHoursSetting | null | undefined, now: Date = new Date()): StoreStatus {
  if (!hours?.enabled) return ALWAYS_OPEN;

  const at = now.getTime();
  const cutoff = Math.max(0, Number(hours.last_order_minutes) || 0) * MINUTE;

  // No week to work with: trust the server's snapshot (it may be minutes old).
  if (!Array.isArray(hours.week)) {
    const closesAt = parseDate(hours.closes_at);
    const accepting = Boolean(hours.accepting_orders) && (!closesAt || at + cutoff <= closesAt.getTime());
    return {
      enabled: true,
      open: Boolean(hours.open_now),
      accepting,
      closesAt,
      nextOpenAt: parseDate(hours.next_open_at),
      closingSoon: accepting && !!closesAt && closesAt.getTime() - cutoff - at <= CLOSING_SOON_MINUTES * MINUTE,
    };
  }

  const intervals = openIntervals(hours, at);
  const current = intervals.find(([start, end]) => start <= at && at < end) ?? null;
  const accepting = Boolean(current) && at + cutoff <= current![1];
  let next = intervals.find(([start]) => start > at && (!current || start >= current[1]))?.[0] ?? null;
  if (next === null) {
    // Beyond what we can see (e.g. a long holiday): the server's own answer, if still ahead.
    const server = parseDate(hours.next_open_at);
    if (server && server.getTime() > at) next = server.getTime();
  }

  return {
    enabled: true,
    open: Boolean(current),
    accepting,
    closesAt: current ? new Date(current[1]) : null,
    nextOpenAt: next !== null ? new Date(next) : null,
    closingSoon: accepting && current![1] - cutoff - at <= CLOSING_SOON_MINUTES * MINUTE,
  };
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms) : null;
}

// ── Text ─────────────────────────────────────────────────────────────────────
// Same wording as the backend (resources/lang/{ar,en}/hours.php → storefront).

const DAYS: Record<HoursLang, string[]> = {
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "اليوم الساعة 17:00" / "غداً الساعة 17:00" / "يوم السبت 1/11 الساعة 10:00" (or English). */
export function formatOpening(moment: Date, now: Date, lang: HoursLang = "ar", timeZone: string = DEFAULT_TIMEZONE): string {
  const m = zonedParts(moment.getTime(), timeZone);
  const n = zonedParts(now.getTime(), timeZone);
  const time = `${pad(m.hour)}:${pad(m.minute)}`;
  const dayDiff = Math.round(
    (Date.UTC(m.year, m.month - 1, m.day) - Date.UTC(n.year, n.month - 1, n.day)) / DAY,
  );
  if (dayDiff === 0) return lang === "en" ? `today at ${time}` : `اليوم الساعة ${time}`;
  if (dayDiff === 1) return lang === "en" ? `tomorrow at ${time}` : `غداً الساعة ${time}`;
  const weekday = new Date(Date.UTC(m.year, m.month - 1, m.day)).getUTCDay();
  const date = `${m.day}/${m.month}`;
  return lang === "en"
    ? `on ${DAYS.en[weekday]} ${date} at ${time}`
    : `يوم ${DAYS.ar[weekday]} ${date} الساعة ${time}`;
}

/**
 * The closed notice: the owner's message (or "last orders" while still open) plus the next
 * opening. Empty when the store is accepting orders.
 */
export function closedText(
  hours: StoreHoursSetting | null | undefined,
  status: StoreStatus,
  now: Date = new Date(),
  lang: HoursLang = "ar",
): string {
  if (!status.enabled || status.accepting) return "";
  const minutes = Number(hours?.last_order_minutes) || 0;
  let text = status.open
    ? lang === "en"
      ? `We stopped taking orders ${minutes} minutes before closing.`
      : `توقفنا عن استقبال الطلبات قبل الإغلاق بـ ${minutes} دقيقة.`
    : hours?.message?.trim() || (lang === "en" ? "We are closed now." : "نحن مغلقون الآن.");
  if (status.nextOpenAt) {
    const when = formatOpening(status.nextOpenAt, now, lang, hours?.timezone || DEFAULT_TIMEZONE);
    text += lang === "en" ? ` We open ${when}.` : ` نفتح ${when}.`;
  }
  return text;
}
