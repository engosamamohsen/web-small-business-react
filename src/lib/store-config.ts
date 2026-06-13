// ─── Store plan configuration ─────────────────────────────────────────────────
//
// Central feature-flag layer for the subscription modes
// (see docs/subscription-modes-task.md).
//
// STATIC for now — to switch plans, change CURRENT_PLAN below and rebuild.
// Designed so it can later be hydrated from an API (GET /store-config or a
// `plan` field on v1/setting-profile) without touching any consumer: they all
// read the derived capability flags, never the raw plan.

export type StorePlan = "premium" | "basic";

const CURRENT_PLAN: StorePlan = "basic";

export const storeConfig = {
    plan: CURRENT_PLAN,
    isPremium: CURRENT_PLAN === ("premium" as StorePlan),
    isBasic: CURRENT_PLAN === ("basic" as StorePlan),

    // ── Capability flags — consumers read these, not the plan ────────────────
    /** Login / registration / profile / orders / addresses exist at all. */
    canAuthenticate: CURRENT_PLAN === ("premium" as StorePlan),
    /** Cart lives in localStorage instead of the basket API. */
    usesLocalCart: CURRENT_PLAN === ("basic" as StorePlan),
    /** "api" → address/payment checkout flow; "whatsapp" → wa.me order. */
    checkoutMode: (CURRENT_PLAN === ("premium" as StorePlan)
        ? "api"
        : "whatsapp") as "api" | "whatsapp",

    // ── WhatsApp ordering ─────────────────────────────────────────────────────
    /** Last-resort fallback ONLY — the real number comes from the
     *  setting-profile API (settings.whatsapp_phone). */
    fallbackWhatsappNumber: "201234567890",
    /** Country code used to normalize local numbers ("01…" → "201…"). */
    whatsappCountryCode: "20",
} as const;
