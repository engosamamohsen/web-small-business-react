"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Skeleton } from "primereact/skeleton";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import styles from "./style.module.css";
import { Product } from "../Product/Product";

export default function SwiperOffer({ response }: { response: any }) {
  const products = response?.data?.data ?? [];
  const hasProducts = products.length > 0;

  return (
    <div>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={hasProducts && products.length > 1} // ✅ only if >1 card
        autoplay={
          hasProducts
            ? {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
            : false
        }
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1.8,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 2.6,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 22,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        loop={hasProducts && products.length > 4}
        watchOverflow={true} // ✅ detect “no overflow” cases
        className={`${styles["offer-swiper"]} min-h-[300px]`}
      >
        {hasProducts ? (
          products.map((product: any) => (
            <SwiperSlide key={product.id} className={styles.slide}>
              <div className={styles.card}>
                <Product product={product} />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <>
            <SwiperSlide className={styles.slide}>
              <div className={styles.skeletonCard}>
                <Skeleton width="100%" height="100%" />
              </div>
            </SwiperSlide>
            <SwiperSlide className={styles.slide}>
              <div className={styles.skeletonCard}>
                <Skeleton width="100%" height="100%" />
              </div>
            </SwiperSlide>
          </>
        )}
      </Swiper>
    </div>
  );
}
