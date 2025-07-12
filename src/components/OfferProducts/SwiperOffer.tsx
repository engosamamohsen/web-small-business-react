"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Skeleton } from "primereact/skeleton";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import styles from "./style.module.css";
import { Product } from "../product/Product";

export default function SwiperBanner({ response }: { response: any }) {
  return (
    <div className="">
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
            slidesPerView: 2.4,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3.4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4.5,
            spaceBetween: 26,
          },
        }}
        loop={true}
        className={` ${styles["offer-swiper"]} min-h-[300px]`}
      >
        {response?.data?.data?.length ? (
          response?.data?.data?.map((product: any) => {
            return (
              <SwiperSlide key={product.id} className="py-4">
                <div className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
                  <Product product={product} />
                </div>
              </SwiperSlide>
            );
          })
        ) : (
          <>
            <SwiperSlide>
              <Skeleton width="100%" height="100%"></Skeleton>
            </SwiperSlide>
            <SwiperSlide>
              <Skeleton width="100%" height="100%"></Skeleton>
            </SwiperSlide>
          </>
        )}
      </Swiper>
    </div>
  );
}
