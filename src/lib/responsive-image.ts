// Resized WebP copies of store images (Laravel ImageResizeController):
//   https://admin-roka.cashierthru.com/image/products/x.jpg
//   → https://admin-roka.cashierthru.com/img/480/image/products/x.jpg.webp
// The first request makes the file; after that the web server sends it as a static file.
// Only store images (an admin-* host, /image or /uploads) are resized; anything else is left as is.

/** Must match ImageResizeController::WIDTHS on the Laravel side. */
export const IMAGE_WIDTHS = [64, 96, 128, 160, 240, 320, 480, 640, 800, 1024, 1280, 1600] as const;

const STORE_IMAGE = /^(https?:\/\/admin-[^/]+)\/((?:image|uploads)\/[^?#]+\.(?:jpe?g|png|webp|gif))$/i;

/** True when this URL is a store image the server can resize. */
export function isResizable(src?: string | null): src is string {
    return !!src && STORE_IMAGE.test(src);
}

/** The URL of the image resized to (at most) `width` px, as WebP. Other URLs come back unchanged. */
export function resizedUrl(src: string, width: number): string {
    const match = src.match(STORE_IMAGE);
    if (!match) return src;
    const w = IMAGE_WIDTHS.find((candidate) => candidate >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    return `${match[1]}/img/${w}/${match[2]}.webp`;
}

/**
 * `srcset` for a store image shown at most `maxDisplayWidth` CSS px wide (covers 2× screens),
 * or undefined when the URL can't be resized.
 */
export function storeSrcSet(src: string | null | undefined, maxDisplayWidth = 1600): string | undefined {
    if (!isResizable(src)) return undefined;
    const largest = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    const limit = Math.min(maxDisplayWidth * 2, largest);
    const widths: number[] = IMAGE_WIDTHS.filter((w) => w < limit);
    widths.push(IMAGE_WIDTHS.find((w) => w >= limit) ?? largest);
    return widths.map((w) => `${resizedUrl(src, w)} ${w}w`).join(", ");
}

/**
 * Attributes for a plain <img> showing a store image: a mid-size WebP as `src`, the full `srcset`,
 * and `sizes`. `maxDisplayWidth` is the widest the image is ever shown, in CSS px.
 */
export function storeImageProps(src: string | null | undefined, sizes: string, maxDisplayWidth = 1600) {
    if (!isResizable(src)) return { src: src ?? undefined };
    return {
        src: resizedUrl(src, Math.min(maxDisplayWidth, 640)),
        srcSet: storeSrcSet(src, maxDisplayWidth),
        sizes,
        // If a resized copy can't be loaded, Layout.astro switches the <img> back to this original.
        "data-orig": src,
    };
}

/** The widest a `sizes` value can make the image, in CSS px (viewport-based sizes count as full width). */
export function maxWidthFromSizes(sizes?: string): number {
    if (!sizes || /vw|%/.test(sizes)) return 1600;
    const px = [...sizes.matchAll(/(\d+)px/g)].map((m) => Number(m[1]));
    return px.length ? Math.max(...px) : 1600;
}
