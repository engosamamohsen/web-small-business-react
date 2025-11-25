"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./LoginButton";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { cartCountAtom } from "@/Store/cart";
import SearchBar from "./SearchBar";

export default function Header({ settingsData }: { settingsData: any }) {
  const [cartCount] = useAtom(cartCountAtom);
  const [token, setToken] = useState<string | undefined>(
    Cookies.get("app_token"),
  );
  const pathname = usePathname();

  useEffect(() => {
    if (Cookies.get("app_token")) {
      setToken(Cookies.get("app_token"));
    } else {
      setToken(undefined);
    }
  }, [pathname]);

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-black/5
        bg-[var(--main-background)]/90
        backdrop-blur supports-[backdrop-filter]:backdrop-blur
      "
      suppressHydrationWarning={true}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + brand */}
          <Link
            href="/"
            aria-label="العودة للصفحة الرئيسية"
            className="flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {settingsData?.logo ? (
                <Image
                  src={settingsData.logo}
                  alt="شعار الموقع"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              ) : (
                <span className="text-sm font-bold">
                  {settingsData?.name || "Store"}
                </span>
              )}
            </div>

            {/* {settingsData?.name && (
              <span className="hidden text-sm font-semibold text-[var(--second-font-color)] sm:inline">
                {settingsData.name}
              </span>
            )} */}
          </Link>

          {/* Search - center on desktop */}
          <div className="hidden flex-1 md:flex md:justify-center">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* Right side: cart + login */}
          <div className="flex items-center gap-3">
            {token && (
              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
                aria-label="سلة المشتريات"
              >
                <ShoppingCart className="h-4 w-4 text-[var(--second-font-color)]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--main-color)] px-[3px] text-[10px] font-semibold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            <LoginButton token={token} setToken={setToken} />
          </div>
        </div>

        {/* Mobile search under header */}
        <div className="pb-3 pt-1 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
