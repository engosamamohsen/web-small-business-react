// Home-page entry point to the meal helper (/helper). Rendered on the server
// only. It's a .tsx so Tailwind (which scans .tsx, not .astro) sees its classes.
export default function MealHelperPrompt() {
  return (
    <div className="mx-auto mt-6 max-w-7xl px-4" dir="rtl">
      <a
        href="/helper"
        className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 transition hover:ring-[var(--main-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-base font-bold text-slate-900 sm:text-lg">مش عارف تطلب إيه؟</span>
          <span className="text-sm text-slate-600">جاوب على كام سؤال ونرشحلك الأنسب ليك</span>
        </span>
        <span className="shrink-0 rounded-lg bg-[var(--main-color)] px-4 py-2 text-sm font-semibold text-white">ساعدني أختار</span>
      </a>
    </div>
  );
}
