"use client";

import { ShoppingCart, ClipboardList } from "lucide-react";
import Link from "@/components/common/Link";
import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useRouter } from "@/lib/navigation";
import Cookies from "js-cookie";

import { useSettings } from "@/providers";
import { fetchSettings, SettingsData } from "@/hooks/fetchSettings";
import LoginButton from "./LoginButton";
import SearchBar from "./SearchBar";
import CircleLogo from "@/global/CircleLogo";
import { storeConfig } from "@/lib/store-config";
import { localCartCount, LOCAL_CART_EVENT } from "@/lib/cart/local-cart";

// Lazy-loaded: AuthDialog pulls in the Firebase SDK (~287 KB). Loading it only
// when the user actually opens the login dialog keeps it out of every page's
// initial bundle (on the BASIC plan it never loads at all).
const AuthDialog = lazy(() => import("@/components/auth/AuthDialog"));

interface HeaderProps {
  currentPath?: string;
  initialIsLoggedIn?: boolean;
  settingsData?: SettingsData;
}

export default function Header({ initialIsLoggedIn = false, settingsData }: HeaderProps) {
  const { settings: contextSettings, isLogin: contextIsLogin, cartCount: contextCartCount } = useSettings();

  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  // Stays true once the dialog is first opened so the Firebase chunk is fetched
  // on demand (not at page load) and the dialog keeps its open/close animation.
  const [authMounted, setAuthMounted] = useState(false);
  const [settings, setSettings] = useState<SettingsData | null>((settingsData as any) || (contextSettings as any) || null);
  // For BASIC plan: maintain badge count directly from localStorage so the
  // badge updates even when the Header is an isolated island (no SettingsProvider).
  const [localCount, setLocalCount] = useState(0);

  const router = useRouter();

  // Hydrate login status on client
  useEffect(() => {
    setIsLoggedIn(contextIsLogin || Boolean(Cookies.get("app_token")));
  }, [contextIsLogin]);

  // Fetch settings on client
  useEffect(() => {
    if (!settings) {
      fetchSettings().then(res => {
        if (res.ok && res.data) setSettings(res.data);
      });
    }
  }, [settings]);

  // BASIC plan: sync badge from localStorage so it updates even when the
  // Header is an isolated Astro island with no SettingsProvider above it.
  useEffect(() => {
    if (!storeConfig.usesLocalCart) return;
    const sync = () => setLocalCount(localCartCount());
    sync();
    window.addEventListener(LOCAL_CART_EVENT, sync);
    return () => window.removeEventListener(LOCAL_CART_EVENT, sync);
  }, []);

  const cartCount = storeConfig.usesLocalCart ? localCount : contextCartCount;

  const handleLogout = useCallback(() => {
    Cookies.remove("app_token");
    setIsLoggedIn(false);
    router.push("/auth/login");
    router.refresh();
  }, [router]);

  const handleCartClick = (e: React.MouseEvent) => {
    // BASIC plan: the cart is local — always accessible, never gate on login
    if (!storeConfig.canAuthenticate) return;
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthMounted(true);
      setShowAuthDialog(true);
    }
  };

  const openAuthDialog = () => {
    setAuthMounted(true);
    setShowAuthDialog(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--main-background)]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" aria-label="الذهاب للصفحة الرئيسية" className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                {settings?.logo ? (
                  <CircleLogo src={settings.logo} size={36} />
                ) : (
                  <span className="text-sm font-bold">{settings?.name?.charAt(0) || "S"}</span>
                )}
              </div>
              {settings?.name && (
                <span className="hidden text-lg font-semibold text-[var(--main-font-color)] sm:block">
                  {settings.name}
                </span>
              )}
            </Link>

            {/* Search */}
            <div className="hidden flex-1 md:flex md:justify-center">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isLoggedIn && (
                <Link
                  href="/user/orders"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
                  aria-label="طلباتي"
                >
                  <ClipboardList className="h-4 w-4 text-[var(--second-font-color)]" />
                </Link>
              )}

              <Link
                href={!storeConfig.canAuthenticate || isLoggedIn ? "/shop/cart" : "#"}
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

              {storeConfig.canAuthenticate && (
                <LoginButton isLoggedIn={isLoggedIn} onLogout={handleLogout} onOpenAuthDialog={openAuthDialog} />
              )}
            </div>
          </div>

          {/* Mobile search */}
          <div className="pb-3 pt-1 md:hidden">
            <SearchBar />
          </div>
        </div>
      </header>

      {storeConfig.canAuthenticate && authMounted && (
        <Suspense fallback={null}>
          <AuthDialog visible={showAuthDialog} onHide={() => setShowAuthDialog(false)} initSettings={settings || {}} />
        </Suspense>
      )}
    </>
  );
}