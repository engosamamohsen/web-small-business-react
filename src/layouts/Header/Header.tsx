"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { useSettings } from "@/providers";
import LoginButton from "./LoginButton";
import SearchBar from "./SearchBar";

export default function Header() {
  // Get data from context - NO API calls!
  const { settings, isLogin: initialIsLogin, cartCount } = useSettings();

  // const [token, setToken] = useState<string | undefined>(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLogin);

  const pathname = usePathname();
  const router = useRouter();

  // Sync auth state from cookies - only on mount and pathname change
  useEffect(() => {
    const cookieToken = Cookies.get("app_token");
    // setToken(cookieToken);
    setIsLoggedIn(Boolean(cookieToken));
  }, [pathname]); // Only depend on pathname, not token

  // Handle logout - called from LoginButton
  const handleLogout = useCallback(() => {
    Cookies.remove("app_token");
    // setToken(undefined);
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh(); // Refresh to update server state
  }, [router]);

  // Handle cart click
  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

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
          {/* Logo */}
          <Link
            href="/"
            aria-label="الذهاب للصفحة الرئيسية"
            className="flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {settings?.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings?.name || "شعار المتجر"}
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              ) : (
                <span className="text-sm font-bold">
                  {settings?.name?.charAt(0) || "S"}
                </span>
              )}
            </div>
            {settings?.name && (
              <span className="hidden text-lg font-semibold text-[var(--main-font-color)] sm:block">
                {settings.name}
              </span>
            )}
          </Link>

          {/* Search - center on desktop */}
          <div className="hidden flex-1 md:flex md:justify-center">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>

          {/* Right side: cart + login */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link
              href={isLoggedIn ? "/cart" : "/login"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
              aria-label="سلة المشتريات"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-4 w-4 text-[var(--second-font-color)]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--main-color)] px-[3px] text-[10px] font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            <LoginButton
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 pt-1 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}