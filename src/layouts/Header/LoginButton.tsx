"use client";

import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const LoginButton = ({
  token,
  setToken,
}: {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
}) => {
  // const { onOpen, isOpen } = useDialogStore((state) => state);
  const pathname = usePathname();
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);

  const refButton = useRef<HTMLButtonElement>(null);
  const switchToggle = (e: any) => {
    console.log(refButton);
    refButton.current = e;
    op?.current?.toggle(refButton.current as any);
  };
  return (
    <div suppressHydrationWarning={true}>
      {/* Only render content after client-side hydration */}
      <button
        ref={refButton}
        className={cn(
          "text-sm font-medium text-[var(--main-color)]",
          token !== undefined && token ? "" : "hidden",
        )}
        aria-label="User Menu"
        onClick={switchToggle}
      >
        <i className="pi pi-ellipsis-v"></i>
      </button>
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
              setToken(undefined);
              router.refresh();
              switchToggle(refButton.current as any);
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
