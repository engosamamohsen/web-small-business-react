"use client";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function LoginHandler({ isLogin }: { isLogin?: boolean }) {
  useEffect(() => {
    if (isLogin === false) {
      Cookies.remove("app_token");
    }
  }, [isLogin]);

  return null;
}
