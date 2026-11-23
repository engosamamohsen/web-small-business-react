// ─── Product page lookup: found, missing, or the API is down (owner decision 2026-11-23) ──────────
//
// The product pages used to send every failure to /404 with a temporary redirect: a slow or failing
// API made a real product look deleted, and search engines dropped it (emandbuild.com, Search
// Console). Now:
//   • the API says the product does not exist (404, or ok with no data) → "missing": the page
//     answers 404 at the same address (src/pages/404.astro), never a redirect;
//   • anything else (timeout, network error, 5xx, 429) → one more try, then "unavailable": the page
//     answers 503 with Retry-After (src/pages/unavailable.astro), so search engines come back later.

import { fetchHook } from "@/hooks/fetch-hook";
import type { ProductType } from "@/lib/types";

export type ProductLookup =
    | { kind: "found"; product: ProductType }
    | { kind: "missing" }
    | { kind: "unavailable" };

type Fetcher = typeof fetchHook;

/** One answer of v1/product-details, classified. */
export function classifyProductResponse(response: { ok?: boolean; status?: number; data?: any } | null | undefined): ProductLookup {
    if (response?.ok) {
        const product = response.data?.data;
        return product ? { kind: "found", product } : { kind: "missing" };
    }
    // 404 / 410 / 422: the API looked and the product is not there (or the id is not valid)
    if (response && [404, 410, 422].includes(Number(response.status))) return { kind: "missing" };
    return { kind: "unavailable" };
}

/** v1/product-details for this id; a failing API gets one more try before "unavailable". */
export async function lookupProduct(
    id: string,
    apiBase: string | undefined,
    fetcher: Fetcher = fetchHook,
): Promise<ProductLookup> {
    let outcome: ProductLookup = { kind: "unavailable" };
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await fetcher({
                url: `v1/product-details?product_id=${encodeURIComponent(id)}`,
                init: {},
                baseUrl: apiBase,
            });
            outcome = classifyProductResponse(response);
        } catch (error) {
            console.error("Error fetching product details:", error);
            outcome = { kind: "unavailable" };
        }
        if (outcome.kind !== "unavailable") return outcome;
    }
    return outcome;
}
