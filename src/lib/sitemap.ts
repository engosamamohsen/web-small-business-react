// ─── sitemap.xml: complete or nothing (F1, docs/seo-merchant-data-plan.md, 2026-11-26) ───────────────
//
// Before: the route walked v1/product 48 at a time (16 calls for 739 products) plus v1/categories, all
// at once from this server's one address. The store API's 60-a-minute limit answered 429, the errors
// were swallowed, and a two-address sitemap was served and cached for an hour.
//
// Now:
// 1. One call to v1/sitemap (every product and category, its own rate limit on the store API).
//    An older store API without it (404) → the old paged walk, a few pages at a time, and every page
//    must arrive.
// 2. Anything missing (an error, a 429, a page short of the total, a booking catalogue that failed)
//    → SitemapIncompleteError → HTTP 503 + Retry-After + no-store. A partial sitemap is never sent.
// 3. A complete sitemap is kept in memory per site address for a few minutes. Only a complete one is
//    ever stored, so a failure never replaces a good copy.

import { buildProductPath } from "@/lib/product-url";
import { categoryPagePath } from "@/lib/category/category-param";
import { SERVICES_PATH, servicePath } from "@/lib/booking/seo";

export interface FetchResult {
    ok: boolean;
    status: number;
    data: any;
    error?: string;
}

/** Calls the store API with a path such as "v1/sitemap" (the store's API address is already chosen). */
export type SitemapFetcher = (path: string) => Promise<FetchResult>;

export interface SitemapProduct {
    id: number | string;
    slug?: string | null;
    name?: string | null;
}

export interface SitemapCategory {
    id: number | string;
    name?: string | null;
}

export interface SitemapData {
    products: SitemapProduct[];
    categories: SitemapCategory[];
    services: Array<{ slug?: string | null }> | null; // null: the store takes no bookings
    source: "sitemap" | "legacy";
}

export class SitemapIncompleteError extends Error {
    constructor(
        public readonly step: string,
        public readonly status: number | null,
        detail?: string,
    ) {
        super(`sitemap incomplete at ${step}${status !== null ? ` (HTTP ${status})` : ""}${detail ? `: ${detail}` : ""}`);
        this.name = "SitemapIncompleteError";
    }
}

/** The old paged walk (only for a store API without v1/sitemap): v1/product caps a page at 48. */
export const LEGACY_PAGE_SIZE = 48;
/** At most this many page calls at the same time, so the walk never bursts into the store API's limit. */
export const LEGACY_CONCURRENCY = 3;
/** The sitemap protocol allows 50,000 addresses in one file. */
export const MAX_URLS = 50_000;

const isArray = Array.isArray;

async function loadFromSitemapEndpoint(fetcher: SitemapFetcher): Promise<SitemapData | null> {
    const res = await fetcher("v1/sitemap");
    if (res.status === 404) return null; // older store API: use the paged walk
    const data = res.data?.data;
    if (!res.ok || !isArray(data?.products) || !isArray(data?.categories)) {
        throw new SitemapIncompleteError("v1/sitemap", res.status, res.error);
    }
    const counts = data.counts;
    if (counts && (Number(counts.products) !== data.products.length || Number(counts.categories) !== data.categories.length)) {
        throw new SitemapIncompleteError("v1/sitemap", res.status, "counts do not match the lists");
    }
    return { products: data.products, categories: data.categories, services: null, source: "sitemap" };
}

async function loadLegacyProducts(fetcher: SitemapFetcher): Promise<SitemapProduct[]> {
    const page = async (n: number) => {
        const res = await fetcher(`v1/product?page=${n}&limit=${LEGACY_PAGE_SIZE}`);
        if (!res.ok || !isArray(res.data?.data)) throw new SitemapIncompleteError(`v1/product page ${n}`, res.status, res.error);
        return res.data;
    };

    const first = await page(1);
    const lastPage = Number(first.pagination?.last_page) || 1;
    const total = Number(first.pagination?.total);
    if (lastPage > Math.ceil(MAX_URLS / LEGACY_PAGE_SIZE)) {
        throw new SitemapIncompleteError("v1/product", null, `catalogue too large for one sitemap (${lastPage} pages)`);
    }

    const products: SitemapProduct[] = [...first.data];
    const rest = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
    for (let i = 0; i < rest.length; i += LEGACY_CONCURRENCY) {
        const pages = await Promise.all(rest.slice(i, i + LEGACY_CONCURRENCY).map(page));
        for (const p of pages) products.push(...p.data);
    }

    if (Number.isFinite(total) && products.length < total) {
        throw new SitemapIncompleteError("v1/product", null, `${products.length} of ${total} products`);
    }
    return products;
}

