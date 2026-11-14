// ─── Server side of the carrier site: calls to the company's public API ──────────────────────────
//
// Server only (node:crypto). Every call to api/shipping/public/* goes through here, from the middleware,
// the SSR pages and the /api/shipping/* proxy routes, so Laravel's per-visitor limits count the visitor
// and not this server:
//   X-CT-Client-IP / X-CT-Client-Time / X-CT-Client-Signature: the visitor's address, signed with
//     SHIPPING_PUBLIC_PROXY_SECRET (HMAC-SHA256 of "<ip>|<time>"); Laravel trusts it only with a valid,
//     fresh signature (App\Support\Shipping\PublicClient).
//   X-Forwarded-For: the same address, so Laravel's global throttle:api counts visitors too.
//   Accept-Language: ar | en, so errors come back in the visitor's language.

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { onTenantForgotten } from "@/lib/store-status";
import type { CarrierApiError, CarrierErrorCode, CarrierLang, CarrierProfile } from "./types";

const TIMEOUT_MS = 10_000;
/** How long the middleware trusts a company's profile (kind, name, areas) before asking again. */
export const PROFILE_CACHE_MS = 60_000;
/** A stale profile still serves pages when the API is briefly unreachable. */
const PROFILE_STALE_MS = 15 * 60_000;

let warnedNoSecret = false;

/**
 * The secret shared with Laravel. Missing in production: logged loudly once per process (QC 2026-11-09). Laravel
 * then refuses bookings and tracking digit checks (PublicClient::misconfigured), so the problem can't go unseen.
 */
export function proxySecret(): string {
    const secret = (typeof process !== "undefined" ? process.env.SHIPPING_PUBLIC_PROXY_SECRET : "") || "";
    if (!secret && import.meta.env.PROD && !warnedNoSecret) {
        warnedNoSecret = true;
        console.error(
            "[shipping] SHIPPING_PUBLIC_PROXY_SECRET is not set: carrier sites can't sign visitor addresses, and the " +
                "company API refuses bookings and tracking digit checks. Set the same value as in Laravel's .env.",
        );
    }
    return secret;
}

const PRIVATE = [/^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^::1$/, /^fc/i, /^fd/i, /^fe80:/i];

function cleanIp(value: string | null | undefined): string | null {
    let v = String(value ?? "").trim();
    if (v.startsWith("::ffff:")) v = v.slice(7);
    return v && isIP(v) ? v : null;
}

/**
 * The visitor's address. Behind the Nginx in deploy/nginx (proxy_set_header X-Real-IP $remote_addr) the
 * connection comes from a private address, so X-Real-IP is used; otherwise the connection address. A
 * visitor's own X-Forwarded-For is never read.
 */
export function visitorIp(request: Request, clientAddress: string | undefined): string {
    const conn = cleanIp(clientAddress);
    if (!conn || PRIVATE.some((re) => re.test(conn))) {
        const real = cleanIp(request.headers.get("x-real-ip"));
        if (real) return real;
    }
    return conn ?? "0.0.0.0";
}

export function signVisitor(ip: string, time: number, secret: string): string {
    return createHmac("sha256", secret).update(`${ip}|${time}`).digest("hex");
}

export function visitorHeaders(ip: string, lang: CarrierLang, now: number = Date.now()): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Accept-Language": lang,
        "X-Forwarded-For": ip,
    };
    const secret = proxySecret();
    if (secret) {
        const time = Math.floor(now / 1000);
        headers["X-CT-Client-IP"] = ip;
        headers["X-CT-Client-Time"] = String(time);
        headers["X-CT-Client-Signature"] = signVisitor(ip, time, secret);
    }
    return headers;
}

export interface ApiResult<T> {
    status: number;
    ok: boolean;
    body: ({ status: true; data: T; message?: string } | CarrierApiError | null);
}

/** One call to api/shipping/public/<path>. Never throws: a network failure is status 0. */
export async function shippingApi<T>(
    apiBase: string,
    path: string,
    opts: { ip: string; lang: CarrierLang; method?: "GET" | "POST"; body?: unknown; query?: Record<string, string> },
): Promise<ApiResult<T>> {
    const url = new URL(`shipping/public/${path.replace(/^\/+/, "")}`, apiBase);
    for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            method: opts.method ?? "GET",
            headers: {
                ...visitorHeaders(opts.ip, opts.lang),
                ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
            },
            body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
            signal: controller.signal,
            redirect: "manual",
        });
        const isJson = /\bjson\b/i.test(res.headers.get("content-type") ?? "");
        const body = isJson ? await res.json().catch(() => null) : null;
        return { status: res.status, ok: res.ok, body };
    } catch {
        return { status: 0, ok: false, body: null };
    } finally {
        clearTimeout(timer);
    }
}

