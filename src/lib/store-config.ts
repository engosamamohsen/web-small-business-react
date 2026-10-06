// ─── Store plan configuration ─────────────────────────────────────────────────
//
// Central feature-flag layer for the subscription modes
// (see docs/subscription-modes-task.md and docs/full-ecommerce-plan.md).
//
// The mode now comes from the store's plan: setting-profile `features.full_ecommerce`
// (super admin → Plans → "Full e-commerce storefront") turns on "premium", the full
// e-commerce mode: customer accounts, Google/Facebook login, saved addresses, the API cart
// and checkout, order history with status and cancelling an order. Every other store stays
// "basic" (local cart + WhatsApp ordering), exactly as before.
//
// One server renders every store, so the mode is resolved per request:
//   • server: src/middleware.ts runs the request inside planContext (AsyncLocalStorage),
//   • browser: Layout.astro prints window.__CT_PLAN__ before any island hydrates.
// Consumers keep reading the capability flags below, never the raw plan.

export type StorePlan = "premium" | "basic";

const DEFAULT_PLAN: StorePlan = "basic";

/** Server-side holder, registered by src/middleware.ts (node:async_hooks stays out of the client bundle). */
type PlanStore = { getStore(): StorePlan | undefined };

/** Cookie the middleware sets with the store mode (read in the browser on every page). */
export const PLAN_COOKIE = "ct_plan";

export function currentPlan(): StorePlan {
    if (typeof window !== "undefined") {
        const fromPage = (window as unknown as { __CT_PLAN__?: StorePlan }).__CT_PLAN__;
        if (fromPage) return fromPage === "premium" ? "premium" : DEFAULT_PLAN;
        const fromCookie = document.cookie.match(/(?:^|; )ct_plan=([^;]*)/)?.[1];
        return fromCookie === "premium" ? "premium" : DEFAULT_PLAN;
    }
    const store = (globalThis as unknown as { __ctPlanStore?: PlanStore }).__ctPlanStore;
    return store?.getStore() ?? DEFAULT_PLAN;
}

/** The mode for a setting-profile response: premium when the plan has full e-commerce. */
export function planFromSettings(settings: { features?: { full_ecommerce?: boolean } } | null | undefined): StorePlan {
    return settings?.features?.full_ecommerce ? "premium" : "basic";
}

export const storeConfig = {
    get plan(): StorePlan {
        return currentPlan();
    },
    get isPremium(): boolean {
        return currentPlan() === "premium";
    },
    get isBasic(): boolean {
        return currentPlan() === "basic";
    },

    // ── Capability flags — consumers read these, not the plan ────────────────
    /** Login / registration / profile / orders / addresses exist at all. */
    get canAuthenticate(): boolean {
        return currentPlan() === "premium";
    },
    /** Cart lives in localStorage instead of the basket API. */
    get usesLocalCart(): boolean {
        return currentPlan() === "basic";
    },
    /** "api" → address/payment checkout flow; "whatsapp" → wa.me order. */
    get checkoutMode(): "api" | "whatsapp" {
        return currentPlan() === "premium" ? "api" : "whatsapp";
    },

    // ── WhatsApp ordering ─────────────────────────────────────────────────────
    /** Last-resort fallback ONLY — the real number comes from the
     *  setting-profile API (settings.whatsapp_phone). */
    fallbackWhatsappNumber: "201234567890",
    /** Country code used to normalize local numbers ("01…" → "201…"). */
    whatsappCountryCode: "20",
};
