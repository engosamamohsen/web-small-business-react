"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { Search } from "lucide-react";
import Image from "@/components/common/Image";
import { fetchHookClient } from "@/hooks/fetch-hook-client";

type Category = {
    id?: number | string;
    name?: string;
    icon?: string;
};

type Product = {
    id?: number | string;
    product_id?: number | string;
    name?: string;
    product_name?: string;
    main_image?: string;
    price?: number;
    discount?: number;
    category?: Category;
    sub_category?: Category;
};

const MIN_QUERY_LENGTH = 2;

const formatPrice = (value?: number) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("ar-EG").format(value);
};

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Search products whenever query changes
    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed || trimmed.length < MIN_QUERY_LENGTH) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            try {
                setIsLoading(true);
                setIsOpen(true);

                const response = await fetchHookClient({
                    url: `v1/product?q=${encodeURIComponent(trimmed)}`,
                    init: {
                        signal: controller.signal,
                    },
                });

                if (!response?.ok) {
                    setResults([]);
                    return;
                }

                const products: Product[] =
                    response?.data?.data && Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setResults(products);
            } catch (error: any) {
                if (error?.name !== "AbortError") {
                    console.error(error);
                    setResults([]);
                }
            } finally {
                setIsLoading(false);
            }
        }, 350);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectProduct = (product: Product) => {
        const id = product.id ?? product.product_id;
        if (!id) return;

        setQuery("");
        setResults([]);
        setIsOpen(false);

        router.push(`/products/${id}`);
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    const showDropdown =
        isOpen && (isLoading || results.length > 0 || query.trim().length >= MIN_QUERY_LENGTH);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs">
            {/* Input */}
            <div className="flex items-center rounded-full bg-white/95 px-3 py-2 shadow-sm ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-[var(--main-color)]">
                <Search className="ml-2 h-4 w-4 text-gray-400" />

                <input
                    type="search"
                    className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400 text-right"
                    placeholder="ابحث عن منتج..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="mr-1 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="مسح البحث"
                    >
                        {/* <X className="h-4 w-4" /> */}
                    </button>
                )}
            </div>

            {/* Dropdown results */}
            {showDropdown && (
                <div className="absolute right-0 z-40 mt-2 w-[min(24rem,100vw)] rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur">
                    {/* Top bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-[11px] text-gray-400">
                        <span className="text-right">
                            {isLoading
                                ? "جارٍ البحث عن المنتجات..."
                                : results.length > 0
                                    ? `تم العثور على ${results.length} منتج`
                                    : "لا توجد نتائج مطابقة"}
                        </span>
                        {query && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5">
                                “{query}”
                            </span>
                        )}
                    </div>

                    {/* Loading skeleton */}
                    {isLoading && (
                        <ul className="max-h-72 overflow-auto py-2">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <li key={idx} className="px-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-200/80 animate-pulse" />
                                        <div className="flex flex-1 flex-col gap-2">
                                            <div className="ml-auto h-3 w-40 rounded bg-gray-200/80 animate-pulse" />
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="h-3 w-24 rounded bg-gray-200/80 animate-pulse" />
                                                <div className="h-3 w-16 rounded bg-gray-200/80 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Results list */}
                    {!isLoading && results.length > 0 && (
                        <ul className="max-h-72 overflow-auto py-1">
                            {results.map((product) => {
                                const id = product.id ?? product.product_id;
                                const name = product.name ?? product.product_name ?? "";
                                const categoryName = product.category?.name;
                                const subCategoryName = product.sub_category?.name;
                                const price = product.price;
                                const discount = product.discount ?? 0;
                                const image = product.main_image;

                                return (
                                    <li key={id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectProduct(product)}
                                            className="flex w-full items-center gap-3 px-3 py-2 text-right text-sm transition hover:bg-gray-50"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                                {image ? (
                                                    <Image
                                                        src={image}
                                                        alt={name}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-200" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-1 flex-col items-end gap-1">
                                                <p className="w-full text-xs font-medium text-gray-900 text-right line-clamp-2">
                                                    {name}
                                                </p>

                                                <div className="flex w-full items-center justify-between gap-2">
                                                    {/* Category */}
                                                    <span className="flex-1 text-[11px] text-gray-400 truncate text-right">
                                                        {subCategoryName || categoryName || "منتج"}
                                                    </span>

                                                    {/* Price & discount */}
                                                    <div className="flex items-center gap-1">
                                                        {discount > 0 && (
                                                            <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                                                                خصم %{discount}
                                                            </span>
                                                        )}
                                                        {price !== undefined && (
                                                            <span className="text-xs font-bold text-[var(--main-color)]">
                                                                {formatPrice(price)} <span className="text-[10px]">جنيه</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
