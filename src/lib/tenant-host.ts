// ─── Which store does a host belong to? ───────────────────────────────────────
//
// Two kinds of store address reach the storefront:
//
//   platform  emand.cashierthru.com   → the store's API is admin-emand.cashierthru.com/api/
//   custom    emandbuild.com          → a domain the merchant connected in the panel
//             www.emandbuild.com        (Settings → Custom domain). The store's API is the
//                                       same host: https://emandbuild.com/api/ — the backend's
//                                       tenant API finds the store by its connected domain
//                                       (InitializeTenancyByDomainOrSubdomain; the root and the
//                                       www name are both saved for a root domain).
//
// A custom host is only used once the backend says it is connected:
// GET {central}/api/v1/custom-domains/allowed?domain=<host> → 200 connected, 404 not.
// An unknown domain pointed at our server therefore shows "store not found" (404) instead of
// some other store's site.

export const DEFAULT_PLATFORM_DOMAINS = ["cashierthru.com"];
export const DEFAULT_CENTRAL_ORIGIN = "https://cashierthru.com";

export type HostKind =
    | { kind: "platform"; host: string }
    | { kind: "custom"; host: string }
    | { kind: "local"; host: string }
    | { kind: "invalid"; host: string };

/** "WWW.EmandBuild.com:443." → "www.emandbuild.com" (lowercase, no port, no trailing dot). */
export function normalizeHost(raw: string | null | undefined): string {
    let host = String(raw ?? "").split(",")[0].trim().toLowerCase();
    host = host.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/[/?#].*$/, "");
    if (host.startsWith("[")) return host; // IPv6 literal: left as is (classified "local")
    return host.replace(/:\d+$/, "").replace(/\.+$/, "");
}

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const LABEL = "(?!-)[a-z0-9-]{1,63}(?<!-)";
const DOMAIN = new RegExp(`^(${LABEL}\\.)+[a-z][a-z0-9-]{1,62}$`);

/** The platform domains from PUBLIC_PLATFORM_DOMAINS ("cashierthru.com,staging.example"), else cashierthru.com. */
export function platformDomains(value?: string | null): string[] {
    const list = String(value ?? "")
        .split(",")
        .map((d) => normalizeHost(d))
        .filter(Boolean);
    return list.length ? list : DEFAULT_PLATFORM_DOMAINS;
}

/**
 * platform: the platform domain itself or any name under it (unchanged behaviour)
 * local:    localhost, *.localhost, IP addresses (dev, or a proxy that drops the host)
 * custom:   any other valid domain name
 * invalid:  anything else (empty, junk)
 */
export function classifyHost(rawHost: string | null | undefined, platforms: string[] = DEFAULT_PLATFORM_DOMAINS): HostKind {
    const host = normalizeHost(rawHost);
    if (!host) return { kind: "invalid", host };
    if (host === "localhost" || host.endsWith(".localhost") || IPV4.test(host) || host.startsWith("[")) {
        return { kind: "local", host };
    }
    if (platforms.some((p) => host === p || host.endsWith(`.${p}`))) return { kind: "platform", host };
    if (host.length <= 253 && DOMAIN.test(host)) return { kind: "custom", host };
    return { kind: "invalid", host };
}

/** A connected custom domain's API: the same host (the backend finds the store by domain). */
export function customDomainApiOrigin(host: string, protocol = "https"): string {
    return `${protocol}://${host}`;
}

// ── API origin for a request host (src/middleware.ts) ─────────────────────────

export interface DeriveEnv {
    dev: boolean;
    platforms?: string[];
    devOrigin: (hostname: string) => string;
    baseUrl?: string;
    warn?: (message: string) => void;
}

/**
 * The store API origin for a request host.
 *
 *   emandbuild.com / www.emandbuild.com → https://<same host>          custom: true
 *   roka.cashierthru.com                → https://admin-roka.cashierthru.com
 *   *.localhost, npm run dev            → devOrigin(host)
 *   localhost / IP (proxy dropped host) → PUBLIC_BASE_URL               fallback: true
 *
 * Every rule except the first is the storefront's behaviour before custom domains (unchanged).
 */
export function deriveApiOrigin(
    hostname: string,
    protocol: string,
    env: DeriveEnv,
): { origin: string; fallback: boolean; custom?: boolean } {
    const parts = hostname.split(".");

    // A merchant's own domain. Checked first: before this, "www.emandbuild.com" became
    // "admin-www.emandbuild.com" (the store subdomain rule below).
    if (!env.dev && classifyHost(hostname, env.platforms).kind === "custom") {
        return { origin: customDomainApiOrigin(normalizeHost(hostname), protocol), fallback: false, custom: true };
    }

    // Production tenant: roka.cashierthru.com  →  admin-roka.cashierthru.com
    if (parts.length >= 3 && !parts[0].startsWith("admin-")) {
        const adminParts = [...parts];
        adminParts[0] = `admin-${parts[0]}`;
        return { origin: `${protocol}://${adminParts.join(".")}`, fallback: false };
    }

    // Local dev server (npm run dev), or a production build run locally against
    // the local stores (http://<store>.localhost:<port>) — real hosts never end in .localhost.
    if (env.dev || hostname.endsWith(".localhost")) {
        return { origin: env.devOrigin(hostname), fallback: false };
    }

    // Production but hostname is localhost / IP — Nginx is not forwarding the
    // tenant host. Fall back to PUBLIC_BASE_URL so at least the configured
    // default tenant works. The cure is `proxy_set_header X-Forwarded-Host $host;`
    // in Nginx (the @astrojs/node adapter ignores the plain Host header).
    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.")
    ) {
        const fallback = env.baseUrl || "http://localhost:3000";
        env.warn?.(
            `[middleware] No tenant host header (saw "${hostname}") — serving ` +
                `fallback PUBLIC_BASE_URL=${fallback} for ALL tenants. Add ` +
                `'proxy_set_header X-Forwarded-Host $host;' to Nginx (the Node adapter ignores ` +
                `the plain Host header) so each subdomain resolves dynamically.`,
        );
        return { origin: fallback, fallback: true };
    }

    // Unexpected shape — return as-is rather than silently using the wrong tenant
    return { origin: `${protocol}://${hostname}`, fallback: false };
}

