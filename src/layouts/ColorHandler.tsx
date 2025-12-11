"use client";

import { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useCartStore } from "@/lib/stores";

function ColorHandler({ globalData }: { globalData: any }) {
  const effectRan = useRef(false);
  const [, setCookie] = useCookies(["app_data"]);
  const setCartCount = useCartStore((state) => state.setCartCount);

  // Apply theme colors immediately on mount without blocking UI
  useEffect(() => {
    if (effectRan.current || !globalData?.status) {
      return;
    }

    // Set theme colors on document root
    if (typeof window !== "undefined" && window.document.documentElement) {
      const root = window.document.documentElement;
      root.style.setProperty(
        "--main-color",
        globalData?.data?.mainColor || "#FC7643"
      );
      root.style.setProperty(
        "--second-color",
        globalData?.data?.main_font_color || "#FC7643"
      );
    }

    // Set cookie with app data
    setCookie("app_data", { ...globalData?.data });
    effectRan.current = true;
  }, [globalData, setCookie]);

  // Sync cart count from server data
  useEffect(() => {
    if (globalData?.cart_count !== undefined) {
      setCartCount(globalData.cart_count);
    }
  }, [globalData, setCartCount]);

  // Don't render any blocking UI
  return null;
}

export default ColorHandler;