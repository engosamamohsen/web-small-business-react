"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Skeleton } from "primereact/skeleton";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import styles from "./style.module.css";
import "./main.css";
import HeroContent from "./HeroContent";

export default function SwiperBanner({ response }: { response: any }) {
  return (
    <>
      <div className={styles.heroContainer}>
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          loop={true}
          className={`heroSwiper ${styles.heroSwiper} `}
        >
          {response?.data?.data?.length ? (
            response?.data?.data?.map((slide: any, index: number) => {
              return (
                <SwiperSlide key={slide.id}>
                  <div className={styles.slideContent}>
                    {/* Background Image */}
                    <div className={styles.imageContainer}>
                      <Image
                        src={slide.image}
                        alt="Delicious food"
                        width={800}
                        height={800}
                        style={{
                          objectFit: "contain",
                          objectPosition: "center top",
                          minWidth: "100%",
                          minHeight: "100%",
                        }}
                        priority={index === 0}
                      />
                      {/* Gradient Overlay */}
                      <div
                        className={` ${styles.gradientOverlay} bg-gradient-to-t from-[color-mix(in_srgb,var(--main-color)_80%,transparent)] to-transparent`}
                        // style={{
                        //   background: `linear-gradient(to top, ${globalData.mainColor}CC, transparent)`,
                        // }}
                      />
                    </div>

                    {/* Content */}
                    <HeroContent data={slide} />
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
    </>
  );
}
