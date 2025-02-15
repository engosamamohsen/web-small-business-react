"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./style.module.css";
import "swiper/css";
import "swiper/css/navigation";
import Sticky from "react-sticky-el";
import { cn } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryType {
  id: number;
  name: string;
  icon: string;
}

export default function CategorySwiper({ categories }: { categories: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onCategoryClick = (category: any) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (category.id.toString() === searchParams.get("category")) {
      searchParams.delete("category"); // Clear the category
      searchParams.delete("sub_category"); // Clear the sub-category
      searchParams.set("page", "1");

      router.push(`${window.location.pathname}?${searchParams}`, {
        scroll: false,
      });
    } else {
      searchParams.delete("sub_category"); // Clear the category
      searchParams.set("page", "1");

      searchParams.set("category", category.id.toString()); // Set the new category
      router.push(`${window.location.pathname}?${searchParams}`, {
        scroll: false,
      });
      scrollToProducts({ elementId: "products", top: 270 }); // Scroll to products section
    }

    // Update the URL without reloading the page
    // const newPathname = `${window.location.pathname}?${searchParams}`;
    // window.history.replaceState({}, "", newPathname);
  };

  return (
    <Sticky topOffset={0} stickyClassName="z-[400] bg-gray-50">
      <div className="container">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={
            searchParams.get("category")
              ? false
              : {
                  delay: 3000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }
          }
          onClick={(swiper) => {
            swiper.autoplay.stop();
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
            640: {
              slidesPerView: 5.4,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 8.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 10.5,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 14.5,
              spaceBetween: 15,
            },
          }}
          loop={true}
          className={`${styles["categories-swiper"]} min-h-fit`}
        >
          {categories?.data?.data?.categories?.map((category: CategoryType) => (
            <SwiperSlide
              key={category.id}
              className={cn("group cursor-pointer overflow-hidden py-4")}
            >
              <CategoryBox
                isActive={
                  searchParams.get("category") == category.id.toString()
                }
                category={category}
                onClick={() => onCategoryClick(category)}
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
  isActive,
}: {
  category: CategoryType;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <div
      className="group flex cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <div
        className={cn(
          "relative h-16 w-16 overflow-hidden rounded-full border-2 bg-white p-1 shadow-md transition-all duration-200",
          isActive && "border-[var(--main-color)]",
        )}
      >
        <Image
          src={category?.icon}
          alt={category?.name}
          width={60}
          height={60}
          className="rounded-full object-cover transition-all duration-200 group-hover:brightness-90"
          priority={category.id === 1}
        />
      </div>
      <span
        className={cn(
          "mt-3 text-center text-[14px] font-semibold text-gray-700",
          isActive && "text-[var(--main-color)]",
        )}
      >
        {category.name}
      </span>
    </div>
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
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY; // Get the absolute position
    window.scrollTo({
      top: elementPosition - top, // Adjust by 100 pixels
      behavior: "smooth",
    });
  }
};
