import { defineMiddleware } from "astro:middleware";

// Derive the tenant's admin API origin from the incoming request's hostname.
// This runs server-side for every SSR request so each tenant gets the right
// base URL regardless of which PUBLIC_BASE_URL value was baked in at build time.
//
//   roka.cashierthru.com  →  https://admin-roka.cashierthru.com/api/
//   asly.cashierthru.com  →  https://admin-asly.cashierthru.com/api/
//   localhost             →  PUBLIC_DEV_API_ORIGIN/api/  (dev fallback)

const DEV_API_ORIGIN =
    import.meta.env.PUBLIC_DEV_API_ORIGIN ||
    "https://admin-asly.cashierthru.com";

function deriveAdminOrigin(url: URL): string {
    const { hostname, protocol } = url;
    const parts = hostname.split(".");

    // Production tenant: shop.cashierthru.com  →  admin-shop.cashierthru.com
    if (parts.length >= 3 && !parts[0].startsWith("admin-")) {
        const adminParts = [...parts];
        adminParts[0] = `admin-${parts[0]}`;
        return `${protocol}//${adminParts.join(".")}`;
    }

    // Local dev or SSR fallback
    if (
        import.meta.env.DEV ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.")
    ) {
        return DEV_API_ORIGIN;
    }

    // Unexpected shape — return origin unchanged (will likely fail the API call,
    // but won't accidentally serve another tenant's data)
    return url.origin;
}

export const onRequest = defineMiddleware((context, next) => {
    const adminOrigin = deriveAdminOrigin(context.url);
    context.locals.apiBase = `${adminOrigin}/api/`;
    return next();
});
