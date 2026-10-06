// URL for GET v1/product from the page's query string. One builder for the server render
// (pages/index.astro) and the client refetch (hooks/useProductsFilter.tsx).
//
// Page params:  category={id}-{slug}  sub_category={id}-{slug}  page  limit
//               q (search)  min_price  max_price  sort (newest | price_asc | price_desc | name | discount)

export const PRODUCT_SORTS = [
    { value: "", label: "الأحدث" },
    { value: "price_asc", label: "السعر: من الأقل للأعلى" },
    { value: "price_desc", label: "السعر: من الأعلى للأقل" },
    { value: "discount", label: "الأكثر خصمًا" },
    { value: "name", label: "الاسم" },
] as const;

const SORT_VALUES = new Set<string>(PRODUCT_SORTS.map((s) => s.value).filter(Boolean));

/** The numeric id from a "{id}-{slug}" URL param. */
export function idFromParam(param: string | null | undefined): string | undefined {
    if (!param) return undefined;
    return param.match(/^(\d+)/)?.[1];
}

function numberParam(value: string | null): string | undefined {
    if (value === null || value.trim() === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? String(n) : undefined;
}

export type ProductFilters = {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
};

/** Search, price and sort filters from the page URL (only valid values). */
export function filtersFromParams(params: URLSearchParams): ProductFilters {
    const q = (params.get("q") ?? "").trim().slice(0, 100);
    const sort = params.get("sort") ?? "";
    return {
        q: q || undefined,
        minPrice: numberParam(params.get("min_price")),
        maxPrice: numberParam(params.get("max_price")),
        sort: SORT_VALUES.has(sort) ? sort : undefined,
    };
}

export function hasActiveFilters(f: ProductFilters): boolean {
    return Boolean(f.q || f.minPrice || f.maxPrice || f.sort);
}

export function productsUrl(params: URLSearchParams, overrides: { category?: string; subCategory?: string } = {}): string {
    const query = new URLSearchParams();
    const category = overrides.category ?? idFromParam(params.get("category"));
    const subCategory = overrides.subCategory ?? idFromParam(params.get("sub_category"));
    if (category) query.set("category_id", category);
    if (subCategory) query.set("sub_category_id", subCategory);

    const f = filtersFromParams(params);
    if (f.q) query.set("q", f.q);
    if (f.minPrice) query.set("min_price", f.minPrice);
    if (f.maxPrice) query.set("max_price", f.maxPrice);
    if (f.sort) query.set("sort", f.sort);

    query.set("page", String(Number(params.get("page")) || 1));
    query.set("limit", String(Number(params.get("limit")) || 10));

    return `v1/product?${query.toString()}`;
}
