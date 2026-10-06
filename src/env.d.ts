/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        // Per-request admin API base URL derived from the request hostname.
        // Set by src/middleware.ts so every SSR page gets the right tenant.
        // Example: "https://admin-roka.cashierthru.com/api/"
        apiBase: string;
        // Tracking services from the dashboard (setting-profile `tracking`), and
        // whether ?ct_debug=1 asked for the test panel. Rendered by Tracking.astro.
        tracking?: import("@/lib/tracking/providers").TrackingItem[];
        trackingDebug?: boolean;
        // Website theme to draw (src/themes/registry.ts), and whether it is the
        // owner's preview from the dashboard rather than the saved theme.
        theme: import("@/themes/registry").ThemeKey;
        themePreview?: boolean;
        // Store mode from the plan (setting-profile features.full_ecommerce → "premium"),
        // the store's "Continue with Google / Facebook" options, and whether online payment is on.
        plan: import("@/lib/store-config").StorePlan;
        socialLogin?: import("@/hooks/fetchSettings").SocialLoginOption[];
        onlinePayment?: boolean;
        // Kind of store (setting-profile data.shop_type); the meal helper is for food stores only.
        shopType?: string | null;
        // The store's own colours (Classic theme), printed on <html> so the first paint already has them.
        storeColors?: { font?: string | null; background?: string | null };
    }
}