async function loadLegacyCategories(fetcher: SitemapFetcher): Promise<SitemapCategory[]> {
    const res = await fetcher("v1/categories");
    const all = res.data?.data?.data;
    if (!res.ok || !isArray(all)) throw new SitemapIncompleteError("v1/categories", res.status, res.error);
    // Categories that contain active products: the rule the home page uses for its category filter.
    return all.filter((c: any) => (c?.products_active?.length ?? 0) > 0);
}

/**
 * Everything the sitemap lists, or SitemapIncompleteError. `loadServices` is given only for a store
 * that takes bookings; a failure there is a failure of the whole sitemap too.
 */
export async function loadSitemapData(
    fetcher: SitemapFetcher,
    loadServices?: () => Promise<{ services: Array<{ slug?: string | null }> } | null>,
): Promise<SitemapData> {
    const servicesPromise = loadServices
        ? loadServices().then(
              (catalog) => {
                  if (!catalog || !isArray(catalog.services)) throw new SitemapIncompleteError("v1/booking/services", null, "no catalogue");
                  return catalog.services;
              },
              (error) => {
                  throw error instanceof SitemapIncompleteError
                      ? error
                      : new SitemapIncompleteError("v1/booking/services", Number(error?.status) || null, String(error?.message ?? error));
              },
          )
        : Promise.resolve(null);
    // Never an unhandled rejection while the catalogue is loading
    servicesPromise.catch(() => undefined);

    let data = await loadFromSitemapEndpoint(fetcher);
    if (!data) {
        const products = await loadLegacyProducts(fetcher);
        const categories = await loadLegacyCategories(fetcher);
        data = { products, categories, services: null, source: "legacy" };
    }
    data.services = await servicesPromise;
    return data;
}

// Escape the five XML predefined entities. `&` must run first.
function xmlEscape(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

interface SitemapEntry {
    path: string;
    changefreq: string;
    priority: string;
}

// No <lastmod>: the API has no "last updated" date for products or categories, and stamping every
// address with today's date (as before) teaches search engines to ignore the field (owner decision
// 2026-11-23). changefreq: the home page changes daily, the other pages weekly.
function renderEntry(origin: string, entry: SitemapEntry): string {
    // encodeURI keeps the URL structure (`/ ? = &`) but percent-encodes the Arabic/space characters in
    // slugs — the same canonical form the pages emit. xmlEscape then makes it XML-safe.
    const loc = xmlEscape(encodeURI(`${origin}${entry.path}`));
    return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
    ].join("\n");
}

/** The sitemap XML for one site address (the custom domain or the cashierthru address the visitor used). */
export function renderSitemap(origin: string, data: SitemapData): string {
    const seen = new Set<string>();
    const entries: SitemapEntry[] = [];
    const add = (entry: SitemapEntry) => {
        if (seen.has(entry.path)) return;
        // One file holds 50,000 addresses; cutting the list would be a partial sitemap, so refuse instead.
        if (entries.length >= MAX_URLS) throw new SitemapIncompleteError("render", null, `more than ${MAX_URLS} addresses`);
        seen.add(entry.path);
        entries.push(entry);
    };

    add({ path: "/", changefreq: "daily", priority: "1.0" });
    // Customer reviews page (every store; openspec/changes/store-reviews).
    add({ path: "/reviews", changefreq: "weekly", priority: "0.5" });

    // Category pages — the homepage filtered by category, each with its own title and canonical
    // (src/lib/local-seo.ts). categoryPagePath() is the address that canonical names.
    for (const category of data.categories) {
        if (category?.id == null) continue;
        add({ path: categoryPagePath(category), changefreq: "weekly", priority: "0.6" });
    }

    // Product detail pages — the real SEO surface.
    for (const product of data.products) {
        if (product?.id == null) continue;
        add({ path: buildProductPath(product), changefreq: "weekly", priority: "0.8" });
    }

    if (data.services) {
        add({ path: SERVICES_PATH, changefreq: "weekly", priority: "0.7" });
        for (const service of data.services) {
            if (service?.slug) add({ path: servicePath(service.slug), changefreq: "weekly", priority: "0.8" });
        }
    }

    return (
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        entries.map((entry) => renderEntry(origin, entry)).join("\n") +
        `\n</urlset>\n`
    );
}

