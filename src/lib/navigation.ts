// Navigation utilities to replace next/navigation hooks
// Use these in React components instead of Next.js hooks

export function useRouter() {
    return {
        push: (url: string, options?: { scroll?: boolean }) => {
            window.location.href = url;
        },
        replace: (url: string) => {
            window.location.replace(url);
        },
        back: () => {
            window.history.back();
        },
        forward: () => {
            window.history.forward();
        },
        refresh: () => {
            window.location.reload();
        },
    };
}

export function usePathname() {
    if (typeof window === 'undefined') return '';
    return window.location.pathname;
}

export function useSearchParams() {
    if (typeof window === 'undefined') {
        return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
}

export function useParams() {
    // For dynamic routes, params should be passed as props
    // This is a placeholder that returns empty object
    return {};
}
