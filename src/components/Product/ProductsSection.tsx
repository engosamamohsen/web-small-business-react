
import React from "react";
// import ProductsGrid from "./ProductsGrid";
import { Product } from "./Product";
import { ProductType } from "@/lib/types";

// Helper to render grid directly to avoid import issues for now
function ProductsGrid({ products, defaultImage }: { products: any; defaultImage?: string }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {products?.data?.map((product: ProductType) => (
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

export default function ProductsSection({ products, defaultImage }: any) {
    // console.log("Rendering ProductsSection", products);

    if (!products?.isSuccess) {
        return null;
    }

    const hasProducts = products?.data && products.data.length > 0;

    return (
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    أحدث المنتجات
                </h2>
            </div>

            {hasProducts ? (
                <ProductsGrid products={products} defaultImage={defaultImage} />
            ) : (
                <div className="py-10 text-center text-gray-500">
                    لا توجد منتجات حاليا
                </div>
            )}
        </div>
    );
}