/** An error body for the browser: Laravel's when it sent one, otherwise a code of our own. */
export function errorBody(result: ApiResult<unknown>): CarrierApiError {
    const b = result.body as CarrierApiError | null;
    if (b && b.status === false && typeof b.error_code === "string") return b;
    let code: CarrierErrorCode = "server";
    if (result.status === 0) code = "network";
    else if (result.status === 404) code = "not_found";
    else if (result.status === 429) code = "too_many_requests";
    else if (result.status === 422) code = "validation";
    return { status: false, error_code: code, message: (b as { message?: string } | null)?.message };
}

export function isCarrierProfile(value: unknown): value is CarrierProfile {
    const v = value as Partial<CarrierProfile> | null;
    return Boolean(v && v.kind === "shipping" && typeof v.name === "string" && Array.isArray(v.governorates));
}

// ── Which hosts are shipping companies ───────────────────────────────────────────────────────────
// Keyed by apiBase (one per tenant). Holds the profile without its form_token.
const profiles = new Map<string, { profile: CarrierProfile; at: number }>();
onTenantForgotten((apiBase) => profiles.delete(apiBase));

/** A fresh cached profile: this host is a shipping company and the store settings call can be skipped. */
export function cachedCarrier(apiBase: string, now: number = Date.now()): CarrierProfile | null {
    const hit = profiles.get(apiBase);
    return hit && now - hit.at < PROFILE_CACHE_MS ? hit.profile : null;
}

export type CarrierLookup = { kind: "shipping"; profile: CarrierProfile } | { kind: "none" } | { kind: "unreachable" };

/**
 * Asks the company API for its profile (after setting-profile said "not a store"). A JSON 404 means
 * the host is neither a store nor a shipping company. Anything else that fails uses a stale profile
 * when there is one.
 */
export async function lookupCarrier(apiBase: string, ip: string, lang: CarrierLang, now: number = Date.now()): Promise<CarrierLookup> {
    const result = await shippingApi<CarrierProfile>(apiBase, "profile", { ip, lang });
    const data = result.ok && result.body && result.body.status === true ? result.body.data : null;
    if (isCarrierProfile(data)) {
        const { form_token: _drop, ...profile } = data;
        void _drop;
        profiles.set(apiBase, { profile, at: now });
        return { kind: "shipping", profile };
    }
    const stale = profiles.get(apiBase);
    if (result.status === 404) {
        profiles.delete(apiBase);
        return { kind: "none" };
    }
    if (stale && now - stale.at < PROFILE_STALE_MS) return { kind: "shipping", profile: stale.profile };
    return { kind: "unreachable" };
}

/** A fresh profile with its form_token, for the /ship page (never cached: the token is the load time). */
export async function freshProfile(apiBase: string, ip: string, lang: CarrierLang): Promise<CarrierProfile | null> {
    const result = await shippingApi<CarrierProfile>(apiBase, "profile", { ip, lang });
    const data = result.ok && result.body && result.body.status === true ? result.body.data : null;
    if (!isCarrierProfile(data)) return null;
    const { form_token: _drop, ...forCache } = data;
    void _drop;
    profiles.set(apiBase, { profile: forCache, at: Date.now() });
    return data;
}

/** Logo URL for the browser: the API gives it relative to the company's API host. */
export function absoluteLogo(apiBase: string, logo: string | null | undefined): string | null {
    if (!logo) return null;
    try {
        return new URL(logo, apiBase).toString();
    } catch {
        return null;
    }
}

/** Paths a carrier site serves; anything else is its own 404 page. */
export function isCarrierPath(pathname: string): boolean {
    if (pathname === "/" || pathname === "/ship" || pathname === "/track" || pathname === "/carrier") return true;
    if (/^\/track\/[^/]+$/.test(pathname)) return true;
    if (pathname.startsWith("/api/shipping/")) return true;
    if (pathname === "/robots.txt" || pathname === "/favicon.ico") return true;
    // The store sitemap lists products; a carrier site has none
    if (pathname === "/sitemap.xml") return false;
    // Built assets and public files (fonts, images): anything with a file extension
    return pathname.startsWith("/_astro/") || /\.[a-z0-9]{2,5}$/i.test(pathname);
}

/** For tests. */
export function __resetCarrierCache(): void {
    profiles.clear();
}
