// ─── A shipping company's public site (CashierThru shipping ERP, phase 3) ────────────────────────
//
// A tenant with business_kind = shipping is not a store: its host shows a carrier site (home, /ship,
// /track) instead of a storefront. The data comes from the Laravel API under api/shipping/public
// (routes/shipping/public-api.php in the Laravel repo). Every text arrives in Arabic and English.

export type CarrierLang = "ar" | "en";

export type Bilingual = { ar: string; en: string };

export type CarrierGovernorate = { code: string; name_ar: string; name_en: string };

export type CarrierOption = { key: string; label_ar: string; label_en: string };

/** GET api/shipping/public/profile → data */
export interface CarrierProfile {
    kind: "shipping";
    name: string;
    /** Relative to the company's API host (/api/shipping/public/logo), or null. */
    logo_url: string | null;
    country: string;
    /** "+20" */
    phone_prefix: string;
    /** The country's mobiles in E.164 ("^\+201[0125][0-9]{8}$"); the form accepts only these. Null = any E.164 number. */
    mobile_pattern?: string | null;
    currency: string;
    governorates: CarrierGovernorate[];
    categories: CarrierOption[];
    payers: CarrierOption[];
    texts: {
        welcome_title: Bilingual;
        welcome_text: Bilingual;
        after_booking: Bilingual;
        booking_soon: Bilingual;
    };
    contact: { phone: string | null; whatsapp: string | null };
    booking_open: boolean;
    features: { estimate: boolean; tracking: boolean };
    altcha: boolean;
    /** Time trap for the booking form; only on a fresh profile, never on a cached one. */
    form_token?: string;
}

/** POST api/shipping/public/bookings → data (201 new, 200 a retry of the same request) */
export interface CarrierBooked {
    tracking_no: string;
    number: number;
    track_path: string;
    after_booking: Bilingual;
}

export type CarrierTimelineStep = { status: string; label: Bilingual; at: string };

/** GET api/shipping/public/track/{number} → data */
export interface CarrierTracking {
    tracking_no: string;
    status: string;
    status_label: Bilingual;
    from_governorate: Bilingual | null;
    to_governorate: Bilingual | null;
    expected_delivery_date: string | null;
    created_at: string;
    timeline: CarrierTimelineStep[];
    /** Only with the right last 4 phone digits. */
    details: {
        sender_first_name: string;
        recipient_first_name: string;
        cod_amount: string;
        currency: string;
    } | null;
    details_locked: boolean;
    /** The next digit check needs an ALTCHA proof of work (many wrong tries on this shipment). */
    details_captcha?: boolean;
    /** False when the digits weren't checked (locked, or a needed proof of work was missing): nothing was counted. */
    digits_checked?: boolean;
    /** Who the lock is for: this visitor, everyone (this shipment), or the site isn't configured. */
    lock_scope?: "visitor" | "shipment" | "unavailable" | null;
}

/** Error answers of the public API (error_code), plus what the site adds itself. */
export type CarrierErrorCode =
    | "validation"
    | "booking_closed"
    | "altcha_failed"
    | "daily_limit"
    | "too_many_requests"
    | "not_found"
    | "network"
    | "server";

export interface CarrierApiError {
    status: false;
    error_code: CarrierErrorCode;
    message?: string;
    errors?: Record<string, string[]>;
    retry_after?: number;
}
