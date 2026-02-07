/**
 * LoginButton Component - React Island
 *
 * Handles login/logout functionality with dropdown menu
 * Shows different UI based on authentication state
 * Matches Next.js behavior with overlay panel
 */
import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import Cookies from 'js-cookie';

interface LoginButtonProps {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
}

export default function LoginButton({ token, setToken }: LoginButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    Cookies.remove('app_token');
    Cookies.remove('app_data');
    setToken(undefined);
    setIsOpen(false);
    window.location.href = '/';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current path for hiding login on auth pages
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  if (token) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-[var(--main-color)]"
          aria-label="User Menu"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 min-w-[150px] rounded-lg bg-white p-3 shadow-lg">
            <div className="flex flex-col items-start justify-center gap-3">
              <a
                href="/order"
                className="text-sm text-[var(--font-color)] hover:text-[var(--main-color)]"
                onClick={() => setIsOpen(false)}
              >
                الطلبات
              </a>
              <a
                href="/profile"
                className="text-sm text-[var(--font-color)] hover:text-[var(--main-color)]"
                onClick={() => setIsOpen(false)}
              >
                الملف الشخصي
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-[var(--font-color)] hover:text-[var(--main-color)]"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hide login button on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <a
      href="/login"
      className="text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline"
      aria-label="تسجيل الدخول"
    >
      تسجيل الدخول
    </a>
  );
}
