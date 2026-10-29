// ─── Is this store still there? ──────────────────────────────────────────────
//
// A deleted (or never created) store's host must not show a storefront. The
// Laravel tenant API answers an unknown store with
//   404 {"status": false, "message": "المتجر غير موجود.", "data": null}
// (App\Exceptions\Handler → TenantCouldNotBeIdentifiedOnDomainException). Only that
// answer means "gone". A timeout, a network error, a 5xx, or a 404 that isn't the
// API's JSON (a proxy's HTML page during a deploy) is a temporary failure: the store
// stays open, as before, so a blip never takes a real store offline.
//
// src/middleware.ts rewrites every page of a gone store to /store-unavailable with
// HTTP 404 + noindex, and the per-host caches are dropped (forgetTenant) so nothing
// cached for that host is served again.

/** Statuses (and body type) that mean the store doesn't exist. */
export function isStoreGoneResponse(status: number, contentType?: string | null): boolean {
    if (status === 410) return true;
    return status === 404 && /\bjson\b/i.test(contentType ?? "");
}

export type StoreAccess = "open" | "missing" | "expired";

/**
 * What the middleware does with a request, from the settings call's outcome.
 *   missing → the store-unavailable page with 404 (only on the API's own "not found",
 *             and never on the PUBLIC_BASE_URL fallback, where the tenant is unknown).
 *   expired → the store-unavailable page (subscription lockout, unchanged).
 *   open    → the storefront, including when the settings call failed temporarily.
 */
export function decideStoreAccess(input: {
    ok: boolean;
    notFound?: boolean;
    tenantUnknown?: boolean;
    expired?: boolean;
}): StoreAccess {
    if (!input.ok) return input.notFound && !input.tenantUnknown ? "missing" : "open";
    return input.expired ? "expired" : "open";
}

/** HTTP status for the store-unavailable page. */
export function storeUnavailableStatus(missing: boolean): number {
    return missing ? 404 : 200;
}

// ── Per-host caches ──────────────────────────────────────────────────────────
// Server-side caches keyed by the tenant's apiBase register here, so a store that
// turns out to be gone is forgotten everywhere at once.
const forgetters = new Set<(apiBase: string) => void>();

export function onTenantForgotten(forget: (apiBase: string) => void): () => void {
    forgetters.add(forget);
    return () => forgetters.delete(forget);
}

export function forgetTenant(apiBase: string): void {
    for (const forget of forgetters) {
        try {
            forget(apiBase);
        } catch {
            // one cache failing to clear must not stop the others
        }
    }
}
