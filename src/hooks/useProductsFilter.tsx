"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "@/lib/navigation";
import { fetchHookClient } from "./fetch-hook-client";

interface ProductsResponse {
    data: any[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface UseProductsFilterReturn {
    products: any[] | null;
    pagination: any | null;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    isEmpty: boolean;
}

/** Extract just the numeric ID from a "{id}-{slug}" URL param value. */
function extractId(param: string | undefined): string | undefined {
    if (!param) return undefined;
    const match = param.match(/^(\d+)/);
    return match ? match[1] : param;
}

export function useProductsFilter(
    initialProducts?: any[],
    initialPagination?: any,
    forcedCategory?: number,
    forcedSubCategory?: number
): UseProductsFilterReturn {
    const searchParams = useSearchParams();

    // URL params are stored as "{id}-{slug}" — extract the numeric part for the API
    const categoryParam = forcedCategory !== undefined
        ? forcedCategory.toString()
        : extractId(searchParams.get("category") || undefined);
    const subCategoryParam = forcedSubCategory !== undefined
        ? forcedSubCategory.toString()
        : extractId(searchParams.get("sub_category") || undefined);

    // Keep raw params for change detection (so effect re-runs when slug portion changes too)
    const rawCategory = searchParams.get("category") || undefined;
    const rawSubCategory = searchParams.get("sub_category") || undefined;
    const currentPage = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const [products, setProducts] = useState<any[] | null>(initialProducts || null);
    const [pagination, setPagination] = useState<any | null>(initialPagination || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        // Skip first load if we have initial data (SSR)
        if (isFirstLoad && initialProducts) {
            setIsFirstLoad(false);
            return;
        }

        // Fetch products when filters change
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const url = `v1/product${categoryParam ? `?category_id=${categoryParam}` : ""}${subCategoryParam ? `&sub_category_id=${subCategoryParam}` : ""
                    }${subCategoryParam || categoryParam ? `&` : "?"}page=${currentPage}&limit=${limit}`;

                const response = await fetchHookClient<ProductsResponse>({
                    url,
                    method: "GET",
                });

                if (response.ok && response.data?.data) {
                    setProducts(response.data.data);
                    setPagination(response.data.pagination || { last_page: 1 });
                } else {
                    setError(response.error || "Failed to fetch products");
                    setProducts([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                setProducts([]);
            } finally {
                setIsLoading(false);
                setIsFirstLoad(false);
            }
        };

        fetchProducts();
    }, [rawCategory, rawSubCategory, currentPage, limit]);

    // Determine if products are empty (loaded but no products)
    const isEmpty = !isLoading && !error && products !== null && products.length === 0 && !isFirstLoad;

    return {
        products,
        pagination,
        isLoading,
        error,
        isSuccess: products !== null && !error,
        isEmpty,
    };
}
