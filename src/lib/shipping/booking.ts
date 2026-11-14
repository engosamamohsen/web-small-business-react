// ─── The /ship booking form: input rules (shipping company public site, phase 3) ────────────────
//
// Mirrors the Laravel rules (ShipmentFieldRules + PublicBookingRequest), so a visitor sees each
// mistake next to its field before anything is sent. Laravel still checks everything again.
// - Arabic and Persian digits are read as Western digits.
// - Phones become E.164 for the company's country: 01001234567, 1001234567, 00201001234567 and
//   +20 100 123 4567 are the same number.
// - Amounts accept one decimal comma ("80,5" = 80.5); "1,500" stays wrong instead of being guessed.

import { z } from "zod";
import type { CarrierStrings } from "./strings";

const DIGITS: Record<string, string> = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٫": ".", "٬": ",",
};

export function westernDigits(value: string): string {
    return value.replace(/[٠-٩۰-۹٫٬]/g, (ch) => DIGITS[ch] ?? ch);
}

/** E.164 for the company's dialling code ("+20"); input that can't be mapped comes back cleaned. */
export function toE164(value: string, phonePrefix: string): string {
    let digits = westernDigits(value).replace(/[\s\-().]/g, "");
    const code = phonePrefix.replace(/^\+/, "");
    if (digits.startsWith("00")) digits = "+" + digits.slice(2);
    if (digits.startsWith("+")) {
        if (code && digits.startsWith("+" + code + "0")) digits = "+" + code + digits.slice(code.length + 2);
        return digits;
    }
    if (!/^[0-9]+$/.test(digits) || !code) return digits;
    if (digits.startsWith(code) && digits.length >= code.length + 9) return "+" + digits;
    return "+" + code + digits.replace(/^0+/, "");
}

export const E164 = /^\+[1-9][0-9]{7,14}$/;

/** A pattern from the profile; a broken one falls back to any E.164 number (Laravel still checks). */
export function mobileRegex(pattern?: string | null): RegExp | null {
    if (!pattern) return null;
    try {
        return new RegExp(pattern);
    } catch {
        return null;
    }
}

/** Any E.164 number, or only the company country's mobiles when the profile sends mobile_pattern (owner, 2026-11-09). */
export function isPhone(value: string, phonePrefix: string, mobilePattern?: string | null): boolean {
    const e164 = toE164(value, phonePrefix);
    if (!E164.test(e164)) return false;
    const mobile = mobileRegex(mobilePattern);
    return mobile ? mobile.test(e164) : true;
}

/** "80,5" → "80.5"; Arabic digits to Western; ambiguous commas are kept so the check refuses them. */
export function toDecimal(value: string): string {
    const v = westernDigits(value).trim();
    return /^-?[0-9]+,[0-9]{1,2}$/.test(v) ? v.replace(",", ".") : v;
}

function isNumberIn(value: string, min: number, max: number): boolean {
    const v = toDecimal(value);
    // At most 2 decimals, like Laravel (ShipmentFieldRules::AMOUNT_RULE): "10.555" is refused, not rounded
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(v)) return false;
    const n = Number(v);
    return Number.isFinite(n) && n >= min && n <= max;
}

