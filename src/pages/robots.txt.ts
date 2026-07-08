import type { APIRoute } from "astro";
import { getSiteOrigin } from "@/lib/site-origin";

// Per-tenant robots.txt. The Sitemap directive must be an absolute URL, so it
// has to reflect the requesting tenant's own host — a static file can't (every
// storefront is a different subdomain). Replaces the old public/robots.txt
// placeholder that pointed at https://your-domain.com/sitemap.xml.
export const prerender = false;

export const GET: APIRoute = ({ request, url }) => {
    const origin = getSiteOrigin(request, url);

    const body =
        [
            "User-agent: *",
            "Allow: /",
            "",
            "# Utility pages — not useful in search results",
            "Disallow: /shop/cart",
            "Disallow: /shop/checkout",
            "Disallow: /auth/",
            "Disallow: /user/",
            "Disallow: /order/",
            "",
            `Sitemap: ${origin}/sitemap.xml`,
        ].join("\n") + "\n";

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
