"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const LoginButton = () => {
  // const { onOpen, isOpen } = useDialogStore((state) => state);
  const pathname = usePathname();
  const token = Cookies.get("app_token");
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);

  const switchToggle = (e: any) => {
    op?.current?.toggle(e);
  };
  return (
    <div>
      {token && (
        <button
          className="text-sm font-medium text-[var(--main-color)]"
          aria-label="User Menu"
          onClick={switchToggle}
        >
          <i className="pi pi-ellipsis-v"></i>
        </button>
      )}
      <OverlayPanel ref={op} className="">
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <Link
            href={"/order"}
            aria-label="site order"
            className="text-sm text-[var(--font-color)]"
          >
            الطلبات
          </Link>{" "}
          <Link
            href={"/profile"}
            aria-label="site profile"
            className="text-sm text-[var(--font-color)]"
          >
            الملف الشخصي
          </Link>
          <button
            type="button"
            onClick={() => {
              Cookies.remove("app_token");
              router.refresh();
            }}
            className="text-sm text-[var(--font-color)]"
          >
            تسجيل الخروج
          </button>
        </div>
      </OverlayPanel>
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
