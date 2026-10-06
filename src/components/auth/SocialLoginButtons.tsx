import type { SocialLoginOption } from "@/hooks/fetchSettings";

// "Continue with Google / Facebook" (full e-commerce plans). Each button opens the platform's
// sign-in through CashierThru's central login, which returns to /auth/social on this store.
// The store's options come from setting-profile `social_login` (pages pass them as a prop;
// dialogs read the ones Layout.astro printed in window.__CT_STORE__).

function storeOptions(): SocialLoginOption[] {
  if (typeof window === "undefined") return [];
  const store = (window as unknown as { __CT_STORE__?: { socialLogin?: SocialLoginOption[] } }).__CT_STORE__;
  return Array.isArray(store?.socialLogin) ? store.socialLogin : [];
}

const LABELS: Record<SocialLoginOption["provider"], string> = {
  google: "المتابعة باستخدام Google",
  facebook: "المتابعة باستخدام Facebook",
};

function GoogleIcon() {
  return <img src="/icons8-google.svg" alt="" width={22} height={22} aria-hidden="true" />;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z" />
    </svg>
  );
}

export default function SocialLoginButtons({
  options,
  returnTo,
}: {
  options?: SocialLoginOption[];
  /** Page to land on after signing in (a path on this store). Defaults to the current page. */
  returnTo?: string;
}) {
  const list = options && options.length ? options : storeOptions();
  if (!list.length) return null;

  const back =
    returnTo ??
    (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")
      ? window.location.pathname + window.location.search
      : "/");

  return (
    <div className="flex flex-col items-stretch gap-3">
      {list.map((option) => (
        <a
          key={option.provider}
          href={`${option.url}&return=${encodeURIComponent(back)}`}
          className={
            option.provider === "facebook"
              ? "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1877F2] font-semibold text-white transition-opacity hover:opacity-90"
              : "flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white font-semibold text-gray-800 transition-colors hover:bg-gray-50"
          }
        >
          {option.provider === "google" ? <GoogleIcon /> : <FacebookIcon />}
          <span>{LABELS[option.provider]}</span>
        </a>
      ))}
      <h6 className="text-center text-[18px] font-semibold text-black">أو</h6>
    </div>
  );
}
