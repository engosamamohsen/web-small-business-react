"use client";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function LoginHandler({ isLogin }: { isLogin?: boolean }) {
  useEffect(() => {
    // DISABLED: This was causing issues where cookies were being removed immediately after login
    // Token expiry is already handled by API error responses (403/401) in useCartHook and other hooks

    // TODO: Re-enable with better logic if needed, but for now rely on:
    // - API 403 errors to trigger logout (already implemented in hooks)
    // - Cookie expiry (set to 1 day)

    // console.log("🔐 LoginHandler: isLogin =", isLogin);

    // COMMENTED OUT - was removing cookies too aggressively
    // const hasToken = !!Cookies.get("app_token");
    // if (isLogin === false && hasToken) {
    //   console.log("🔒 LoginHandler: Removing expired/invalid token");
    //   Cookies.remove("app_token");
    // }
  }, [isLogin]);

  return null;
}
