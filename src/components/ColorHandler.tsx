/**
 * ColorHandler Component - React Island
 * 
 * Handles dynamic theming by setting CSS custom properties
 * Also manages initial cart count and login state
 * 
 * Uses useLayoutEffect to set colors before first paint
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import { cartCountAtom } from '@/stores/cart';
import { settingsDataAtom, isLoginAtom } from '@/stores/settings';

interface ColorHandlerProps {
  globalData?: {
    mainColor?: string;
    main_font_color?: string;
    status?: boolean;
    data?: any;
  };
  isLogin?: boolean;
  cartCount?: number;
}

export default function ColorHandler({
  globalData,
  isLogin = false,
  cartCount = 0,
}: ColorHandlerProps) {
  const effectRan = useRef(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setCartCount] = useAtom(cartCountAtom);
  const [, setSettingsData] = useAtom(settingsDataAtom);
  const [, setIsLoginState] = useAtom(isLoginAtom);

  // Set theme colors before render
  useLayoutEffect(() => {
    if (!globalData || !effectRan.current || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Set theme colors on document root
    const root = window.document.documentElement;
    root.style.setProperty(
      '--main-color',
      globalData?.mainColor || '#FC7643'
    );
    root.style.setProperty(
      '--second-color',
      globalData?.main_font_color || '#FC7643'
    );

    // Store settings in cookie for client-side access
    Cookies.set('app_data', JSON.stringify(globalData), { expires: 1 });
    
    effectRan.current = true;
    setIsLoading(false);
  }, [globalData]);

  // Set global state
  useEffect(() => {
    if (cartCount) {
      setCartCount(cartCount);
    }
    if (globalData) {
      setSettingsData(globalData as any);
    }
    setIsLoginState(isLogin);
  }, [globalData, isLogin, cartCount, setCartCount, setSettingsData, setIsLoginState]);

  // Show loading overlay only during initial load
  if (isLoading) {
    return (
      <div
        style={{ zIndex: 9999 }}
        className="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center gap-2 bg-slate-50"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
        <bdi className="flex text-3xl text-gray-700">loading ...</bdi>
      </div>
    );
  }

  return null;
}
