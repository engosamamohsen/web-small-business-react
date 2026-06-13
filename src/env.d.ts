/// <reference path="../.astro/types.d.ts" />

declare namespace App {
    interface Locals {
        // Per-request admin API base URL derived from the request hostname.
        // Set by src/middleware.ts so every SSR page gets the right tenant.
        // Example: "https://admin-roka.cashierthru.com/api/"
        apiBase: string;
    }
}
