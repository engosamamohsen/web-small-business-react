"use client";
import Cookies from "js-cookie";
import { useUpdateEffect } from "react-use";

export default function LoginHandler({ isLogin }: { isLogin: boolean }) {
  useUpdateEffect(() => {
    if (isLogin !== undefined && isLogin !== true) {
      console.log("remove app_token", isLogin);

      Cookies.remove("app_token");
    }
  }, [isLogin]);

  return null;
}
