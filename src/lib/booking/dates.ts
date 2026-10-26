// Dates and times of the booking pages, always in the store's timezone (Africa/Cairo).
// Calendar days are counted in UTC arithmetic from Cairo's "today", so the visitor's own
// timezone never shifts a day. The week starts on Saturday (Egypt).

import { DEFAULT_TIMEZONE, zonedParts } from "@/lib/store-hours";
import { t } from "./strings";

export const BOOKING_TIMEZONE = DEFAULT_TIMEZONE;

/** Sunday = 0 … Saturday = 6 (JavaScript order). */
export const DAY_NAMES_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] as const;
/** Saturday-first order of the week, for labels and grouping. */
export const WEEK_SAT_FIRST = [6, 0, 1, 2, 3, 4, 5] as const;
export const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
] as const;

/** Upper bound of the strip whatever the store sets (keeps the page light). */
export const MAX_STRIP_DAYS = 90;
const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, "0");

/** Position of a weekday in a Saturday-first week: Saturday 0 … Friday 6. */
export function satFirstIndex(weekday: number): number {
  return (weekday + 1) % 7;
}

/** "YYYY-MM-DD" of `now` in the store's timezone. */
export function zonedToday(now: Date = new Date(), timeZone: string = BOOKING_TIMEZONE): string {
  const p = zonedParts(now.getTime(), timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export interface StripDay {
  /** "YYYY-MM-DD", what the API takes. */
  date: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** Day name, or "النهارده" / "بكرة". */
  label: string;
  dayName: string;
  day: number;
  month: string;
  /** A Saturday that is not the first day of the strip: a new week starts here. */
  weekStart: boolean;
  /** 0 for this week, 1 for the next Saturday-first week, … */
  week: number;
}

/**
 * Today … today + maxDaysAhead (inclusive) in the store's timezone, labelled in Arabic.
 * `maxDaysAhead` is clamped to 0…MAX_STRIP_DAYS.
 */
export function buildDateStrip(now: Date, maxDaysAhead: number, timeZone: string = BOOKING_TIMEZONE): StripDay[] {
  const p = zonedParts(now.getTime(), timeZone);
  const base = Date.UTC(p.year, p.month - 1, p.day);
  const span = Math.min(MAX_STRIP_DAYS, Math.max(0, Math.floor(Number(maxDaysAhead) || 0)));
  const firstOffset = satFirstIndex(new Date(base).getUTCDay());
  const days: StripDay[] = [];
  for (let i = 0; i <= span; i++) {
    const d = new Date(base + i * DAY_MS);
    const weekday = d.getUTCDay();
    const dayName = DAY_NAMES_AR[weekday];
    days.push({
      date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
      weekday,
      label: i === 0 ? t.today : i === 1 ? t.tomorrow : dayName,
      dayName,
      day: d.getUTCDate(),
      month: MONTH_NAMES_AR[d.getUTCMonth()],
      weekStart: i > 0 && weekday === 6,
      week: Math.floor((firstOffset + i) / 7),
    });
  }
  return days;
}

/** True for "YYYY-MM-DD". */
export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** "16:30" → "4:30 م", "09:00" → "9:00 ص", "12:15" → "12:15 م", "00:30" → "12:30 ص". */
export function formatTime12(hhmm: string): string {
  const [h, m] = String(hhmm).split(":").map((v) => parseInt(v, 10) || 0);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${h < 12 ? "ص" : "م"}`;
}

/** Time chips split into صباحاً (before 12:00) and مساءً, order kept. */
export function splitByPeriod(times: string[]): { morning: string[]; evening: string[] } {
  const morning: string[] = [];
  const evening: string[] = [];
  for (const time of times) {
    (parseInt(time, 10) < 12 ? morning : evening).push(time);
  }
  return { morning, evening };
}

/** "السبت 1 نوفمبر 2026، 4:30 م" for an ISO instant, in the store's timezone. */
export function formatAppointmentWhen(iso: string, timeZone: string = BOOKING_TIMEZONE): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const p = zonedParts(ms, timeZone);
  const weekday = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
  return `${DAY_NAMES_AR[weekday]} ${p.day} ${MONTH_NAMES_AR[p.month - 1]} ${p.year}، ${formatTime12(`${pad(p.hour)}:${pad(p.minute)}`)}`;
}

/** "4:30 م" — the wall time of an ISO instant in the store's timezone. */
export function formatClock(iso: string, timeZone: string = BOOKING_TIMEZONE): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const p = zonedParts(ms, timeZone);
  return formatTime12(`${pad(p.hour)}:${pad(p.minute)}`);
}