// ── Lookup: is this custom domain connected to a store? ───────────────────────

export type CustomDomainStatus = "connected" | "unknown" | "error";

const CONNECTED_TTL_MS = 5 * 60_000;
const UNKNOWN_TTL_MS = 60_000;
const MAX_ENTRIES = 1000;
const cache = new Map<string, { status: CustomDomainStatus; until: number }>();

/** Tests only. */
export function clearCustomDomainCache(): void {
    cache.clear();
}

/** Drops one host's cached answer: its store API just said the store is gone (disconnected domain). */
export function forgetCustomDomain(host: string): void {
    cache.delete(host);
}

/**
 * Asks the backend whether `host` is a connected custom domain. 200 → connected, 404 → unknown,
 * anything else (timeout, 5xx) → error, never cached, so a backend hiccup is retried next request.
 */
export async function lookupCustomDomain(
    host: string,
    opts: { centralOrigin?: string; fetchImpl?: typeof fetch; now?: () => number; timeoutMs?: number } = {},
): Promise<CustomDomainStatus> {
    const now = opts.now ?? Date.now;
    const hit = cache.get(host);
    if (hit && hit.until > now()) return hit.status;

    const origin = (opts.centralOrigin || DEFAULT_CENTRAL_ORIGIN).replace(/\/+$/, "");
    const url = `${origin}/api/v1/custom-domains/allowed?domain=${encodeURIComponent(host)}`;
    let status: CustomDomainStatus = "error";
    try {
        const res = await (opts.fetchImpl ?? fetch)(url, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(opts.timeoutMs ?? 4000),
        });
        if (res.status === 200 || res.status === 204) status = "connected";
        else if (res.status === 404) status = "unknown";
    } catch {
        status = "error";
    }

    if (status !== "error") {
        if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
        cache.set(host, { status, until: now() + (status === "connected" ? CONNECTED_TTL_MS : UNKNOWN_TTL_MS) });
    }
    return status;
}
