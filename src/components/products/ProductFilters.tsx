import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PRODUCT_SORTS, hasActiveFilters, type ProductFilters as Filters } from "@/lib/products-query";

// Search, price range and sort above the product list (full e-commerce stores).
// Applying reloads the page with the filters in the URL, so results are server-rendered
// and shareable; the category filter in the URL is kept.

export default function ProductFilters({
    filters: initial = {},
    priceRange,
    total,
}: {
    /** The filters in the URL, read by the page on the server (same on both sides, so hydration matches). */
    filters?: Filters;
    priceRange?: { min: number | null; max: number | null } | null;
    total?: number | null;
}) {
    const [q, setQ] = useState(initial.q ?? "");
    const [minPrice, setMinPrice] = useState(initial.minPrice ?? "");
    const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");
    const [sort, setSort] = useState(initial.sort ?? "");
    const active = hasActiveFilters(initial);

    const go = (next: { q: string; min: string; max: string; sort: string }) => {
        const params = new URLSearchParams(window.location.search);
        const set = (key: string, value: string) => (value.trim() ? params.set(key, value.trim()) : params.delete(key));
        set("q", next.q);
        set("min_price", next.min);
        set("max_price", next.max);
        set("sort", next.sort);
        params.delete("page");
        const qs = params.toString();
        window.location.href = `${window.location.pathname}${qs ? `?${qs}` : ""}#products`;
    };

    const apply = (e: React.FormEvent) => {
        e.preventDefault();
        go({ q, min: minPrice, max: maxPrice, sort });
    };

    const clear = () => go({ q: "", min: "", max: "", sort: "" });

    const minHint = priceRange?.min != null ? String(priceRange.min) : "0";
    const maxHint = priceRange?.max != null ? String(priceRange.max) : "";

    return (
        <form
            onSubmit={apply}
            className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8"
            role="search"
            aria-label="تصفية المنتجات"
            dir="rtl"
        >
            <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-xs text-gray-600">
                    بحث
                    <input
                        id="filter-q"
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="اسم المنتج"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                    />
                </label>
                <label className="flex w-28 flex-col gap-1 text-xs text-gray-600">
                    السعر من
                    <input
                        id="filter-min"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder={minHint}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                    />
                </label>
                <label className="flex w-28 flex-col gap-1 text-xs text-gray-600">
                    إلى
                    <input
                        id="filter-max"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder={maxHint}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                    />
                </label>
                <label className="flex min-w-[170px] flex-col gap-1 text-xs text-gray-600">
                    الترتيب
                    <select
                        id="filter-sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                    >
                        {PRODUCT_SORTS.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--main-color)] px-4 py-2 text-sm font-semibold text-white"
                    >
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> تطبيق
                    </button>
                    {active && (
                        <button
                            type="button"
                            onClick={clear}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                        >
                            <X className="h-4 w-4" aria-hidden="true" /> مسح
                        </button>
                    )}
                </div>
            </div>
            {active && total != null && (
                <p className="mt-2 text-sm text-gray-600" role="status">
                    {total === 0 ? "لا توجد منتجات تطابق اختيارك." : `${total} منتج يطابق اختيارك`}
                </p>
            )}
        </form>
    );
}
