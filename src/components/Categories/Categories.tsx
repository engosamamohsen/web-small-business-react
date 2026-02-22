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
}

export default function Categories({
  categoriesData,
  isSuccess,
}: CategoriesProps) {
  const searchParams = useSearchParams();

  // Derive the selected category reactively from the URL param (client-side).
  // URL format: "{id}-{slug}", e.g. "1-test-first-category"
  const selectedCategory = useMemo(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam) return null;

    const categoryId = categoryParam.match(/^(\d+)/)?.[1];
    if (!categoryId) return null;

    return (
      categoriesData?.find((cat) => cat.id?.toString() === categoryId) ?? null
    );
  }, [searchParams, categoriesData]);

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

        <CategorySwiper categories={{ categoriesData, isSuccess }} />
      </section>

      {/* Subcategories — shown only when the selected category has subcategories */}
      {subcategories.length > 0 && (
        <section className="container flex items-center justify-between py-8 max-md:flex-col max-md:items-center max-md:gap-4">
          <div className="flex max-w-full items-center gap-3 max-md:w-full max-md:justify-center">
            <bdi className="text-sm font-bold text-gray-700 max-md:text-xs">
              اختر الفئة الفرعية :
            </bdi>
            <SubCategories categories={subcategories} />
          </div>
        </section>
      )}
    </>
  );
}
