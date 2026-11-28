// ─── Store policies from the store API (S1, docs/seo-merchant-data-plan.md, 2026-11-26) ───────────────────
//
// The backend (App\Support\Storefront\StorePolicies) builds the shipping policy ONCE: the texts the product page
// shows under «سياسة الشحن» and the Product JSON-LD `offers.shippingDetails`. The storefront only checks the shape
// and renders it, so the page and Google can never disagree. Older store APIs send no `shipping`: the page keeps its
// previous text and no shippingDetails is added (nothing is invented here).

export interface ShippingTexts {
    coverage: string;
    prep: string;
    transit: string;
    fees: string;
}

export interface ShippingPolicy {
    kind?: "food" | "online";
    coverage?: "areas" | "egypt";
    google: Record<string, unknown> | null;
    google_reason?: string | null;
    texts?: { ar?: ShippingTexts; en?: ShippingTexts };
}

const TEXT_KEYS: Array<keyof ShippingTexts> = ["coverage", "prep", "transit", "fees"];

/** The shipping policy from the setting-profile response, or null when absent or malformed. */
export function shippingPolicyFrom(raw: unknown): ShippingPolicy | null {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const google = r.google && typeof r.google === "object" ? (r.google as Record<string, unknown>) : null;
    const texts = r.texts && typeof r.texts === "object" ? (r.texts as ShippingPolicy["texts"]) : undefined;
    return {
        kind: r.kind === "food" || r.kind === "online" ? r.kind : undefined,
        coverage: r.coverage === "egypt" ? "egypt" : r.coverage === "areas" ? "areas" : undefined,
        google,
        google_reason: typeof r.google_reason === "string" ? r.google_reason : null,
        texts,
    };
}

/** The four policy lines in this language (Arabic when English is missing), or null to keep the old text. */
export function shippingTexts(policy: ShippingPolicy | null | undefined, lang: "ar" | "en" = "ar"): ShippingTexts | null {
    const set = policy?.texts?.[lang] ?? policy?.texts?.ar;
    if (!set) return null;
    return TEXT_KEYS.every((k) => typeof set[k] === "string" && set[k].trim() !== "") ? set : null;
}

const isWholeNonNegative = (v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= 0;

function validTime(t: unknown): boolean {
    if (!t || typeof t !== "object") return false;
    const q = t as Record<string, unknown>;
    return isWholeNonNegative(q.minValue) && isWholeNonNegative(q.maxValue) && (q.minValue as number) <= (q.maxValue as number) && q.unitCode === "DAY";
}

/**
 * Google's OfferShippingDetails exactly as the backend built it, but only when every required part is there and
 * valid (Google: shippingRate with value XOR maxValue + currency, shippingDestination.addressCountry, deliveryTime
 * with handling/transit in whole days). Anything else → undefined, so nothing incomplete reaches Google.
 */
export function productShippingDetails(policy: ShippingPolicy | null | undefined): Record<string, unknown> | undefined {
    const g = policy?.google;
    if (!g || g["@type"] !== "OfferShippingDetails") return undefined;

    const rate = g.shippingRate as Record<string, unknown> | undefined;
    const hasValue = typeof rate?.value === "number" && (rate.value as number) >= 0;
    const hasMax = typeof rate?.maxValue === "number" && (rate.maxValue as number) >= 0;
    if (!rate || hasValue === hasMax || rate.currency !== "EGP") return undefined;

    const dest = g.shippingDestination as Record<string, unknown> | undefined;
    if (!dest || dest.addressCountry !== "EG" || "addressRegion" in dest || "postalCode" in dest) return undefined;

    const time = g.deliveryTime as Record<string, unknown> | undefined;
    if (!time || !validTime(time.handlingTime) || !validTime(time.transitTime)) return undefined;

    return g;
}
