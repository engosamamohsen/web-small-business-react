// The ?category= value of a category chip: "<id>-<slug>", or just "<id>" when the category has no slug.
// The API sends slug: null for categories saved without one; `slug.toString()` crashed the whole home page
// (QA 2026-11-23). The server reads only the leading id (idFromParam in products-query.ts), so both forms work.

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
