// Astro-compatible Link component wrapper
// Use this instead of next/link in React components

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    prefetch?: boolean | 'load' | 'hover' | 'visible' | 'tap';
    children: React.ReactNode;
}

export default function Link({ href, prefetch = true, children, ...props }: LinkProps) {
    const prefetchAttr = prefetch === true ? 'tap' : prefetch === false ? undefined : prefetch;

    return (
        <a
            href={href}
            {...(prefetchAttr && { 'data-astro-prefetch': prefetchAttr })}
            {...props}
        >
            {children}
        </a>
    );
}
