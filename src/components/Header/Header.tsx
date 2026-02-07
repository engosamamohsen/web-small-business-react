/**
 * Header Component - React Island
 * 
 * Interactive header with:
 * - Logo/brand display
 * - Cart icon with count badge
 * - Login/logout button
 * 
 * Uses Astro Islands (client:load) for interactivity while
 * the rest of the page remains static
 */
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Cookies from 'js-cookie';
import { cartCountAtom } from '@/stores/cart';
import LoginButton from './LoginButton';

interface HeaderProps {
  settingsData?: {
    logo?: string;
    name?: string;
  };
}

export default function Header({ settingsData }: HeaderProps) {
  // Use the cart count atom directly
  const [cartCount] = useAtom(cartCountAtom);

  // Token state for conditional rendering
  const [token, setToken] = useState<string | undefined>(undefined);

  // Check for token on client side only
  useEffect(() => {
    const currentToken = Cookies.get('app_token');
    setToken(currentToken);
  }, []);

  // Listen for storage/cookie changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = Cookies.get('app_token');
      setToken(currentToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-[var(--main-background)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" aria-label="site home">
            {settingsData?.logo ? (
              <img
                src={settingsData.logo}
                alt="site logo"
                width={100}
                height={50}
                style={{ maxHeight: '50px', objectFit: 'contain' }}
              />
            ) : (
              <span className="text-lg font-bold">
                {settingsData?.name || 'Store'}
              </span>
            )}
          </a>
          <div className="flex items-center gap-4">
            {token && (
              <a href="/cart" className="relative" aria-label="site cart">
                <ShoppingCart className="h-5 w-5 text-[var(--second-font-color)]" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--main-color)] text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </a>
            )}
            <LoginButton token={token} setToken={setToken} />
          </div>
        </div>
      </div>
    </div>
  );
}