// ── Response, request coalescing and the in-memory cache of complete sitemaps ────────────────────────
//
// - Coalescing (single-flight): while one address's sitemap is being built, every other request for
//   that address waits for the same build, so 20 crawlers at once cost ONE store API call. Each
//   address builds on its own. All waiters share the build result: the same complete sitemap, or a failure,
//   after which each request gets the last known-good copy if IT may have it (staleAllowed), else a 503.
// - Cache: complete sitemaps only, per address, for CACHE_TTL_MS, within a total MEMORY limit (what the
//   strings cost in V8, see stringMemoryBytes)
//   (default 100 MB, env SITEMAP_CACHE_MAX_MB). Least recently used entries are dropped first. A
//   sitemap larger than the whole limit is served but not kept. A Response already handed out holds
//   its own copy of the text, so dropping an entry never affects a sitemap being sent.

/** How long a complete sitemap is reused before the store API is asked again. */
export const CACHE_TTL_MS = 10 * 60 * 1000;
/** Seconds a search engine should wait before asking again after a 503. */
export const RETRY_AFTER_SECONDS = 300;
const DEFAULT_CACHE_MAX_BYTES = 100 * 1024 * 1024;
const DEFAULT_API_TIMEOUT_MS = 15_000;
/** Fixed cost of one cache entry beyond its text (Map slot, entry object, string header, address key). */
export const CACHE_ENTRY_OVERHEAD_BYTES = 512;

/** A number from the environment; unset, empty or not a number is NaN (callers then use their default). */
function envNumber(name: string): number {
    const raw = typeof process !== "undefined" ? process.env?.[name] : undefined;
    return raw === undefined || raw.trim() === "" ? NaN : Number(raw);
}

function maxBytesFromEnv(): number {
    const mb = envNumber("SITEMAP_CACHE_MAX_MB");
    return Number.isFinite(mb) && mb > 0 ? Math.floor(mb * 1024 * 1024) : DEFAULT_CACHE_MAX_BYTES;
}

/** How long the sitemap waits for the store API (env SITEMAP_API_TIMEOUT_MS, default 15 s); a timeout is a 503. */
export function sitemapApiTimeoutMs(): number {
    const ms = envNumber("SITEMAP_API_TIMEOUT_MS");
    return Number.isFinite(ms) && ms > 0 ? Math.floor(ms) : DEFAULT_API_TIMEOUT_MS;
}

/**
 * What a cached sitemap really costs in the server's memory, not its size on the wire.
 * V8 keeps a string as 1 byte a character when every character fits in Latin-1, otherwise 2 bytes a
 * character (UTF-16). Our XML is plain ASCII (addresses are percent-encoded, text is entity-escaped),
 * so it is 1 byte a character, but anything else is counted at 2 so the limit can never be undercounted.
 * The regex scan also flattens a string built by concatenation, so the stored copy is one flat block.
 */
export function stringMemoryBytes(text: string): number {
    // Any character above Latin-1 (code 255) makes V8 store the whole string at 2 bytes a character.
    const twoByte = /[\u0100-\uffff]/.test(text);
    return (twoByte ? text.length * 2 : text.length) + CACHE_ENTRY_OVERHEAD_BYTES;
}

interface CachedSitemap {
    body: string;
    bytes: number;
    builtAt: number;
    expires: number;
    /** Which store built it (storeKey of the request that built it; null when unknown). */
    storeKey: string | null;
}

/**
 * Identifies the store behind this request, so an address that moves to another store (a custom domain
 * disconnected from one store and connected to another) never gets the old store's sitemap from the cache.
 * Built by the middleware from the settings it received (src/middleware.ts); null when settings failed.
 */
export function sitemapStoreKey(apiBase: string, settingsData: { created_at?: unknown; name?: unknown } | null | undefined): string | null {
    if (!settingsData) return null;
    return [apiBase, String(settingsData.created_at ?? ""), String(settingsData.name ?? "")].join("|");
}

// ── Last known-good sitemap (owner decision 2026-11-26) ─────────────────────────────────────────────
// When a rebuild fails, the last complete sitemap of the SAME address may be served instead of a 503,
// but only when this request's middleware positively confirmed the store is open and, on a custom
// domain, that the domain is connected (a failed lookup never counts: see sitemapTrust), and only
// while the copy is at most SITEMAP_STALE_MAX_HOURS old (default 24). It is sent with a 5-minute cache
// header and X-Sitemap-Stale, and logged. In every other case the answer stays 503.

