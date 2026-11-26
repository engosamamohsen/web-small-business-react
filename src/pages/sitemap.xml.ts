import type { APIRoute } from "astro";
import { fetchHook } from "@/hooks/fetch-hook";
import { getSiteOrigin } from "@/lib/site-origin";
import { getCatalog } from "@/lib/booking/api";
import { sitemapApiTimeoutMs, sitemapResponse } from "@/lib/sitemap";

// Rendered on demand: the sitemap is per-tenant. Each storefront (a cashierthru address or the
// store's own domain) resolves its own store API via the middleware (Astro.locals.apiBase) and
// emits URLs on the address the visitor used — something the build-time @astrojs/sitemap
// integration can't do because the products live behind a per-tenant API.
//
// The middleware runs first: a suspended/closed store or a disconnected custom domain never reaches
// this route (store-unavailable / store-not-found pages).
//
// Complete, the last known-good copy (when confirmed safe), or 503; never partial (F1, docs/seo-merchant-data-plan.md): see src/lib/sitemap.ts.
export const prerender = false;

export const GET: APIRoute = async ({ locals, request, url }) => {
    const apiBase = locals.apiBase; // tenant-aware, set by src/middleware.ts
    const timeoutMs = sitemapApiTimeoutMs();

    return sitemapResponse({
        origin: getSiteOrigin(request, url),
        apiBase,
        fetcher: (path) => fetchHook({ url: path, init: {}, baseUrl: apiBase, timeoutMs }),
        // Booking stores (salons / services): the services list and each service page.
        loadServices: locals.booking?.enabled ? () => getCatalog(apiBase) : undefined,
        // The last known-good copy of this address, only when this request confirmed the store is open
        // and its custom domain (if any) is connected (src/middleware.ts, sitemapTrust).
        staleAllowed: locals.storeVerified === true && locals.domainVerified === true,
        // The store behind this address now: a copy built for another store is never served.
        storeKey: locals.storeKey ?? null,
    });
};
