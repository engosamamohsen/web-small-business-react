import CategorySwiper from "./CategorySwiper";
import SubCategories from "./SubCategories";
import React from 'react';
// import { revalidateTime } from "@/constants/constansts";


interface CategoriesProps {
  categoriesData: any[];
  isSuccess: boolean;
  targetFilterCategory: {
    isFilterCategory: boolean;
    isSubCategory: boolean;
    name?: string;
    subcategories?: any[];
  } | null;
}

export default function Categories({
  categoriesData,
  isSuccess,
  targetFilterCategory,
}: CategoriesProps) {
  if (!isSuccess) return null;

  return (
    <>
      {/* Featured header + categories swiper */}
      <section className="relative overflow-visible bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <h2 className="pt-8 text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:pt-6 max-md:text-xl">
            اكتشف الفئات
          </h2>
          {/* <p className="mt-1 text-right text-sm text-gray-500 max-md:text-xs">
            اختار الفئة اللي تدور عليها بسرعة
          </p> */}
        </div>

        <CategorySwiper categories={{ categoriesData, isSuccess }} />
      </section>

      {/* Title + optional subcategories */}
      <section className="container flex items-center justify-between py-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <h2 className="text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:text-xl">
          {targetFilterCategory?.isFilterCategory
            ? targetFilterCategory?.name
            : "المنتجات"}
        </h2>

        {targetFilterCategory?.isSubCategory && (
          <div className="flex max-w-full items-center gap-3 max-md:w-full max-md:flex-col max-md:items-start">
            <bdi className="text-sm font-bold text-gray-700 max-md:text-xs">
              اختر الفئة الفرعية :
            </bdi>

            <SubCategories categories={targetFilterCategory?.subcategories || []} />
          </div>
        )}
      </section>
    </>
  );
}


