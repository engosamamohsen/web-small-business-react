"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCartCount } from "@/lib/stores";
import SearchBar from "./SearchBar";
import Cookies from "js-cookie";

export default function Header({
  settingsData,
  token: initialToken,
  isLogin,
}: {
  settingsData: any;
  token?: string;
  isLogin?: boolean;
}) {
  // Using Zustand selector for optimized re-renders
  const cartCount = useCartCount();
  const [token, setToken] = useState<string | undefined>(initialToken);
  const pathname = usePathname();
  const router = useRouter();
  const loggedIn = useMemo(() => Boolean(token || isLogin), [token, isLogin]);

  // Keep client token state in sync if the server passes a new one (e.g., after refresh).
  useEffect(() => {
    if (initialToken !== token) {
      setToken(initialToken);
    }
  }, [initialToken, token]);

  // Ensure client sees updated auth state after login without hard refresh.
  useEffect(() => {
    const cookieToken = Cookies.get("app_token");
    if (cookieToken && cookieToken !== token) {
      setToken(cookieToken);
    }
  }, [pathname, token]);

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-black/5
        bg-[var(--main-background)]/90
        backdrop-blur supports-[backdrop-filter]:backdrop-blur
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + brand */}
          <Link
            href="/"
            aria-label="الذهاب للصفحة الرئيسية"
            className="flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {settingsData?.logo ? (
                <Image
                  src={settingsData.logo}
                  alt="شعار المتجر"
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
          </Link>

          {/* Search - center on desktop */}
          <div className="hidden flex-1 md:flex md:justify-center">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* Right side: cart + login */}
          <div className="flex items-center gap-3">
            <Link
              href={loggedIn ? "/cart" : "/login"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
              aria-label="سلة المشتريات"
              onClick={(e) => {
                if (!loggedIn) {
                  e.preventDefault();
                  router.push("/login");
                }
              }}
            >
              <ShoppingCart className="h-4 w-4 text-[var(--second-font-color)]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--main-color)] px-[3px] text-[10px] font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <LoginButton
              token={token}
              setToken={setToken}
              isLogin={isLogin}
              pathname={pathname}
            />
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