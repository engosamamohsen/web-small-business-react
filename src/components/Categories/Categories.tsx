"use client";

import CategorySwiper from "./CategorySwiper";
import SubCategories from "./SubCategories";
import React, { useMemo } from "react";
import { useSearchParams } from "@/lib/navigation";
import { CategoryType } from "@/lib/types";

interface CategoriesProps {
  categoriesData: CategoryType[];
  isSuccess: boolean;
  // targetFilterCategory is kept for SSR compatibility but not used client-side
  targetFilterCategory?: any;
  /** The page's ?category= and ?sub_category= values. The server can't read the browser URL, so it renders these. */
  initialCategory?: string | null;
  initialSubCategory?: string | null;
}

export default function Categories({
  categoriesData,
  isSuccess,
  initialCategory = null,
  initialSubCategory = null,
}: CategoriesProps) {
  const searchParams = useSearchParams();
  // Same value on the server and in the hydrating browser (as in Themed/CategoryNav), so a direct
  // link renders its category and sub-categories in the first HTML; afterwards the URL decides.
  const selectedParam =
    typeof window === "undefined" ? initialCategory : searchParams.get("category");

  // Derive the selected category from the URL param.
  // URL format: "{id}-{slug}", e.g. "1-test-first-category", or just "{id}" (no slug)
  const selectedCategory = useMemo(() => {
    if (!selectedParam) return null;

    const categoryId = selectedParam.match(/^(\d+)/)?.[1];
    if (!categoryId) return null;

    return (
      categoriesData?.find((cat) => cat.id?.toString() === categoryId) ?? null
    );
  }, [selectedParam, categoriesData]);

  const subcategories = selectedCategory?.subcategories ?? [];

  if (!isSuccess) return null;

  return (
    <>
      {/* Featured header + categories swiper */}
      <section className="relative overflow-visible bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <h2 className="pt-8 text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:pt-6 max-md:text-xl">
            اكتشف الفئات
          </h2>
        </div>

        <CategorySwiper categories={{ categoriesData, isSuccess }} initialCategory={initialCategory} />
      </section>

      {/* Subcategories — shown only when the selected category has subcategories */}
      {subcategories.length > 0 && (
        <section className="container flex items-center justify-between py-8 max-md:flex-col max-md:items-center max-md:gap-4">
          <div className="flex max-w-full items-center gap-3 max-md:w-full max-md:justify-center">
            <bdi className="text-sm font-bold text-gray-700 max-md:text-xs">
              اختر الفئة الفرعية :
            </bdi>
            <SubCategories categories={subcategories} initialSubCategory={initialSubCategory} />
          </div>
        </section>
      )}
    </>
  );
}
