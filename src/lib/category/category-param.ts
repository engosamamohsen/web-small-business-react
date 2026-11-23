// The ?category= value of a category chip: "<id>-<slug>", or just "<id>" when the category has no slug.
// The API sends slug: null for categories saved without one; `slug.toString()` crashed the whole home page
// (QA 2026-11-23). The server reads only the leading id (idFromParam in products-query.ts), so both forms work.

import { idFromParam } from "@/lib/products-query";
import { slugify } from "@/utils/utils";

export interface CategoryLike {
    id?: number | string | null;
    slug?: string | number | null;
}

export function categoryParam(category: CategoryLike | null | undefined): string {
    const id = category?.id === null || category?.id === undefined ? "" : String(category.id).trim();
    if (!id) return "";
    const slug = category?.slug === null || category?.slug === undefined ? "" : String(category.slug).trim();
    return slug ? `${id}-${slug}` : id;
}

/**
 * True when a ?category= / ?sub_category= value points at this category. Matches on the leading id, like the
 * server (idFromParam), so "7-pizza", "7" and a link with an old slug all select category 7.
 */
export function isSelectedCategory(param: string | null | undefined, category: CategoryLike | null | undefined): boolean {
    const id = categoryParam(category ? { id: category.id } : category);
    return !!id && idFromParam(param) === id;
}

/**
 * The address of a category's own page, as search engines see it: "/?category=<id>-<name>", the
 * name slugified (Arabic kept), or "/?category=<id>" without a name. The sitemap lists this address
 * and the page names it as its canonical (src/lib/local-seo.ts), so both always agree. The chips
 * may link with the API slug ("<id>-<slug>"); every form opens the same page.
 */
export function categoryPagePath(category: { id?: number | string | null; name?: string | null } | null | undefined): string {
    const id = category?.id === null || category?.id === undefined ? "" : String(category.id).trim();
    if (!id) return "/";
    const name = category?.name ? slugify(category.name) : "";
    return `/?category=${name ? `${id}-${name}` : id}`;
}

/**
 * True for a plain left click on a category link: the page then filters in place (pushState, no
 * reload). A click that asks for a new tab or window (Ctrl / Cmd / Shift / Alt, middle button) is
 * left to the browser, which opens the link's own address (categoryPagePath).
 */
export function isPlainClick(e: {
    button?: number;
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    defaultPrevented?: boolean;
}): boolean {
    return !e.defaultPrevented && (e.button ?? 0) === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/**
 * onClick for a category link: a plain click runs `handler` (filter in place) instead of loading the
 * link; any other click (new tab / window) is left to the browser.
 */
export function inPlaceClick(handler: () => void) {
    return (e: Parameters<typeof isPlainClick>[0] & { preventDefault: () => void }) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        handler();
    };
}
