import { slugify } from "@/utils/utils";

// ─── SEO-friendly product URLs ────────────────────────────────────────────────
//
// Canonical format: /product/{slug}-{seo-name}
// Example:          /product/ft-shaorma-frakh-9-فتة-شاورما-فراخ
//
// The API slug already embeds the product id as a trailing number
// (e.g. "ft-shaorma-frakh-9"). The product name is appended after the slug
// purely for SEO — lookup always uses the id embedded in the slug, never the
// appended name, so an outdated/missing/wrong name still resolves the product.

export interface ProductUrlParts {
    id: string;
    slug: string;
}

/**
 * Builds the canonical product path from anything that has an id.
 * Prefers the API-provided slug; falls back to a slugified name.
 *
 * The latest product name is slugified (Unicode-aware, Arabic preserved) and
 * appended to the slug for SEO. Because the name comes from `product`, the
 * canonical path always reflects the *current* name — when the name changes,
 * the page 301-redirects old URLs to the freshly-built canonical.
 *
 * { id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" }
 *     → "/product/ft-shaorma-frakh-9-فتة-شاورما-فراخ"
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
    const apiSlug = product.slug?.trim() ?? "";
    const seoName = product.name ? slugify(product.name) : "";

    if (apiSlug) {
        // The slug already carries the id; append the SEO name once.
        // The `endsWith` guard keeps the path idempotent so it can't grow if the
        // slug ever already ends with the name.
        return seoName && !apiSlug.endsWith(`-${seoName}`)
            ? `/product/${apiSlug}-${seoName}`
            : `/product/${apiSlug}`;
    }

    // No API slug — keep the id in the path so the product stays resolvable,
    // then append the SEO name when we have one.
    return seoName ? `/product/${id}-${seoName}` : `/product/${id}`;
}

/**
 * Extracts the product id from a URL param.
 *
 * The id is the numeric token embedded in the slug. Canonical slugs end in the
 * id ("ft-shaorma-frakh-9"); SEO URLs append the product name after it
 * ("ft-shaorma-frakh-9-فتة-شاورما-فراخ"). The appended name carries no digits,
 * so the LAST numeric token in the param is always the id — this keeps old
 * (name-less) links working while tolerating the new name suffix.
 *
 * "ft-shaorma-frakh-9-فتة-شاورما-فراخ" → { id: "9", slug: <param> }
 * "ft-shaorma-frakh-8"                 → { id: "8", slug: "ft-shaorma-frakh-8" }
 * "8"                                  → { id: "8", slug: "8" }
 * "no-number"                          → null
 */
export function parseProductParam(
    param: string | undefined | null,
): ProductUrlParts | null {
    if (!param) return null;
    const numbers = param.match(/\d+/g);
    if (!numbers || numbers.length === 0) return null;
    return { id: numbers[numbers.length - 1], slug: param };
}
