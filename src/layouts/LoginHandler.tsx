"use client";

import { useAuth } from "@/providers/SettingsProvider";
import { useEffect } from "react";

interface LoginHandlerProps {
  isLogin?: boolean;
}

/**
 * LoginHandler - Syncs server auth state with client
 * This component doesn't render anything, it just syncs state
 */
export default function LoginHandler({ isLogin }: LoginHandlerProps) {
  const { setIsLogin } = useAuth();

  useEffect(() => {
    if (typeof isLogin === "boolean") {
      setIsLogin(isLogin);
    }
  }, [isLogin, setIsLogin]);

  return null;
}
