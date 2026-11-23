"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";

import { FreeMode, Scrollbar } from "swiper/modules";
import { useSearchParams } from "@/lib/navigation";
import { cn } from "@/utils/utils";
import { scrollToProducts } from "./CategorySwiper";
import styles from "./style.module.css";
import { CategoryType } from "@/lib/types";
import { categoryParam, isSelectedCategory } from "@/lib/category/category-param";

import { useRouter } from "@/lib/navigation";


const SubCategories = ({
  categories,
  initialSubCategory = null,
}: {
  categories: CategoryType[];
  /** The page's ?sub_category= value. The server can't read the browser URL, so it renders this. */
  initialSubCategory?: string | null;
}) => {
  const searchParams = useSearchParams();
  // Same value on the server and in the hydrating browser, so a direct link shows its sub-category
  // selected in the first HTML; afterwards the URL decides.
  const selectedParam =
    typeof window === "undefined" ? initialSubCategory : searchParams.get("sub_category");

  const onSubCategoryClick = (category: CategoryType) => {
    const sp = new URLSearchParams(window.location.search);

    const current = sp.get("sub_category");
    // Safe when the sub-category has no slug (API slug: null): "<id>" instead of a crash
    const nextId = categoryParam(category);

    sp.set("page", "1");

    if (isSelectedCategory(current, category)) {
      // unselect subcategory - use pushState to avoid full reload
      sp.delete("sub_category");
      window.history.pushState({}, '', `${window.location.pathname}?${sp}`);
      return;
    }

    // Use pushState to update URL without full page reload
    sp.set("sub_category", nextId);
    window.history.pushState({}, '', `${window.location.pathname}?${sp}`);
    scrollToProducts({ elementId: "products", top: 270 });
  };

  if (!categories?.length) return null;

  return (
    <div className="w-full sm:w-fit sm:max-w-[440px]">
      <div className=" bg-white/80  max-md:w-full">
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          freeMode
          modules={[FreeMode, Scrollbar]}
          scrollbar={{ hide: false, draggable: true }}
          className={cn(styles["subcategories-swiper"], "!pb-3")}
        >
          {categories.map((item: any) => {
            const isActive = isSelectedCategory(selectedParam, item);

            return (
              <SwiperSlide key={item.id} className="!w-auto">
                <button
                  type="button"
                  onClick={() => onSubCategoryClick(item)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-semibold transition-all",
                    "rounded-full border bg-gray-100 text-gray-700",
                    "hover:bg-gray-200 hover:text-gray-900",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-color)]",
                    isActive &&
                    "border-[var(--main-color)] bg-[var(--main-color)] text-white shadow-sm"
                  )}
                >
                  <span className="block max-w-[150px] truncate text-ellipsis text-center">
                    {item.name}
                  </span>
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default SubCategories;
