// Price and duration of the chosen services — display only; the server decides the real total.

import type { BookingService } from "./types";
import { t } from "./strings";

/** What the customer pays for one service: the sale price when there is one. */
export function effectivePrice(service: Pick<BookingService, "price" | "sale_price">): number {
  const sale = service.sale_price;
  return sale !== null && sale !== undefined && sale > 0 && sale < service.price ? sale : service.price;
}

export interface BookingTotals {
  count: number;
  total: number;
  /** Total before sale prices (equals `total` when nothing is on sale). */
  totalBefore: number;
  minutes: number;
}

/** Totals of `ids` (unknown ids are ignored, each id counts once). */
export function bookingTotals(services: BookingService[], ids: number[]): BookingTotals {
  const byId = new Map(services.map((s) => [s.id, s]));
  const seen = new Set<number>();
  let total = 0;
  let totalBefore = 0;
  let minutes = 0;
  for (const id of ids) {
    const s = byId.get(id);
    if (!s || seen.has(id)) continue;
    seen.add(id);
    total += effectivePrice(s);
    totalBefore += Number(s.price) || 0;
    minutes += Number(s.duration_minutes) || 0;
  }
  return { count: seen.size, total: round2(total), totalBefore: round2(totalBefore), minutes };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** 150 → "150 جنيه", 99.5 → "99.50 جنيه". */
export function formatMoney(value: number): string {
  const n = Number(value) || 0;
  return `${n % 1 === 0 ? String(n) : n.toFixed(2)} ${t.currency}`;
}

/** 45 → "45 دقيقة", 60 → "ساعة", 90 → "ساعة و30 دقيقة", 120 → "ساعتين". */
export function formatDuration(totalMinutes: number): string {
  const m = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return t.minutes(rest);
  if (rest === 0) return t.hours(h);
  return `${t.hours(h)} ${t.and}${t.minutes(rest)}`;
}

/** Services grouped by category, in the API's category order; services without one go last. */
export function groupByCategory<C extends { id: number; name: string }>(
  categories: C[],
  services: BookingService[],
): { id: number | null; name: string; services: BookingService[] }[] {
  const known = new Set(categories.map((c) => c.id));
  const groups = categories
    .map((c) => ({ id: c.id as number | null, name: c.name, services: services.filter((s) => s.category_id === c.id) }))
    .filter((g) => g.services.length > 0);
  const other = services.filter((s) => s.category_id === null || !known.has(s.category_id));
  if (other.length) groups.push({ id: null, name: groups.length ? t.otherCategory : "", services: other });
  return groups;
}
