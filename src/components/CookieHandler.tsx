'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieHandler({ isLogin }: { isLogin: boolean }) {
  useEffect(() => {
    if (!isLogin !== true) {
      Cookies.remove("app_token");
    }
  }, [isLogin]);
  
  return null;
}
