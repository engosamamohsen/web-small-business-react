"use client";

import { useEffect } from "react";
import { useSettingsData } from "@/providers/SettingsProvider";

/**
 * FaviconHandler
 *
 * Runs on the client after hydration to update the browser favicon
 * to match settings.logo. This ensures even pages that don't pass
 * the favicon at SSR time get it updated dynamically.
 */
export default function FaviconHandler() {
    const settings = useSettingsData();

    useEffect(() => {
        const logoUrl = settings?.logo;
        if (!logoUrl) return;

        // Update all existing favicon link tags
        const selectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
        ];

        let updated = false;
        selectors.forEach((selector) => {
            const el = document.querySelector<HTMLLinkElement>(selector);
            if (el) {
                el.href = logoUrl;
                updated = true;
            }
        });

        // If no favicon tag existed, create one
        if (!updated) {
            const link = document.createElement("link");
            link.rel = "icon";
            link.type = "image/png";
            link.href = logoUrl;
            document.head.appendChild(link);
        }
    }, [settings?.logo]);

    return null;
}
