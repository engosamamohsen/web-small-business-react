import type { ProductType } from "@/lib/types";

/** Fallback images the API sends for "no image" — never worth a slide. */
const PLACEHOLDER = /(^|\/)(no[_-]image|placeholder(-image)?)\.[a-z0-9]+(\?.*)?$/i;

const isRealImage = (value: unknown): value is string =>
    typeof value === "string" && value.trim() !== "" && !PLACEHOLDER.test(value.trim());

/**
 * Every image of a product for the product-page gallery, main image first.
 * Uses the API's ordered `images` list; older APIs only send `product_image` +
 * `gallery_images`, so those are combined instead. Empty, placeholder and
 * duplicate values are dropped.
 */
export function collectProductImages(
    product: Pick<ProductType, "images" | "product_image" | "gallery_images"> | null | undefined,
): string[] {
    if (!product) return [];

    const fromApi = Array.isArray(product.images) ? product.images.filter(isRealImage) : [];
    const source = fromApi.length > 0
        ? fromApi
        : [product.product_image, ...(product.gallery_images ?? [])];

    const seen = new Set<string>();
    const result: string[] = [];
    for (const value of source) {
        if (!isRealImage(value)) continue;
        const url = value.trim();
        if (seen.has(url)) continue;
        seen.add(url);
        result.push(url);
    }
    return result;
}

/** Arabic alt text: "<name> - صورة 2 من 4" (just the name for a single image). */
export function galleryAlt(name: string | undefined, index: number, total: number): string {
    const base = name?.trim() ? name.trim() : "صورة المنتج";
    return total > 1 ? `${base} - صورة ${index + 1} من ${total}` : base;
}
