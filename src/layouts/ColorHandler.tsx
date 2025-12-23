"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCookies } from "react-cookie";

import { useSettings, useCart } from "@/providers";

interface ColorHandlerProps {
  globalData?: any; // Keep for backwards compatibility, but prefer context
}

export default function ColorHandler({ globalData }: ColorHandlerProps) {
  const effectRan = useRef(false);
  const [, setCookie] = useCookies(["app_data"]);
  const [isLoading, setIsLoading] = useState(true);

  // Get data from context
  const { settings } = useSettings();
  const { setCartCount } = useCart();

  // Use context data if available, fallback to props
  const data = settings || globalData?.data;
  const cartCount = globalData?.cart_count;

  // Set CSS variables for theme colors
  useLayoutEffect(() => {
    if (effectRan.current) {
      setIsLoading(false);
      return;
    }

    if (!data || typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const root = document.documentElement;

    // 🔸 Use old version color logic with fallbacks
    const mainColor = "#FC7643"; // support both mainColor & main_color
    const secondColor = data?.main_font_color ?? "#FC7643";

    root.style.setProperty("--main-color", mainColor);
    root.style.setProperty("--second-color", secondColor);

    // Keep your new background support if available
    if (data.main_bg) {
      root.style.setProperty("--main-background", data.main_bg);
    }

    // Store settings in cookie for client-side access
    setCookie("app_data", data, { path: "/", maxAge: 86400 });

    effectRan.current = true;
    setIsLoading(false);
  }, [data, setCookie]);

  // Sync cart count from server
  useEffect(() => {
    if (typeof cartCount === "number") {
      setCartCount(cartCount);
    }
  }, [cartCount, setCartCount]);

  // Show loading spinner only on initial mount
  if (isLoading) {
    return <LoadingOverlay />;
  }

  return null;
}

function LoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50"
      suppressHydrationWarning
    >
      <div className="flex flex-col items-center gap-3">
        <ProgressSpinner
          style={{ width: "40px", height: "40px" }}
          strokeWidth="4"
          animationDuration=".5s"
          aria-label="Loading"
        />
        <span className="text-lg text-gray-600">جاري التحميل...</span>
      </div>
    </div>
  );
}
