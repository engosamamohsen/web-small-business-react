"use client";

import Image from "@/components/common/Image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import styles from "./style.module.css";
import "./main.css";
import HeroContent from "./HeroContent";

type SwiperBannerProps = {
  response: {
    bannerData?: any[];
    [key: string]: any;
  };
};

export default function SwiperBanner({ response }: SwiperBannerProps) {
  const slides = response?.bannerData || [];
  const hasMultipleSlides = slides.length > 1;

  if (!slides.length) return null;

  return (
    <section
      className={styles.heroContainer}
      aria-label="Promotional banners"
    >
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        autoHeight={true}
        pagination={
          hasMultipleSlides
            ? {
              clickable: true,
            }
            : false
        }
        autoplay={{
          delay: 50000000,
          disableOnInteraction: true,
        }}
        loop={hasMultipleSlides}
        navigation={
          hasMultipleSlides
            ? {
              nextEl: ".hero-next",
              prevEl: ".hero-prev",
            }
            : false
        }
        className={`heroSwiper ${styles.heroSwiper}`}
      >
        {slides.map((slide: any, index: number) => (
          <SwiperSlide key={slide.id ?? index}>
            <div className={styles.slideContent}>
              <div className={styles.imageContainer}>
                <Image
                  src={slide.image}
                  alt={slide.title ? `صورة إعلان ${slide.title}` : "صورة إعلانية"}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  // First banner is the likely LCP element — hint the browser to
                  // fetch it ahead of lazy/below-the-fold images.
                  fetchPriority={index === 0 ? "high" : undefined}
                  className={styles.image}
                />
                <div className={styles.gradientOverlay} />
              </div>

              <HeroContent data={slide} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {hasMultipleSlides && (
        <>
          {/* LEFT → swipe LEFT */}
          <button
            className={`${styles.navArrow} ${styles.navPrev} hero-next`}
            aria-label="Next banner"
            type="button"
          >
            <span className={styles.navIcon} aria-hidden="true">
              ›
            </span>
          </button>

          {/* RIGHT → swipe RIGHT */}
          <button
            className={`${styles.navArrow} ${styles.navNext} hero-prev`}
            aria-label="Previous banner"
            type="button"
          >
            <span className={styles.navIcon} aria-hidden="true">
              ‹
            </span>
          </button>
        </>
      )}
    </section>
  );
}
