import { slugify } from "@/utils/utils";

// ─── SEO-friendly product URLs ────────────────────────────────────────────────
//
// Canonical format (owner decision 2026-11-23): /product/{id}/{seo-name}
// Example:          /product/9/فتة-شاورما-فراخ
//
// The id is its own path segment, so it is never confused with numbers in the
// name, and the address carries the name once, in its own script (no Latin
// transliteration before an Arabic name). Lookup always uses the id, never the
// name, so an outdated/missing/wrong name still resolves the product.
//
// Older addresses keep working and 301 to the canonical one
// (src/pages/product/[...slug].astro): "/product/{api-slug}-{name}"
// ("ft-shaorma-frakh-9-فتة-شاورما-فراخ"), "/product/{api-slug}", "/product/{id}-{name}"
// and "/product/{id}".

export interface ProductUrlParts {
    id: string;
    slug: string;
}

/**
 * Builds the canonical product path from anything that has an id.
 *
 * The latest product name is slugified (Unicode-aware, Arabic preserved) and
 * added after the id. Because the name comes from `product`, the canonical path
 * always reflects the *current* name — when the name changes, the page
 * 301-redirects old URLs to the freshly-built canonical. The API slug (a Latin
 * transliteration) is no longer part of the address.
 *
 * { id: 9, slug: "ft-shaorma-frakh-9", name: "فتة شاورما فراخ" } → "/product/9/فتة-شاورما-فراخ"
 * { id: 9, name: "Chicken Shawarma" }                         → "/product/9/chicken-shawarma"
 * { id: 8, slug: "ft-shaorma-frakh-8" }                       → "/product/8"
 * { id: 8 }                                                   → "/product/8"
 */
export function buildProductPath(product: {
    id: number | string;
    slug?: string | null;
    name?: string | null;
}): string {
    const id = String(product.id).trim();
    const seoName = product.name ? slugify(product.name) : "";
    return seoName ? `/product/${id}/${seoName}` : `/product/${id}`;
}

/**
 * Extracts the product id from the path after "/product/" (the route's rest parameter).
 *
 * "9/فتة-شاورما-فراخ" (canonical) → { id: "9" }: the first segment, when it is a number.
 * Anything else is an older single-segment address → parseProductParam.
 */
export function parseProductPath(path: string | undefined | null): ProductUrlParts | null {
    if (!path) return null;
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    if (segments.length > 1) {
        return /^\d+$/.test(segments[0]) ? { id: segments[0], slug: path } : null;
    }
    return parseProductParam(segments[0]);
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
    //    The API slug is the transliterated name + "-<id>", so numbers at the START of the name show
    //    twice: at the start of the slug and right after the id ("2-ktaa-…-22-2-قطعة"). Numbers at
    //    the END of the name sit just before the id ("…-tgrb-2-7-…تجربة-2" is product 7, not 2).
    //    So the id is the last number of the run, minus the numbers the name starts with.
    const nameStart = tokens.findIndex((t) => !/^[a-z0-9]+$/i.test(t));
    if (nameStart > 0 && isNumber(tokens[nameStart - 1])) {
        let first = nameStart - 1;
        while (first > 0 && isNumber(tokens[first - 1])) first--;
        // No API slug: the path is "<id>-<name>", so the id comes first
        if (first === 0) return { id: tokens[0], slug: param };
        let leading = 0;
        while (leading < first && isNumber(tokens[leading])) leading++;
        return { id: tokens[Math.max(first, nameStart - 1 - leading)], slug: param };
    }

    // 3. Name-less slug or bare id
    return { id: numbers[numbers.length - 1], slug: param };
}
