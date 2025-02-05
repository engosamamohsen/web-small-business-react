"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import styles from "./style.module.css";
import "swiper/css";
import "swiper/css/navigation";

const categories = [
  {
    id: 1,
    name: "حلويات",
    image: "/images/food.jpg",
  },
  {
    id: 2,
    name: "كندي",
    image: "/images/food.jpg",
  },
  {
    id: 3,
    name: "فراخ",
    image: "/images/food.jpg",
  },
  {
    id: 4,
    name: "شاورما",
    image: "/images/food.jpg",
  },
  {
    id: 5,
    name: "كشري",
    image: "/images/food.jpg",
  },
  {
    id: 6,
    name: "كل الأطباق",
    image: "/images/food.jpg",
  },
  {
    id: 1,
    name: "حلويات",
    image: "/images/food.jpg",
  },
  {
    id: 2,
    name: "كندي",
    image: "/images/food.jpg",
  },
  {
    id: 3,
    name: "فراخ",
    image: "/images/food.jpg",
  },
  {
    id: 4,
    name: "شاورما",
    image: "/images/food.jpg",
  },
  {
    id: 5,
    name: "كشري",
    image: "/images/food.jpg",
  },
  {
    id: 6,
    name: "كل الأطباق",
    image: "/images/food.jpg",
  },
];

export default function Categories() {
  return (
    <section className="py-8 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-right text-gray-800">
          اكتشف الفئات
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.4,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3.4,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 4.4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 6.5,
              spaceBetween: 26,
            },
          }}
          loop={true}
          className={styles["categories-swiper"]}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="border py-4 rounded-sm">
              <div className="flex flex-col items-center cursor-pointer group ">
                <div
                  className="w-28 h-28 relative rounded-full border-2 border-gray-200 overflow-hidden shadow-md group-hover:border-gray-300 transition-all duration-200"
                  style={{ backgroundColor: "#f8f4e5" }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={112}
                    height={112}
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    priority={category.id === 1}
                  />
                </div>
                <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
