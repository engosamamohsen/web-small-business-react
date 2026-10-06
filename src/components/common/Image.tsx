import { isResizable, maxWidthFromSizes, resizedUrl, storeSrcSet } from "@/lib/responsive-image";

// Astro-compatible Image component wrapper
// Use this instead of next/image in React components.
// Store images (admin-* host) get a resized WebP srcset from the server (src/lib/responsive-image.ts):
// pass `sizes` (how wide it's shown) or `width`, so the browser downloads the smallest file that fits.

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    fill?: boolean;
    /** React 19: ref is a regular prop — forwarded to the underlying <img> via {...props} */
    ref?: React.Ref<HTMLImageElement>;
}

export default function Image({
    src,
    alt,
    width,
    height,
    priority = false,
    quality,
    fill,
    className,
    sizes,
    ...props
}: ImageProps) {
    const loading = priority ? 'eager' : 'lazy';

    // Shown at most this wide (CSS px): the given width, or what `sizes` allows
    const maxWidth = width || maxWidthFromSizes(sizes);
    const resizable = isResizable(src);
    const srcSet = resizable ? storeSrcSet(src, maxWidth) : undefined;

    return (
        <img
            src={resizable ? resizedUrl(src, Math.min(maxWidth * 2, 640)) : src}
            srcSet={srcSet}
            sizes={srcSet ? sizes || `${maxWidth}px` : sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            data-orig={resizable ? src : undefined}
            className={className}
            {...props}
        />
    );
}
