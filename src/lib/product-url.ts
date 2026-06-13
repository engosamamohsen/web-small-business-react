import { slugify } from "@/utils/utils";

// ─── SEO-friendly product URLs ────────────────────────────────────────────────
//
// Canonical format: /product/{slug}
// Example:          /product/ft-shaorma-frakh-8
//
// The API slug already embeds the product id as a trailing number
// (e.g. "ft-shaorma-frakh-8"), so no separate id prefix is needed.

export interface ProductUrlParts {
    id: string;
    slug: string;
}

/**
 * Builds the canonical product path from anything that has an id.
 * Prefers the API-provided slug; falls back to a slugified name.
 *
 * { id: 8, slug: "ft-shaorma-frakh-8" } → "/product/ft-shaorma-frakh-8"
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
    return slug ? `/product/${slug}` : `/product/${id}`;
}

/**
 * Parses a "{slug}-{id}" URL param into its parts.
 * The id is the trailing number in the slug.
 *
 * "ft-shaorma-frakh-8" → { id: "8", slug: "ft-shaorma-frakh-8" }
 * "some-product-42"    → { id: "42", slug: "some-product-42" }
 * "no-trailing-number" → null
 */
export function parseProductParam(
    param: string | undefined | null,
): ProductUrlParts | null {
    if (!param) return null;
    const match = param.match(/^(.*)-(\d+)$/);
    if (!match) return null;
    return { id: match[2], slug: param };
}