/** yyyy-mm-dd of a date in the visitor's own time zone. */
export function isoDay(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function dateBounds(now: Date = new Date()): { min: string; max: string } {
    const max = new Date(now);
    max.setDate(max.getDate() + 90);
    return { min: isoDay(now), max: isoDay(max) };
}

export const SENDER_FIELDS = ["sender_name", "sender_phone", "sender_governorate", "sender_area", "sender_address", "sender_notes"] as const;
export const RECIPIENT_FIELDS = [
    "recipient_name", "recipient_phone", "recipient_phone2", "recipient_governorate", "recipient_area", "recipient_address", "recipient_notes",
] as const;
export const PARCEL_FIELDS = [
    "category", "description", "packages_count", "weight_kg", "length_cm", "width_cm", "height_cm", "declared_value",
    "special_handling", "cod_amount", "who_pays_shipping", "preferred_delivery_date", "notes",
] as const;

export type BookingField = (typeof SENDER_FIELDS)[number] | (typeof RECIPIENT_FIELDS)[number] | (typeof PARCEL_FIELDS)[number];
export type BookingValues = Record<BookingField, string>;

export const STEPS = [SENDER_FIELDS, RECIPIENT_FIELDS, PARCEL_FIELDS] as const;

/** The step a field belongs to (0 sender, 1 recipient, 2 parcel), for errors that come back from the server. */
export function stepOfField(field: string): number | null {
    const i = STEPS.findIndex((fields) => (fields as readonly string[]).includes(field));
    return i === -1 ? null : i;
}

export function emptyBooking(): BookingValues {
    const values = {} as BookingValues;
    for (const fields of STEPS) for (const f of fields) values[f] = "";
    values.packages_count = "1";
    return values;
}

export interface SchemaContext {
    phonePrefix: string;
    /** CarrierProfile.mobile_pattern */
    mobilePattern?: string | null;
    governorates: string[];
    categories: string[];
    payers: string[];
    now?: Date;
}

/** One schema for the whole form; each step validates its own fields with react-hook-form's trigger(). */
export function bookingSchema(t: CarrierStrings, ctx: SchemaContext) {
    const text = (max: number, required = false) => {
        let s = z.string().trim();
        if (required) s = s.min(1, t.errRequired);
        return s.max(max, t.errTooLong(max));
    };
    const phone = (required: boolean) =>
        z.string().trim().refine((v) => (required ? v !== "" : true), t.errRequired)
            .refine((v) => v === "" || isPhone(v, ctx.phonePrefix, ctx.mobilePattern), t.errPhone);
    const oneOf = (list: string[], message: string) =>
        z.string().refine((v) => v !== "", t.errRequired).refine((v) => v === "" || list.includes(v), message);
    const decimal = (min: number, max: number) =>
        z.string().trim().refine((v) => v === "" || isNumberIn(v, min, max), t.errNumber);
    const { min, max } = dateBounds(ctx.now);

    return z
        .object({
            sender_name: text(120, true),
            sender_phone: phone(true),
            sender_governorate: oneOf(ctx.governorates, t.errGovernorate),
            sender_area: text(120),
            sender_address: text(500, true),
            sender_notes: text(500),

            recipient_name: text(120, true),
            recipient_phone: phone(true),
            recipient_phone2: phone(false),
            recipient_governorate: oneOf(ctx.governorates, t.errGovernorate),
            recipient_area: text(120),
            recipient_address: text(500, true),
            recipient_notes: text(500),

            category: oneOf(ctx.categories, t.errRequired),
            description: text(500),
            packages_count: z.string().trim().refine((v) => /^[0-9]{1,3}$/.test(westernDigits(v)) && Number(westernDigits(v)) >= 1, t.errPackages),
            weight_kg: decimal(0.01, 99999),
            length_cm: decimal(0.1, 9999),
            width_cm: decimal(0.1, 9999),
            height_cm: decimal(0.1, 9999),
            declared_value: decimal(0, 9999999),
            special_handling: text(255),
            cod_amount: decimal(0, 9999999),
            who_pays_shipping: oneOf(ctx.payers, t.errRequired),
            preferred_delivery_date: z.string().refine((v) => v === "" || v >= min, t.errDatePast).refine((v) => v === "" || v <= max, t.errDateFar),
            notes: text(1000),
        })
        .superRefine((v, ctx2) => {
            // Shipping taken from the COD needs a COD amount
            if (v.who_pays_shipping === "cod" && !(Number(toDecimal(v.cod_amount || "0")) > 0)) {
                ctx2.addIssue({ code: z.ZodIssueCode.custom, path: ["cod_amount"], message: t.errCodRequired });
            }
        });
}

/** What is posted to Laravel: digits made Western, empty optional fields left out. */
export function bookingPayload(values: BookingValues, phonePrefix: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, raw] of Object.entries(values)) {
        const v = (raw ?? "").trim();
        if (v === "") continue;
        if (key.endsWith("_phone") || key === "recipient_phone2") out[key] = toE164(v, phonePrefix);
        else if (["weight_kg", "length_cm", "width_cm", "height_cm", "declared_value", "cod_amount"].includes(key)) out[key] = toDecimal(v);
        else if (key === "packages_count") out[key] = westernDigits(v);
        else out[key] = v;
    }
    return out;
}

/** A tracking number as Laravel accepts it: 6–32 letters, digits or dashes; null when it can't be one. */
export function normalizeTrackingNo(value: string | null | undefined): string | null {
    const v = westernDigits(String(value ?? "")).trim().toUpperCase();
    return /^[A-Z0-9-]{6,32}$/.test(v) ? v : null;
}

/** A key for one booking attempt, so a double tap or a lost connection never makes two requests. */
export function newIdempotencyKey(): string {
    const c = globalThis.crypto;
    if (c?.randomUUID) return c.randomUUID();
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** wa.me link with a ready message (no API, free). */
export function whatsappShareUrl(text: string, phone?: string | null): string {
    const digits = (phone ?? "").replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