const DEFAULT_STALE_MAX_HOURS = 24;
/** Seconds a CDN may keep a stale sitemap (short, so the fresh one replaces it soon). */
export const STALE_MAX_AGE_SECONDS = 300;

/** The oldest a last known-good sitemap may be when served (env SITEMAP_STALE_MAX_HOURS, default 24). */
export function sitemapStaleMaxMs(): number {
    const hours = envNumber("SITEMAP_STALE_MAX_HOURS");
    return (Number.isFinite(hours) && hours >= 0 ? hours : DEFAULT_STALE_MAX_HOURS) * 60 * 60 * 1000;
}

/** What the middleware learned about this request's store and address. */
export interface SitemapTrustInput {
    customDomain: boolean;
    /** The custom domain lookup: "connected" | "unknown" | "error"; null when not a custom domain. */
    domainStatus: "connected" | "unknown" | "error" | null;
    tenantUnknown: boolean;
    /** The store settings call answered OK (fresh or from the settings cache of a real answer). */
    settingsOk: boolean;
    /** decideStoreAccess(): "open" | "missing" | "expired". */
    access: "open" | "missing" | "expired" | null;
}

/**
 * Whether a last known-good sitemap may be served for this request (`verified`), and whether this
 * address's stored sitemap must be dropped (`forget`: the store is gone or expired, or the custom
 * domain is confirmed unknown). Anything not positively confirmed is not verified.
 */
export function sitemapTrust(input: SitemapTrustInput): { verified: boolean; storeVerified: boolean; domainVerified: boolean; forget: boolean } {
    const forget = input.access === "missing" || input.access === "expired" || (input.customDomain && input.domainStatus === "unknown");
    const domainOk = !input.customDomain || input.domainStatus === "connected";
    const storeOk = input.settingsOk && input.access === "open" && !input.tenantUnknown;
    return { verified: !forget && domainOk && storeOk, storeVerified: !forget && storeOk, domainVerified: !forget && domainOk, forget };
}

/** Drops an address's stored sitemap (store gone or expired, custom domain disconnected). */
export function forgetSitemap(origin: string): void {
    drop(origin);
}

/** Map order = least recently used first. */
const cache = new Map<string, CachedSitemap>();
let cacheBytes = 0;
let cacheMaxBytes = maxBytesFromEnv();

type BuildResult = { ok: true; body: string } | { ok: false; step: string; status: number | null };
const inFlight = new Map<string, Promise<BuildResult>>();

/** Change the cache size limit (bytes); drops least recently used entries until it fits. */
export function setSitemapCacheMaxBytes(bytes: number): void {
    cacheMaxBytes = Math.max(0, Math.floor(bytes));
    evictUntil(cacheMaxBytes);
}

/** For tests and the benchmark: what the cache holds right now. */
export function sitemapCacheStats(): { entries: number; bytes: number; maxBytes: number; origins: string[]; inFlight: number } {
    return { entries: cache.size, bytes: cacheBytes, maxBytes: cacheMaxBytes, origins: [...cache.keys()], inFlight: inFlight.size };
}

/** For tests: empty the cache and restore the default limit. */
export function clearSitemapCache(): void {
    cache.clear();
    cacheBytes = 0;
    cacheMaxBytes = maxBytesFromEnv();
}

function drop(origin: string): void {
    const entry = cache.get(origin);
    if (!entry) return;
    cache.delete(origin);
    cacheBytes -= entry.bytes;
}

function evictUntil(limit: number): void {
    for (const origin of cache.keys()) {
        if (cacheBytes <= limit) break;
        drop(origin);
    }
}

/** A stored copy built for another store than this request's (the address moved): never usable. */
function belongsToAnotherStore(entry: CachedSitemap, storeKey: string | null | undefined): boolean {
    return Boolean(storeKey) && entry.storeKey !== null && entry.storeKey !== storeKey;
}

function cached(origin: string, now: number, storeKey: string | null | undefined): string | null {
    const entry = cache.get(origin);
    if (entry && belongsToAnotherStore(entry, storeKey)) {
        drop(origin); // the address now belongs to another store: never serve the old store's URLs
        return null;
    }
    // An expired copy stays stored (and counted) until a new COMPLETE sitemap replaces it or the size
    // limit drops it: a failed rebuild never removes the last good copy.
    if (!entry || entry.expires <= now) return null;
    // Most recently used goes last
    cache.delete(origin);
    cache.set(origin, entry);
    return entry.body;
}

