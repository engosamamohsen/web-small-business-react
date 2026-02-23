"use client";

import Link from "@/components/common/Link";
import { User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LoginButtonProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuthDialog?: () => void;
}

export default function LoginButton({ isLoggedIn, onLogout, onOpenAuthDialog }: LoginButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Not logged in - show login button that opens dialog
  if (!isLoggedIn) {
    return (
      <button
        onClick={() => onOpenAuthDialog?.()}
        className="flex h-9 items-center gap-2 rounded-full bg-[var(--main-color)] px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">تسجيل الدخول</span>
      </button>
    );
  }

  // Logged in - show user dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--main-color)] text-white shadow-sm transition hover:opacity-90"
        aria-label="قائمة المستخدم"
      >
        <User className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <div className="py-1">
            {/* <Link
              href="/user/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              onClick={() => setShowDropdown(false)}
            >
              <User className="h-4 w-4" />
              الملف الشخصي
            </Link> */}
            <Link
              href="user/orders"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              onClick={() => setShowDropdown(false)}
            >
              <span className="i pi pi-shopping-bag h-4 w-4" />
              طلباتي
            </Link>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => {
                setShowDropdown(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
