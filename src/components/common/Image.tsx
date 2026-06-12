// Astro-compatible Image component wrapper
// Use this instead of next/image in React components

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
    ...props
}: ImageProps) {
    // For now, use standard img tag
    // In production, you might want to use a service like Cloudinary or imgix
    const loading = priority ? 'eager' : 'lazy';

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            className={className}
            {...props}
        />
    );
}
