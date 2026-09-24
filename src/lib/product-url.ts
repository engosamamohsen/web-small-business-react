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
 * Canonical slugs end in the id ("ft-shaorma-frakh-9"); SEO URLs append the
 * product name after it ("ft-shaorma-frakh-9-فتة-شاورما-فراخ"). The name can
 * itself contain numbers ("2 قطعة بانيه" → "…-slt-22-2-قطعة-بانيه"), so the id
 * is not simply the last number:
 *
 * 1. English name repeated after the id ("chicken-shawarma-9-chicken-shawarma")
 *    → the number between the two copies.
 * 2. Name in another script (Arabic) → the part before it is the API slug; the
 *    id is the first of the numbers it ends with (a name starting "2 …" adds
 *    a "2" right after the id).
 * 3. Otherwise the last number, which covers name-less slugs and bare ids.
 *
 * "ft-shaorma-frakh-9-فتة-شاورما-فراخ"   → { id: "9" }
 * "2-ktaa-banyh-arz-slt-22-2-قطعة-بانيه" → { id: "22" }
 * "ft-shaorma-frakh-8"                   → { id: "8" }
 * "8"                                    → { id: "8" }
 * "no-number"                            → null
 */
export function parseProductParam(
    param: string | undefined | null,
): ProductUrlParts | null {
    if (!param) return null;
    const numbers = param.match(/\d+/g);
    if (!numbers || numbers.length === 0) return null;

    const tokens = param.split("-").filter(Boolean);
    const isNumber = (t: string) => /^\d+$/.test(t);

    // 1. "<name>-<id>-<name>"
    for (let i = 1; i < tokens.length - 1; i++) {
        if (!isNumber(tokens[i])) continue;
        const before = tokens.slice(0, i).join("-").toLowerCase();
        const after = tokens.slice(i + 1).join("-").toLowerCase();
        if (before === after) return { id: tokens[i], slug: param };
    }

    // 2. "<api-slug ending in the id>-<name in another script>"
    const nameStart = tokens.findIndex((t) => !/^[a-z0-9]+$/i.test(t));
    if (nameStart > 0 && isNumber(tokens[nameStart - 1])) {
        let first = nameStart - 1;
        while (first > 0 && isNumber(tokens[first - 1])) first--;
        return { id: tokens[first], slug: param };
    }

    // 3. Name-less slug or bare id
    return { id: numbers[numbers.length - 1], slug: param };
}
