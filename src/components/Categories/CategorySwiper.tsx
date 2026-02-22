"use client";

import Image from "@/components/common/Image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./style.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/utils/utils";
import { useSearchParams } from "@/lib/navigation";
import React from 'react';
import { CategoryType } from "@/lib/types";


export default function CategorySwiper({ categories }: { categories: any }) {
  const searchParams = useSearchParams();

  // Only enable loop if we have enough slides (more than max slidesPerView)
  const categoryCount = categories?.categoriesData?.length || 0;
  const enableLoop = categoryCount > 14;

  const onCategoryClick = (category: CategoryType) => {
    const sp = new URLSearchParams(window.location.search);
    const current = sp.get("category");
    const nextId = category.id?.toString() + "-" + category.slug.toString();

    if (nextId === current) {
      // Unselect category
      sp.delete("category");
      sp.delete("sub_category");
      sp.set("page", "1");
      // Use pushState to update URL without full page reload
      window.history.pushState({}, '', `${window.location.pathname}?${sp}`);
      return;
    }

    // Switch category
    sp.delete("sub_category");
    sp.set("page", "1");
    sp.set("category", nextId);
    // alert("sp:"+window.location.pathname);

    // Use pushState to update URL without full page reload
    window.history.pushState({}, '', `${window.location.pathname}?${sp}`);
    scrollToProducts({ elementId: "products", top: 270 });
  };

  return (
    <div className={cn("relative", styles["fade-edges"])}>
      <div className="container py-2">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={
            searchParams.get("category")
              ? false
              : {
                delay: 2800,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }
          }
          onTouchStart={(swiper) => swiper.autoplay?.stop()}
          onClick={(swiper) => swiper.autoplay?.stop()}
          breakpoints={{
            320: { slidesPerView: 3.2, spaceBetween: 8 },
            420: { slidesPerView: 4.2, spaceBetween: 10 },
            640: { slidesPerView: 6.2, spaceBetween: 12 },
            768: { slidesPerView: 8.2, spaceBetween: 14 },
            1024: { slidesPerView: 10.2, spaceBetween: 14 },
            1280: { slidesPerView: 12.2, spaceBetween: 16 },
            1536: { slidesPerView: 14.2, spaceBetween: 18 },
          }}
          loop={enableLoop}
          className={cn(styles["categories-swiper"], "min-h-fit")}
        >
          {categories?.categoriesData?.map((category: CategoryType) => {
            const isActive =
              searchParams.get("category") == category.id?.toString() + "-" + category.slug.toString();

            return (
              <SwiperSlide
                key={category.id}
                className="group py-3 max-md:py-2"
              >
                <CategoryBox
                  category={category}
                  isActive={isActive}
                  onClick={() => onCategoryClick(category)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

function CategoryBox({
  category,
  onClick,
  isActive,
}: {
  category: CategoryType;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center gap-2 outline-none"
      aria-pressed={isActive}
      aria-label={`Category ${category.name}`}
      suppressHydrationWarning
    >
      <div
        className={cn(
          "relative grid place-items-center rounded-full bg-white transition-all duration-200",
          // size responsive
          "h-[68px] w-[68px] max-md:h-[56px] max-md:w-[56px]",
          // base ring + shadow
          "ring-1 ring-gray-200 shadow-sm",
          // hover
          "group-hover:-translate-y-0.5 group-hover:shadow-md",
          // active
          isActive &&
          "ring-2 ring-[var(--main-color)] shadow-[0_6px_18px_rgba(0,0,0,0.15)] bg-orange-50/40"
        )}
        suppressHydrationWarning
      >
        <div className="relative h-[85%] w-[85%] overflow-hidden rounded-full">
          <Image
            src={category.icon}
            alt={category.name}
            fill
            sizes="80px"
            className="object-cover transition duration-200 group-hover:brightness-95"
            priority={category.id === 1}
          />
        </div>
      </div>

      <span
        className={cn(
          "max-w-[88px] text-center text-[13.5px] font-semibold leading-snug text-gray-800",
          "max-md:max-w-[72px] max-md:text-[12px]",
          isActive && "text-[var(--main-color)]"
        )}
        suppressHydrationWarning
      >
        {category.name}
      </span>
    </button>
  );
}

export const scrollToProducts = ({
  elementId,
  top = 0,
}: {
  elementId: string;
  top?: number;
}) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: elementPosition - top,
    behavior: "smooth",
  });
};
