// Navigation utilities to replace next/navigation hooks
// Use these in React components instead of Next.js hooks

import { useState, useEffect } from "react";

export function useRouter() {
    return {
        push: (url: string, _options?: { scroll?: boolean }) => {
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
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setPathname(window.location.pathname);

        const handlePopState = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return pathname;
}

export function useSearchParams() {
    const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
        if (typeof window === 'undefined') {
            return new URLSearchParams();
        }
        return new URLSearchParams(window.location.search);
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };

        // Listen to popstate events (back/forward buttons)
        window.addEventListener('popstate', handlePopState);

        // Also create a custom event listener for pushState
        const originalPushState = window.history.pushState;
        window.history.pushState = function (...args) {
            originalPushState.apply(window.history, args);
            setSearchParams(new URLSearchParams(window.location.search));
        };

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.history.pushState = originalPushState;
        };
    }, []);

    return searchParams;
}

export function useParams() {
    // For dynamic routes, params should be passed as props
    // This is a placeholder that returns empty object
    return {};
}
