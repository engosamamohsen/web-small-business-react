import { defineMiddleware } from "astro:middleware";
import { fetchSettings } from "@/hooks/fetchSettings";
import { isStoreExpired } from "@/lib/subscription";

// Lockout screen shown when the tenant's subscription has expired.
const STORE_UNAVAILABLE_PATH = "/store-unavailable";

// Derive the tenant's admin API origin from the incoming request.
// Reading order for the hostname (highest priority first):
//   1. X-Forwarded-Host header  — set by Nginx when using proxy_set_header X-Forwarded-Host $host
//   2. Host request header      — set by Nginx when using proxy_set_header Host $host
//   3. context.url.hostname     — Astro derives this from the Host header; same as (2)
//
// In production behind Nginx the hostname MUST come from one of the above headers.
// If none contain the real tenant hostname (e.g. Nginx is not configured to forward
// the host), the fallback is PUBLIC_BASE_URL so at least one tenant still works.
//
//   roka.cashierthru.com  →  https://admin-roka.cashierthru.com/api/
//   asly.cashierthru.com  →  https://admin-asly.cashierthru.com/api/
//   localhost (dev only)  →  PUBLIC_DEV_API_ORIGIN/api/

function extractHostname(request: Request, urlHostname: string): string {
    // x-forwarded-host is the most explicit — set by the proxy for the original host
    const forwarded = request.headers.get("x-forwarded-host");
    if (forwarded) return forwarded.split(",")[0].trim().split(":")[0];

    // Host header — what Nginx sends to the upstream; Astro exposes this as
    // context.url.hostname so we just use that (same value, no double-parsing)
    return urlHostname;
}

function extractProtocol(request: Request, urlProtocol: string): string {
    const forwarded = request.headers.get("x-forwarded-proto");
    if (forwarded) return forwarded.split(",")[0].trim();
    return urlProtocol.replace(":", "");
}

function deriveAdminOrigin(hostname: string, protocol: string): string {
    const parts = hostname.split(".");

    // Production tenant: roka.cashierthru.com  →  admin-roka.cashierthru.com
    if (parts.length >= 3 && !parts[0].startsWith("admin-")) {
        const adminParts = [...parts];
        adminParts[0] = `admin-${parts[0]}`;
        return `${protocol}://${adminParts.join(".")}`;
    }

    // Local dev server (npm run dev)
    if (import.meta.env.DEV) {
        return (
            import.meta.env.PUBLIC_DEV_API_ORIGIN ||
            "https://admin-asly.cashierthru.com"
        );
    }

    // Production but hostname is localhost / IP — Nginx is not forwarding the
    // tenant host. Fall back to PUBLIC_BASE_URL so at least the configured
    // default tenant works; operators should add proxy_set_header X-Forwarded-Host $host;
    // to their Nginx config to support multiple tenants from one server.
    // NOTE: the @astrojs/node adapter does NOT derive the hostname from the plain
    // `Host` header (context.url.hostname stays "localhost"), so X-Forwarded-Host
    // is the header that actually resolves the tenant — see extractHostname above.
    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.")
    ) {
        const fallback =
            import.meta.env.PUBLIC_BASE_URL || "http://localhost:3000";
        // Loud warning: this means EVERY tenant gets the same fallback API.
        // The cure is `proxy_set_header X-Forwarded-Host $host;` in Nginx
        // (the Node adapter ignores the plain Host header), not editing .env.
        console.warn(
            `[middleware] No tenant host header (saw "${hostname}") — serving ` +
            `fallback PUBLIC_BASE_URL=${fallback} for ALL tenants. Add ` +
            `'proxy_set_header X-Forwarded-Host $host;' to Nginx (the Node adapter ignores ` +
            `the plain Host header) so each subdomain resolves dynamically.`,
        );
        return fallback;
    }

    // Unexpected shape — return as-is rather than silently using the wrong tenant
    return `${protocol}://${hostname}`;
}

export const onRequest = defineMiddleware(async (context, next) => {
    const hostname = extractHostname(context.request, context.url.hostname);
    const protocol = extractProtocol(context.request, context.url.protocol);
    const adminOrigin = deriveAdminOrigin(hostname, protocol);
    const apiBase = `${adminOrigin}/api/`;
    context.locals.apiBase = apiBase;

    // ── Expired-subscription store lockout ───────────────────────────────────
    // Every storefront route is SSR, so this single check guards the whole site
    // (homepage, product/category pages, cart, …). When the plan is expired we
    // rewrite to the lockout screen — no redirect, the URL is preserved and the
    // target page's own data fetches never run.
    //
    // Guards:
    //   • only GET navigations (forms/asset requests are left alone)
    //   • skip the lockout page itself — rewrite re-runs middleware, so checking
    //     it again would loop
    //   • fetchSettings fails OPEN (network/API error → store stays available)
    const isGet = context.request.method === "GET";
    const isLockoutPage = context.url.pathname === STORE_UNAVAILABLE_PATH;
    if (isGet && !isLockoutPage) {
        try {
            const token = context.cookies.get("app_token")?.value;
            const settings = await fetchSettings(token, false, apiBase);
            if (isStoreExpired(settings.current_subscription_plan)) {
                return context.rewrite(STORE_UNAVAILABLE_PATH);
            }
        } catch {
            // fail open — never lock out a store because the settings call hiccuped
        }
    }

    return next();
});
