"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";

import { FreeMode } from "swiper/modules";
import { Scrollbar } from "swiper/modules";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/utils";
import { scrollToProducts } from "./CategorySwiper";

const SubCategories = ({ categories }: { categories: any }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onCategoryClick = (category: any) => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(category, "sub_category");
    if (category.id.toString() === searchParams.get("sub_category")) {
      searchParams.set("page", "1");
      searchParams.delete("sub_category"); // Clear the category
      router.push(`${window.location.pathname}?${searchParams}`, {
        scroll: false,
      });
    } else {
      searchParams.set("page", "1");
      searchParams.set("sub_category", category.id.toString()); // Set the new category
      router.push(`${window.location.pathname}?${searchParams}`, {
        scroll: false,
      });
      scrollToProducts({ elementId: "products", top: 270 }); // Scroll to products section
    }
  };

  return (
    <div className="w-fit max-w-full sm:max-w-[350px]">
      <Swiper
        slidesPerView={2.6} // Number of slides visible at once
        breakpoints={{
          480: {
            slidesPerView: 4.3,
          },
          640: {
            slidesPerView: 3.3,
          },
        }}
        spaceBetween={10} // Space between slides
        freeMode={true} // Enable free mode
        modules={[FreeMode, Scrollbar]} // Add required modules
        scrollbar={{
          hide: false,
        }}
        className="my-swiper-container !pb-4"
      >
        {categories?.map((item: any) => (
          <SwiperSlide key={item.id} className="min-w-fit">
            <h5
              onClick={() => onCategoryClick(item)}
              className={cn(
                "slide-content flex min-w-[90px] cursor-pointer items-center justify-center truncate text-nowrap rounded-sm border border-gray-300 bg-slate-200 px-2 py-1 text-sm",
                searchParams.get("sub_category") == item.id &&
                  "border-[var(--main-color)] text-[var(--main-color)]",
              )}
            >
              {item.name}{" "}
            </h5>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SubCategories;
