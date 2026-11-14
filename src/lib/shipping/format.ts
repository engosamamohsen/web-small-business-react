// Dates and money on the carrier site, in the company's own time zone (Egypt first).

import type { CarrierLang } from "./types";

const TIME_ZONES: Record<string, string> = { EG: "Africa/Cairo", SA: "Asia/Riyadh", AE: "Asia/Dubai", KW: "Asia/Kuwait", JO: "Asia/Amman" };

export function countryTimeZone(country: string | null | undefined): string {
    return TIME_ZONES[String(country ?? "").toUpperCase()] ?? "Africa/Cairo";
}

const locale = (lang: CarrierLang) => (lang === "ar" ? "ar-EG" : "en-GB");

/** "8 Nov 2026, 14:05" / "٨ نوفمبر ٢٠٢٦، ٢:٠٥ م"; "" when the value isn't a date. */
export function formatDateTime(iso: string | null | undefined, lang: CarrierLang, timeZone: string): string {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale(lang), { dateStyle: "medium", timeStyle: "short", timeZone }).format(d);
}

/** A calendar day (yyyy-mm-dd) as a date without a time; no time-zone shift. */
export function formatDay(day: string | null | undefined, lang: CarrierLang): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day ?? ""));
    if (!m) return "";
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
    return new Intl.DateTimeFormat(locale(lang), { dateStyle: "medium", timeZone: "UTC" }).format(d);
}

/** "850.50 EGP" / "٨٥٠٫٥٠ ج.م.‏"; falls back to the plain amount and code. */
export function formatMoney(amount: string | number, currency: string, lang: CarrierLang): string {
    const n = Number(amount);
    if (!Number.isFinite(n)) return `${amount} ${currency}`;
    try {
        return new Intl.NumberFormat(locale(lang), { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
    } catch {
        return `${n.toFixed(2)} ${currency}`;
    }
}
