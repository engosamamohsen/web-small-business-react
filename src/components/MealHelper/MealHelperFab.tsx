import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import MealHelper from "./MealHelper";
import type { MenuDish } from "@/lib/meal-helper/engine";

// ─── Floating "help me choose" button, on every storefront page ──────────────
//
// Sits opposite the WhatsApp button (bottom-right; WhatsApp is bottom-left)
// and opens the meal helper in a popup. The menu is fetched from
// /api/helper-menu only when a customer opens it, so pages don't pay for it.

type Menu = { dishes: MenuDish[]; defaultImage?: string | null };
type Load = { state: "idle" | "loading" | "error" } | { state: "ready"; menu: Menu };

interface Props {
  /** Raise the button above the mobile add-to-cart bar on product pages */
  lifted?: boolean;
}

export default function MealHelperFab({ lifted = false }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState<Load>({ state: "idle" });
  // Remounting MealHelper on each open starts the questions over.
  const [session, setSession] = useState(0);

  const fetchMenu = async () => {
    setLoad({ state: "loading" });
    try {
      const res = await fetch("/api/helper-menu", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const menu = (await res.json()) as Menu;
      setLoad({ state: "ready", menu });
    } catch {
      setLoad({ state: "error" });
    }
  };

  const show = () => {
    setSession((s) => s + 1);
    setOpen(true);
    if (load.state === "idle" || load.state === "error") fetchMenu();
    try {
      (window as any).fbq?.("trackCustom", "helper_open");
      (window as any).ttq?.track?.("helper_open");
      (window as any).gtag?.("event", "helper_open");
    } catch {
      // tracking must never block the popup
    }
  };

  // Drive the native <dialog>: it traps focus, closes on Esc and restores focus.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className={`group fixed right-6 z-50 flex h-14 items-center gap-2 rounded-full bg-[var(--main-color)] px-4 text-white shadow-lg transition hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--main-color)] sm:right-8 ${
          lifted ? "bottom-28 md:bottom-8" : "bottom-6 sm:bottom-8"
        }`}
      >
        <Sparkles className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="text-sm font-bold" dir="rtl">
          ساعدني أختار
        </span>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false); // click on the backdrop
        }}
        aria-label="ساعدني أختار"
        className="m-0 mt-auto w-full max-w-none rounded-t-3xl bg-slate-50 p-0 backdrop:bg-black/40 sm:m-auto sm:max-w-xl sm:rounded-3xl"
      >
        {open && (
          <div dir="rtl" className="flex max-h-[88dvh] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
              <p className="text-base font-bold text-slate-900">مش عارف تطلب إيه؟</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-5 sm:px-6">
              {load.state === "ready" ? (
                <MealHelper key={session} dishes={load.menu.dishes} defaultImage={load.menu.defaultImage ?? undefined} />
              ) : load.state === "error" ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <p className="text-slate-600">مقدرناش نحمّل المنيو دلوقتي.</p>
                  <button
                    type="button"
                    onClick={fetchMenu}
                    className="rounded-lg bg-[var(--main-color)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    حاول تاني
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 py-2" aria-busy="true" aria-label="جاري تحميل المنيو">
                  <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-[72px] animate-pulse rounded-xl bg-slate-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