/** Keeps a complete sitemap. Returns false when it is larger than the whole limit (served, not kept). */
function remember(origin: string, body: string, now: number, storeKey: string | null): boolean {
    const bytes = stringMemoryBytes(body);
    drop(origin);
    if (bytes > cacheMaxBytes) return false;
    evictUntil(cacheMaxBytes - bytes);
    cache.set(origin, { body, bytes, builtAt: now, expires: now + CACHE_TTL_MS, storeKey });
    cacheBytes += bytes;
    return true;
}

export interface SitemapRequest {
    origin: string; // the site address search engines see (custom domain or cashierthru address)
    apiBase: string; // for the log only
    fetcher: SitemapFetcher;
    loadServices?: () => Promise<{ services: Array<{ slug?: string | null }> } | null>;
    now?: () => number;
    log?: (line: string) => void;
    /** True only when this request's middleware confirmed the store is open and the custom domain (if any)
     *  is connected (sitemapTrust). Lets a failed rebuild serve the last known-good copy of this address. */
    staleAllowed?: boolean;
    /** The store behind this request (sitemapStoreKey), null when the middleware could not tell. */
    storeKey?: string | null;
}

async function build(req: SitemapRequest, now: () => number, log: (line: string) => void): Promise<BuildResult> {
    try {
        const data = await loadSitemapData(req.fetcher, req.loadServices);
        const body = renderSitemap(req.origin, data);
        if (!remember(req.origin, body, now(), req.storeKey ?? null)) {
            log(JSON.stringify({ event: "sitemap_not_cached", site: req.origin, reason: "larger than the cache limit", bytes: stringMemoryBytes(body), max_bytes: cacheMaxBytes }));
        }
        return { ok: true, body };
    } catch (error) {
        const e = error instanceof SitemapIncompleteError ? error : null;
        log(
            JSON.stringify({
                event: "sitemap_failed",
                site: req.origin,
                api: req.apiBase,
                step: e?.step ?? "unknown",
                status: e?.status ?? null,
                error: String((error as any)?.message ?? error),
            }),
        );
        return { ok: false, step: e?.step ?? "unknown", status: e?.status ?? null };
    }
}

/** The whole sitemap.xml answer: 200 with a complete sitemap, the last known-good one when allowed (see
 *  staleAllowed), or 503. Never partial; a failure is never cached. */
export async function sitemapResponse(req: SitemapRequest): Promise<Response> {
    const now = req.now ?? Date.now;
    const log = req.log ?? ((line: string) => console.error(line));

    const hit = cached(req.origin, now(), req.storeKey);
    if (hit !== null) return ok(hit);

    // One build per address (and store) at a time; everyone asking meanwhile shares it (one log line per build).
    const flightKey = req.origin + "\n" + (req.storeKey ?? "");
    let pending = inFlight.get(flightKey);
    if (!pending) {
        pending = build(req, now, log).finally(() => inFlight.delete(flightKey));
        inFlight.set(flightKey, pending);
    }
    const result = await pending;
    if (result.ok) return ok(result.body);
    return lastKnownGood(req, now(), log, result) ?? unavailable();
}

function ok(body: string): Response {
    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // Cache at the edge/CDN for an hour; catalogue changes pick up next pull. Only a complete
            // sitemap ever gets this header.
            "Cache-Control": "public, max-age=3600",
        },
    });
}

/** The last complete sitemap of this exact address, if this request may have it and it is young enough. */
function lastKnownGood(
    req: SitemapRequest,
    now: number,
    log: (line: string) => void,
    failure: { step: string; status: number | null },
): Response | null {
    if (req.staleAllowed !== true) return null;
    const entry = cache.get(req.origin); // keyed by the exact address: never another host's sitemap
    if (!entry) return null;
    // ...and only the copy this same store built (never one from before the address moved)
    if (!req.storeKey || entry.storeKey !== req.storeKey) return null;
    const ageMs = Math.max(0, now - entry.builtAt);
    if (ageMs > sitemapStaleMaxMs()) {
        drop(req.origin); // too old to serve: free it
        return null;
    }
    const ageSeconds = Math.floor(ageMs / 1000);
    log(JSON.stringify({ event: "sitemap_served_stale", site: req.origin, age_seconds: ageSeconds, step: failure.step, status: failure.status }));
    return new Response(entry.body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=" + STALE_MAX_AGE_SECONDS,
            "X-Sitemap-Stale": String(ageSeconds),
        },
    });
}

function unavailable(): Response {

    return new Response("Sitemap temporarily unavailable\n", {
        status: 503,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "Retry-After": String(RETRY_AFTER_SECONDS),
        },
    });
}
