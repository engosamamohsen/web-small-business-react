"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai/react";
import { cartCountAtom } from "@/Store/cart";

function ColorHandler({ globalData }: { globalData: any }) {
  const effectRan = useRef(true);
  const [, setCookie] = useCookies(["app_data"]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setCartCount] = useAtom(cartCountAtom);

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
    // root.style.setProperty("--main-background", globalData?.data?.main_bg);
    // root.style.setProperty("--second-background", "#ffff");
    // root.style.setProperty("--second-background", globalData?.data?.second_bg);
    // root.style.setProperty(
    //   "--second-font-color",
    //   globalData?.data?.second_font_color,
    // );
    // root.style.setProperty(
    //   "--main-font-color",
    //   globalData?.data?.main_font_color,
    // );
    // root.style.setProperty(
    //   "--font-color",
    //   globalData?.data?.fontColor || "#ffff",
    // );
    root.style.setProperty(
      "--main-color",
      globalData?.data?.mainColor || "#FC7643",
    );
    root.style.setProperty(
      "--second-color",
      globalData?.data?.main_font_color || "#FC7643",
    );

    // handle function set cookie
    setCookie("app_data", { ...globalData?.data });
    effectRan.current = true;
    setIsLoading(false);

    // document.cookie = `app_name=${globalData?.data.name}; path=/; max-age=86400`; // 1 day
  }, [globalData, setCookie]);

  useEffect(() => {
    if (globalData?.cart_count) {
      setCartCount(globalData?.cart_count);
    }
  }, [globalData, setCartCount]);
  return <>{isLoading ? <LoadingBox /> : null}</>; // This component doesn't render anything
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
      <bdi className="flex text-3xl text-gray-700"> loading ...</bdi>
    </div>
  );
}
export default ColorHandler;
