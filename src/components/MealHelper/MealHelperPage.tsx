import MealHelper from "./MealHelper";
import type { MenuDish } from "@/lib/meal-helper/engine";

// Body of the /helper page. A .tsx so Tailwind (which scans .tsx, not .astro) sees its classes.
export default function MealHelperPage({
  storeName,
  dishes,
  defaultImage,
}: {
  storeName: string;
  dishes: MenuDish[];
  defaultImage?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12" dir="rtl">
      <div className="mx-auto mb-6 flex max-w-xl flex-col gap-2 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">مش عارف تطلب إيه؟</h1>
        <p className="text-slate-600">جاوب على كام سؤال سريع ونرشحلك الأنسب من منيو {storeName}.</p>
      </div>
      <MealHelper dishes={dishes} defaultImage={defaultImage} />
    </div>
  );
}
