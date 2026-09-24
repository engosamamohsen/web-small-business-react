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
    }
}
