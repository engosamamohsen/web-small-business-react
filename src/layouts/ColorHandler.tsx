"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCookies } from "react-cookie";
import { useCartStore } from "@/lib/stores";

function ColorHandler({ globalData }: { globalData: any }) {
  const effectRan = useRef(true);
  const [, setCookie] = useCookies(["app_data"]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setCartCount = useCartStore((state) => state.setCartCount);

  // handle function set color before render
  useLayoutEffect(() => {
    if (
      !globalData?.status ||
      !effectRan.current ||
      !window.document.documentElement
    ) {
      setIsLoading(false);
      return;
    }

    // Set theme colors on document root only once
    const root = window.document.documentElement;
    root.style.setProperty(
      "--main-color",
      globalData?.data?.mainColor || "#FC7643"
    );
    root.style.setProperty(
      "--second-color",
      globalData?.data?.main_font_color || "#FC7643"
    );

    // handle function set cookie
    setCookie("app_data", { ...globalData?.data });
    effectRan.current = true;
    setIsLoading(false);
  }, [globalData, setCookie]);

  // Sync cart count from server data
  useEffect(() => {
    if (globalData?.cart_count !== undefined) {
      setCartCount(globalData.cart_count);
    }
  }, [globalData, setCartCount]);

  return <>{isLoading ? <LoadingBox /> : null}</>;
}

function LoadingBox() {
  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center gap-2 bg-slate-50"
      suppressHydrationWarning={true}
    >
      <ProgressSpinner
        style={{ width: "30px", height: "30px", margin: "0" }}
        strokeWidth="4"
        animationDuration=".5s"
        aria-label="Loading"
      />
      <bdi className="flex text-3xl text-gray-700">loading ...</bdi>
    </div>
  );
}

export default ColorHandler;