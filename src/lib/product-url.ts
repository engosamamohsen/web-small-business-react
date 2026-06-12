import { slugify } from "@/utils/utils";

// ─── SEO-friendly product URLs ────────────────────────────────────────────────
//
// Canonical format: /product/{id}-{slug}
// Example:          /product/8-ft-shaorma-frakh-8
//
// The id comes FIRST so it can always be extracted unambiguously, even when
// the slug itself ends in a number (API slugs like "ft-shaorma-frakh-8" do).
// Same "{id}-{slug}" convention already used for category URL params.

export interface ProductUrlParts {
    id: string;
    slug: string;
}

/**
 * Builds the canonical product path from anything that has an id.
 * Prefers the API-provided slug; falls back to a slugified name.
 *
 * { id: 8, slug: "ft-shaorma-frakh-8" } → "/product/8-ft-shaorma-frakh-8"
 * { id: 8, name: "Some Product" }       → "/product/8-some-product"
 * { id: 8 }                             → "/product/8"
 */
export function buildProductPath(product: {
    id: number | string;
    slug?: string | null;
    name?: string | null;
}): string {
    const id = String(product.id);
    const slug =
        product.slug?.trim() || (product.name ? slugify(product.name) : "");
    return slug ? `/product/${id}-${slug}` : `/product/${id}`;
}

/**
 * Parses a "{id}-{slug}" URL param into its parts.
 *
 * "8-ft-shaorma-frakh-8" → { id: "8", slug: "ft-shaorma-frakh-8" }
 * "8"                    → { id: "8", slug: "" }
 * "no-leading-id"        → null
 */
export function parseProductParam(
    param: string | undefined | null,
): ProductUrlParts | null {
    if (!param) return null;
    const match = param.match(/^(\d+)(?:-(.*))?$/);
    if (!match) return null;
    return { id: match[1], slug: match[2] ?? "" };
}
