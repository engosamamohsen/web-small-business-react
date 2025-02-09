"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LoginButton = () => {
  // const { onOpen, isOpen } = useDialogStore((state) => state);
  const pathname = usePathname();

  return (
    <div>
      {/* <button
        type="button"
        onClick={onOpen}
        className="text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline"
      >
        تسجيل الدخول
      </button> */}
      {pathname !== "/login" && (
        <Link
          href={"/register"}
          aria-label="site register"
          className="text-sm font-medium text-[var(--main-color)] underline-offset-4 hover:underline"
        >
          تسجيل الدخول
        </Link>
      )}
    </div>
  );
};
export default LoginButton;
