import type { APIRoute } from "astro";
import { fetchHook } from "@/hooks/fetch-hook";
import { buildProductPath } from "@/lib/product-url";
import { getSiteOrigin } from "@/lib/site-origin";
import { slugify } from "@/utils/utils";

// Rendered on demand: the sitemap is per-tenant. Each storefront
// (roka.cashierthru.com, asly.cashierthru.com, …) resolves its own admin API
// via the middleware (Astro.locals.apiBase) and emits URLs on its own origin —
// something the build-time @astrojs/sitemap integration can't do because the
// products live behind a per-tenant API, not in static routes.
export const prerender = false;

// Page through v1/product with a generous page size and a hard safety cap so a
// huge / misbehaving catalogue can never spin the request forever.
const PRODUCTS_PER_PAGE = 100;
const MAX_PAGES = 50; // ≤ 5000 products

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

function renderEntry(origin: string, lastmod: string, entry: SitemapEntry): string {
    // encodeURI keeps the URL structure (`/ ? = &`) but percent-encodes the
    // Arabic/space characters in slugs — the same canonical form the app emits
    // (see products/[slug].astro). xmlEscape then makes it XML-safe.
    const loc = xmlEscape(encodeURI(`${origin}${entry.path}`));
    return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
    ].join("\n");
}

// Walk every page of v1/product and collect the raw product records.
async function fetchAllProducts(
    apiBase: string,
): Promise<Array<{ id: number | string; slug?: string | null; name?: string | null }>> {
    const first = await fetchHook({
        url: `v1/product?page=1&limit=${PRODUCTS_PER_PAGE}`,
        init: {},
        baseUrl: apiBase,
    });

    if (!first?.ok || !Array.isArray(first?.data?.data)) return [];

    const products = [...first.data.data];
    const lastPage = Math.min(Number(first.data.pagination?.last_page) || 1, MAX_PAGES);

    if (lastPage > 1) {
        const rest = await Promise.all(
            Array.from({ length: lastPage - 1 }, (_, i) =>
                fetchHook({
                    url: `v1/product?page=${i + 2}&limit=${PRODUCTS_PER_PAGE}`,
                    init: {},
                    baseUrl: apiBase,
                }),
            ),
        );
        for (const page of rest) {
            if (page?.ok && Array.isArray(page?.data?.data)) {
                products.push(...page.data.data);
            }
        }
    }

    return products;
}

// Categories that actually contain active products — same rule the homepage
// applies before rendering the category filter.
async function fetchCategories(
    apiBase: string,
): Promise<Array<{ id: number | string; name?: string | null }>> {
    const res = await fetchHook({ url: "v1/categories", init: {}, baseUrl: apiBase });
    const all =
        res?.ok && Array.isArray(res?.data?.data?.data) ? res.data.data.data : [];
    return all.filter((c: any) => (c?.products_active?.length ?? 0) > 0);
}

export const GET: APIRoute = async ({ locals, request, url }) => {
    const apiBase = locals.apiBase; // tenant-aware, set by src/middleware.ts
    const origin = getSiteOrigin(request, url);
    const lastmod = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Fail soft: a flaky products/categories call should still yield a valid
    // sitemap (at minimum the homepage) rather than a 500.
    const [products, categories] = await Promise.all([
        fetchAllProducts(apiBase).catch(() => []),
        fetchCategories(apiBase).catch(() => []),
    ]);

    const seen = new Set<string>();
    const entries: SitemapEntry[] = [];
    const add = (entry: SitemapEntry) => {
        if (seen.has(entry.path)) return;
        seen.add(entry.path);
        entries.push(entry);
    };

    // Homepage.
    add({ path: "/", changefreq: "daily", priority: "1.0" });

    // Category landing pages — the homepage filtered by category.
    // URL format "{id}-{slug}" matches what the storefront parses (leading id).
    for (const category of categories) {
        if (category?.id == null) continue;
        const name = category.name ? slugify(category.name) : "";
        const param = name ? `${category.id}-${name}` : String(category.id);
        add({ path: `/?category=${param}`, changefreq: "daily", priority: "0.6" });
    }

    // Product detail pages — the real SEO surface.
    for (const product of products) {
        if (product?.id == null) continue;
        add({ path: buildProductPath(product), changefreq: "daily", priority: "0.8" });
    }

    const body =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        entries.map((entry) => renderEntry(origin, lastmod, entry)).join("\n") +
        `\n</urlset>\n`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // Cache at the edge/CDN for an hour; catalogue changes pick up next pull.
            "Cache-Control": "public, max-age=3600",
        },
    });
};
