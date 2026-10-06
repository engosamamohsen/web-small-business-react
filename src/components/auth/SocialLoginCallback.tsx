import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { $api } from "@/client";

// /auth/social?code=…&return=… — the customer is back from Google / Facebook.
// Swap the one-time code for this store's API token, save it like a normal login, and go on.

function safeReturn(path: string | null): string {
  return path && /^\/(?!\/)/.test(path) ? path : "/";
}

export default function SocialLoginCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const back = safeReturn(params.get("return"));

    if (!code) {
      setError("رابط تسجيل الدخول غير صالح. حاول مرة أخرى.");
      return;
    }

    // The code works once: drop it from the address bar right away.
    window.history.replaceState(null, "", "/auth/social");

    $api
      .post("v1/social/exchange", { code })
      .then(({ data }) => {
        const token = data?.data?.api_token;
        if (!token) throw new Error("no token");
        Cookies.set("app_token", token, {
          expires: 1,
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
        });
        window.location.replace(back);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "تعذر تسجيل الدخول. حاول مرة أخرى.");
      });
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center" dir="rtl">
      {error ? (
        <>
          <p className="text-lg font-semibold text-red-700" role="alert">{error}</p>
          <a href="/auth/login" className="rounded-lg bg-[var(--main-color)] px-6 py-2 font-semibold text-white">
            العودة لتسجيل الدخول
          </a>
        </>
      ) : (
        <>
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--main-color)]" aria-hidden="true" />
          <p className="text-gray-700" role="status">جارٍ تسجيل الدخول…</p>
        </>
      )}
    </div>
  );
}
