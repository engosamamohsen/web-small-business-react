import { describe, expect, it } from "vitest";
import { collectProductImages, galleryAlt } from "./gallery-images";

const A = "http://admin-moda.localhost:8001/image/products/qa/a.jpg";
const B = "http://admin-moda.localhost:8001/uploads/products/gallery/b.jpg";
const C = "http://admin-moda.localhost:8001/uploads/products/gallery/c.jpg";

describe("collectProductImages", () => {
    it("uses the API's ordered images list", () => {
        expect(collectProductImages({ images: [A, B, C], product_image: A, gallery_images: [B, C] })).toEqual([A, B, C]);
    });

    it("falls back to the main image followed by the gallery", () => {
        expect(collectProductImages({ product_image: A, gallery_images: [B, C] })).toEqual([A, B, C]);
        expect(collectProductImages({ images: [], product_image: A, gallery_images: [B] })).toEqual([A, B]);
    });

    it("drops duplicates, empty values and placeholders", () => {
        expect(
            collectProductImages({
                product_image: "http://x.test/image/products/no_image.jpg",
                gallery_images: [B, "", B, "/placeholder-image.jpg", C],
            }),
        ).toEqual([B, C]);
    });

    it("returns one image for a product without a gallery, none for nothing", () => {
        expect(collectProductImages({ product_image: A, gallery_images: [] })).toEqual([A]);
        expect(collectProductImages({})).toEqual([]);
        expect(collectProductImages(null)).toEqual([]);
    });
});

describe("galleryAlt", () => {
    it("names the product and the position in Arabic", () => {
        expect(galleryAlt("حذاء رياضي", 1, 4)).toBe("حذاء رياضي - صورة 2 من 4");
        expect(galleryAlt("حذاء رياضي", 0, 1)).toBe("حذاء رياضي");
        expect(galleryAlt(undefined, 0, 1)).toBe("صورة المنتج");
    });
});
