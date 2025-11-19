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

export default function Header({ settingsData }: { settingsData: any }) {
  // Use the cart count atom directly
  const [cartCount] = useAtom(cartCountAtom);

  // Fetch cart data to initialize cart count
  const [token, setToken] = useState<string | undefined>(
    Cookies.get("app_token"),
  );

  const pathname = usePathname();

  // Only check for token on the client side
  useEffect(() => {
    if (Cookies.get("app_token")) {
      setToken(Cookies.get("app_token"));
    } else {
      setToken(undefined);
    }
  }, [pathname]);
  return (
    <div
      className="bg-[var(--main-background)]"
      suppressHydrationWarning={true}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="site home">
            {settingsData?.logo ? (
              <Image
                src={settingsData?.logo}
                alt="site logo"
                width={50}
                height={50}
                quality={70}
                style={{ maxHeight: "50px", objectFit: "contain", borderRadius: "50%" }}
              />
            ) : (
              <span className="text-lg font-bold">
                {settingsData?.name || "Store"}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-4">
            {/* <div className="hidden md:block relative">
              <SearchBar />
            </div> */}
            {token && (
              <Link href="/cart" className="relative" aria-label="site cart">
                <ShoppingCart className="h-5 w-5 text-[var(--second-font-color)]" />

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--main-color)] text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <LoginButton token={token} setToken={setToken} />

            {/* <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={24} className="text-orange-600" />
              ) : (
                <Menu className="text-orange-600" size={24} />
              )}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
