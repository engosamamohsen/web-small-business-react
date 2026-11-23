// The ?category= value of a category chip: "<id>-<slug>", or just "<id>" when the category has no slug.
// The API sends slug: null for categories saved without one; `slug.toString()` crashed the whole home page
// (QA 2026-11-23). The server reads only the leading id (idFromParam in products-query.ts), so both forms work.

import { idFromParam } from "@/lib/products-query";

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
