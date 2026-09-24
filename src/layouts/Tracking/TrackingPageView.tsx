"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { page?: () => void };
  }
}

/**
 * Next.js changes pages without a full reload, so pixels only see the first page view.
 * Send one on every later route change. (GA4's enhanced measurement already tracks
 * history changes, and GTM users set up their own History Change trigger.)
 */
export default function TrackingPageView() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // the loader scripts already sent the first one
      return;
    }
    window.fbq?.("track", "PageView");
    window.ttq?.page?.();
  }, [pathname]);

  return null;
}
