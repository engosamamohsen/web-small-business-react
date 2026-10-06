import { describe, it, expect } from "vitest";
import { isResizable, resizedUrl, storeSrcSet, storeImageProps } from "./responsive-image";

const SRC = "https://admin-roka.cashierthru.com/image/products/1700-abc.jpg";

describe("responsive store images", () => {
    it("resizes only store images on an admin host", () => {
        expect(isResizable(SRC)).toBe(true);
        expect(isResizable("https://admin-roka.cashierthru.com/uploads/logo.png")).toBe(true);
        expect(isResizable("http://admin-moda.localhost:8001/image/banner/x.webp")).toBe(true);
        expect(isResizable("https://roka.cashierthru.com/placeholder.jpg")).toBe(false);
        expect(isResizable("https://cdn.example.com/image/x.jpg")).toBe(false);
        expect(isResizable("data:image/png;base64,AAA")).toBe(false);
        expect(isResizable("/placeholder-image.jpg")).toBe(false);
        expect(isResizable(null)).toBe(false);
    });

    it("rounds up to a width the server makes", () => {
        expect(resizedUrl(SRC, 300)).toBe("https://admin-roka.cashierthru.com/img/320/image/products/1700-abc.jpg.webp");
        expect(resizedUrl(SRC, 5000)).toBe("https://admin-roka.cashierthru.com/img/1600/image/products/1700-abc.jpg.webp");
        expect(resizedUrl("/x.jpg", 300)).toBe("/x.jpg");
    });

    it("builds a srcset up to twice the display width", () => {
        const set = storeSrcSet(SRC, 100)!;
        expect(set).toContain("/img/64/");
        expect(set).toContain("/img/160/");
        expect(set).toContain(" 240w");
        expect(set).not.toContain("/img/320/");
        expect(storeSrcSet("/x.jpg")).toBeUndefined();
    });

    it("gives plain <img> attributes, or the URL alone when it can't be resized", () => {
        const props = storeImageProps(SRC, "100vw", 1600);
        expect(props.src).toContain("/img/640/");
        expect(props.sizes).toBe("100vw");
        expect(storeImageProps("/x.jpg", "100vw")).toEqual({ src: "/x.jpg" });
    });
});
