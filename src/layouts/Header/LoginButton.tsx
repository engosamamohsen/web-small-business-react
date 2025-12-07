"use client";

import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { useMemo, useRef, useState } from "react";
import { $api } from "@/client";

const LoginButton = ({
  token,
  setToken,
  isLogin,
  pathname,
}: {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
  isLogin?: boolean;
  pathname: string | null;
}) => {
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const loggedIn = useMemo(() => Boolean(token || isLogin), [token, isLogin]);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const refButton = useRef<HTMLButtonElement>(null);
  const switchToggle = (e: any) => {
    refButton.current = e;
    op?.current?.toggle(refButton.current as any);
  };

  return (
    <div>
      <button
        ref={refButton}
        className={cn(
          "text-sm font-medium text-[var(--main-color)]",
          loggedIn ? "" : "hidden",
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
          </Link>
          <Link
            href={"/profile"}
            aria-label="site profile"
            className="text-sm text-[var(--font-color)]"
          >
            الملف الشخصي
          </Link>
          <button
            type="button"
            onClick={async () => {
              try {
                setLogoutLoading(true);
                await $api.post("logout");
              } catch (e) {
                throw e;
              } finally {
                Cookies.remove("app_token");
                setToken(undefined);
                router.refresh();
                switchToggle(refButton.current as any);
                setLogoutLoading(false);
              }
            }}
            className="text-sm text-[var(--font-color)]"
            disabled={logoutLoading}
          >
            تسجيل الخروج
          </button>
        </div>
      </OverlayPanel>
      {!loggedIn && pathname !== "/login" && pathname !== "/register" && (
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
