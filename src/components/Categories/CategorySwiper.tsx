"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./style.module.css";
import "swiper/css";
import "swiper/css/navigation";
import Sticky from "react-sticky-el";
import { cn } from "@/utils/utils";
import { useSearchParams } from "next/navigation";

interface CategoryType {
  id: number;
  name: string;
  icon: string;
}

export default function CategorySwiper({ categories }: { categories: any }) {
  const searchParams = useSearchParams();
  const onCategoryClick = (categoryId: number) => {
    const searchParamsUrl = new URLSearchParams(window.location.search);
    searchParamsUrl.set("category", categoryId.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${searchParamsUrl}`,
    );

    scrollToProducts({ elementId: "products", top: 150 });
  };
  return (
    <Sticky topOffset={0} stickyClassName="z-[400] bg-gray-50">
      <div className="container">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 3.4,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 4.4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5.4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6.5,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 7.5,
              spaceBetween: 15,
            },
          }}
          loop={true}
          className={`${styles["categories-swiper"]} min-h-fit !py-6`}
        >
          {categories?.data?.data?.categories?.map((category: CategoryType) => (
            <SwiperSlide
              key={category.id}
              className={cn(
                searchParams.get("category") == category.id.toString() &&
                  "!border-[2px] border-[var(--main-color)] !shadow-lg",
                "group cursor-pointer overflow-hidden rounded-lg border bg-white py-4 shadow-md transition-shadow hover:shadow-lg",
              )}
            >
              <CategoryBox
                category={category}
                onClick={() => onCategoryClick(category.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Sticky>
  );
}

function CategoryBox({
  category,
  onClick,
}: {
  category: CategoryType;
  onClick: () => void;
}) {
  return (
    <div
      className="group flex cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <div
        className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200 shadow-md transition-all duration-200 group-hover:border-gray-300"
        style={{ backgroundColor: "#f8f4e5" }}
      >
        <Image
          src={category?.icon}
          alt={category?.name}
          width={60}
          height={60}
          className="object-cover transition-all duration-200 group-hover:brightness-90"
          priority={category.id === 1}
        />
      </div>
      <span className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900 sm:text-base">
        {category.name}
      </span>
    </div>
  );
}

const scrollToProducts = ({
  elementId,
  top = 0,
}: {
  elementId: string;
  top?: number;
}) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY; // Get the absolute position
    window.scrollTo({
      top: elementPosition - top, // Adjust by 100 pixels
      behavior: "smooth",
    });
  }
};
