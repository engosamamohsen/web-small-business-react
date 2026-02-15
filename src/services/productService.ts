// src/services/ProductService.ts
import { fetchHook } from "@/hooks/fetch-hook";
import { ProductType } from "@/lib/types";

type ApiEnvelope<T> = {
    status: number;
    message?: string;
    data: T;
};

export async function getProductDetailServices(
    productId: string,
): Promise<ProductType | null> {
    const res = await fetchHook<ApiEnvelope<ProductType>>({
        url: `v1/product-details?product_id=${productId}`,
        init: {
            
        },
    });

    if (!res.ok || !res.data || !res.data.data) {
        return null;
    }

    return res.data.data;
}
