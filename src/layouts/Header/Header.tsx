import { ShoppingCart, ClipboardList } from "lucide-react";
import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { useState, useCallback } from "react";
import { useRouter } from "@/lib/navigation";
import Cookies from "js-cookie";

import { useSettings } from "@/providers";
import { fetchPublicSettings, SettingsData } from "@/hooks/fetchSettings";
import LoginButton from "./LoginButton";
import SearchBar from "./SearchBar";
import AuthDialog from "@/components/auth/AuthDialog";
import CircleLogo from "@/global/CircleLogo";

const settingsResponse = await fetchPublicSettings();

interface HeaderProps {
  currentPath?: string;
  initialIsLoggedIn?: boolean;
  settingsData?: SettingsData;
}

export default function Header({ currentPath = "", initialIsLoggedIn = false, settingsData }: HeaderProps) {
  // Get data from context - NO API calls!
  const { settings: contextSettings, isLogin: contextIsLogin, cartCount } = useSettings();

  // const settings = settingsData || contextSettings;

  // alert(settings?.logo?.toString())

  // Read cookie synchronously — no useEffect needed, no flash
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => contextIsLogin || Boolean(Cookies.get("app_token"))
  );
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const router = useRouter();

  // Handle logout - called from LoginButton
  const handleLogout = useCallback(() => {
    Cookies.remove("app_token");
    // setToken(undefined);
    setIsLoggedIn(false);
    router.push("/auth/login");
    router.refresh(); // Refresh to update server state
  }, [router]);

  // Handle cart click - open auth dialog if not logged in
  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowAuthDialog(true);
    }
  };

  const openAuthDialog = () => {
    setShowAuthDialog(true);
  };

  return (
    <>
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
                {settingsResponse?.data?.logo ?
                  <CircleLogo src={settingsResponse?.data?.logo} size={36} />
                  : (
                    <span className="text-sm font-bold">
                      {settingsResponse?.data?.name?.charAt(0) || "S"}
                    </span>
                  )}
              </div>
              {settingsResponse?.data?.name && (
                <span className="hidden text-lg font-semibold text-[var(--main-font-color)] sm:block">
                  {settingsResponse?.data?.name}
                </span>
              )}
            </Link>

            {/* Search - center on desktop */}
            <div className="hidden flex-1 md:flex md:justify-center">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>

            {/* Right side: orders + cart + login */}
            <div className="flex items-center gap-3">
              {/* Orders Button — only for logged-in users */}
              {isLoggedIn && (
                <Link
                  href="/user/orders"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
                  aria-label="طلباتي"
                >
                  <ClipboardList className="h-4 w-4 text-[var(--second-font-color)]" />
                </Link>
              )}

              {/* Cart Button */}
              <Link
                href={isLoggedIn ? "/shop/cart" : "#"}
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
                onOpenAuthDialog={openAuthDialog}
              />
            </div>
          </div>

          {/* Mobile search */}
          <div className="pb-3 pt-1 md:hidden">
            <SearchBar />
          </div>
        </div>
      </header>
      <AuthDialog
        visible={showAuthDialog}
        onHide={() => setShowAuthDialog(false)}
        initSettings={settingsResponse?.data || {}}
      />
    </>
  );
}