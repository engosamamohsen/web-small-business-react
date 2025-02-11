"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";

import { FreeMode } from "swiper/modules";
import { Scrollbar } from "swiper/modules";
import { useSearchParams } from "next/navigation";

const SubCategories = ({ categories }: { categories: any }) => {
  console.log(categories, "categories");
  const searchParams = useSearchParams();
  if (searchParams.get("sub_category") == null) {
    console.log("no sub category");
  } else {
    console.log("sub category", searchParams.get("sub_category"));
  }
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
            <h5 className="slide-content flex min-w-[90px] cursor-pointer items-center justify-center truncate text-nowrap rounded-sm border border-gray-300 bg-slate-200 px-2 py-1 text-sm">
              {item.name}{" "}
            </h5>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SubCategories;
