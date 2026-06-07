"use client";

import React from "react";
import { Product } from "./Product";
import { ProductType } from "@/lib/types";
import { useProductsFilter } from "@/hooks/useProductsFilter";

// Helper to render grid directly
function ProductsGrid({ products, defaultImage }: { products: any[]; defaultImage?: string }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {products?.map((product: ProductType) => (
                <div
                    key={product.id}
                    className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                    <Product product={product} defaultImage={defaultImage} />
                </div>
            ))}
        </div>
    );
}

export default function ProductsSection({ 
    products, 
    defaultImage 
}: { 
    products?: any;
    defaultImage?: string;
}) {
    // Use the filter hook for client-side filtering - it will auto-fetch when URL changes
    const { products: filteredProducts, isLoading, isEmpty } = useProductsFilter(
        products?.data,
        products?.pagination
    );

    // Show loading state with circle spinner
    if (isLoading) {
        return (
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between sm:mb-8">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        أحدث المنتجات
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[var(--main-color)] border-t-transparent"></div>
                    <p className="mt-4 text-gray-500">جاري تحميل المنتجات...</p>
                </div>
            </div>
        );
    }

    // Show empty state - no products found
    if (isEmpty) {
        return (
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between sm:mb-8">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        أحدث المنتجات
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">لا يوجد منتجات</p>
                    <p className="mt-1 text-sm text-gray-500">جرب اختيار فئة أخرى</p>
                </div>
            </div>
        );
    }

    const hasProducts = filteredProducts && filteredProducts.length > 0;

    return (
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    أحدث المنتجات
                </h2>
            </div>

            {hasProducts ? (
                <ProductsGrid products={filteredProducts} defaultImage={defaultImage} />
            ) : (
                <div className="py-10 text-center text-gray-500">
                    لا توجد منتجات
                </div>
            )}
        </div>
    );
}
