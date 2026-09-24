import { useEffect, useState } from "react";
import type { Probe } from "@/lib/tracking/providers";

export type DebugItem = { ref: string; type: string; label: string; probe: Probe };

type State = "waiting" | "loaded" | "ready" | "sending" | "added" | "blocked";

const TEXT: Record<State, string> = {
  waiting: "جارٍ التحميل…",
  loaded: "تم التحميل",
  ready: "يعمل ✓",
  sending: "يرسل البيانات ✓",
  added: "مضاف للصفحة ✓",
  blocked: "لم يتم التحميل",
};

const TONE: Record<State, string> = {
  waiting: "bg-slate-300",
  loaded: "bg-teal-500",
  ready: "bg-teal-600",
  sending: "bg-teal-600",
  added: "bg-teal-600",
  blocked: "bg-amber-500",
};

const GIVE_UP_MS = 10000;

/** What the browser has actually done for one service so far. */
function stateOf(probe: Probe, urls: string[], timedOut: boolean): State {
  const seen = (parts?: string[]) => !!parts?.length && urls.some((u) => parts.some((p) => u.includes(p)));
  if (probe.selector) {
    return document.querySelector(probe.selector) ? "added" : timedOut ? "blocked" : "waiting";
  }
  if (seen(probe.send)) return "sending";
  // Tag Manager sends nothing itself: loading is the success state.
  if (seen(probe.load)) return probe.send?.length ? "loaded" : "ready";
  return timedOut ? "blocked" : "waiting";
}

/**
 * Tracking test panel, shown with ?ct_debug=1 (the dashboard's "Test in my browser").
 * Watches the network requests each service makes, so the merchant sees it working
 * in their own browser, including when an ad blocker stops it.
 */
export default function TrackingDebugPanel({ items }: { items: DebugItem[] }) {
  const [states, setStates] = useState<Record<string, State>>({});
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const started = Date.now();
    const tick = () => {
      const urls = performance.getEntriesByType("resource").map((e) => e.name);
      const timedOut = Date.now() - started > GIVE_UP_MS;
      setStates(Object.fromEntries(items.map((i) => [i.ref, stateOf(i.probe, urls, timedOut)])));
    };
    tick();
    const timer = setInterval(tick, 700);
    const stop = setTimeout(() => clearInterval(timer), GIVE_UP_MS + 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
  }, [items]);

  if (!open) return null;

  const blocked = Object.values(states).includes("blocked");

  return (
    <aside
      dir="rtl"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[10000] w-[min(360px,calc(100vw-32px))] rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-2xl"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <b className="text-base">اختبار التتبع</b>
        <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق" className="rounded px-2 text-lg leading-none text-slate-500 hover:bg-slate-100">
          ×
        </button>
      </div>
      <p className="mb-3 text-xs text-slate-500">هذه اللوحة تظهر لك فقط لأنك فتحت المتجر من «اختبر في متصفحي».</p>

      {items.length === 0 ? (
        <p className="text-slate-600">لا توجد خدمات تتبع مفعّلة على متجرك.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const state = states[item.ref] ?? "waiting";
            return (
              <li key={item.ref} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${TONE[state]}`} aria-hidden="true" />
                  {item.label}
                </span>
                <span className={state === "blocked" ? "font-semibold text-amber-700" : "text-slate-600"}>{TEXT[state]}</span>
              </li>
            );
          })}
        </ul>
      )}

      {blocked && (
        <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs leading-5 text-amber-900">
          إذا لم يتم التحميل: أوقف مانع الإعلانات لهذا الموقع وأعد تحميل الصفحة، ثم تأكد من صحة المعرّف في لوحة التحكم.
        </p>
      )}
    </aside>
  );
}
