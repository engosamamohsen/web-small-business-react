"use client";

import { cn } from "@/utils/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import { useMemo, useRef, useState } from "react";
import { $api } from "@/client";
import { toast } from "react-toastify";

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
                // Try to logout from server (401 errors are OK - token might be expired)
                await $api.post("logout");
              } catch (error: any) {
                // Show toast for unexpected errors (not 401)
                if (error?.response?.status !== 401) {
                  toast.error("حدث خطأ أثناء تسجيل الخروج", {
                    position: "top-right",
                    autoClose: 2000,
                    rtl: true,
                  });
                }
                // 401 errors are OK - token expired, continue with local logout
              } finally {
                // Always clear local token and redirect, even if API call fails
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
