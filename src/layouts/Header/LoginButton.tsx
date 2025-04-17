"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LoginButton = () => {
  // const { onOpen, isOpen } = useDialogStore((state) => state);
  const pathname = usePathname();
  const token = Cookies.get("app_token");
  return (
    <div>
      {/* <button
        type="button"
        onClick={onOpen}
        className="text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline"
      >
        تسجيل الدخول
      </button> */}
      {!token && pathname !== "/login" && pathname !== "/register" && (
        <Link
          href={"/login"}
          aria-label="site login"
          className="text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline"
        >
          تسجيل الدخول
        </Link>
      )}
    </div>
  );
};
export default LoginButton;
