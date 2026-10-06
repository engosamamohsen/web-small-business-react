import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { A11y, Keyboard, Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import styles from "../style.module.css";
import { ProductType } from "@/lib/types";
import { collectProductImages, galleryAlt } from "./gallery-images";

interface ProductGalleryProps {
    product: ProductType;
}

/** True when the visitor asked the OS for less motion (slides then switch instantly). */
function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener?.("change", update);
        return () => query.removeEventListener?.("change", update);
    }, []);
    return reduced;
}

const frameClass = "relative aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200";

/**
 * Product page gallery: every product image (main image first) in a slider with
 * thumbnails (desktop), dots (mobile), swipe, keyboard, RTL arrows and zoom
 * (double-tap / double-click or the zoom button). A single image is shown plainly.
 */
export const ProductGallery = memo(({ product }: ProductGalleryProps) => {
    const images = useMemo(
        () => collectProductImages(product),
        [product?.images, product?.product_image, product?.gallery_images],
    );
    const reducedMotion = usePrefersReducedMotion();
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const mainRef = useRef<SwiperClass | null>(null);

    const total = images.length;
    if (total === 0) {
        return null;
    }

    // One image → a clean, still picture (no arrows, dots, thumbs or counter).
    if (total === 1) {
        return (
            <div className={frameClass}>
                <img
                    src={images[0]}
                    alt={galleryAlt(product?.name, 0, 1)}
                    width={800}
                    height={800}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-contain"
                />
            </div>
        );
    }

    const speed = reducedMotion ? 0 : 450;

    return (
        <div className="w-full">
            <div className={frameClass}>
                <Swiper
                    modules={[Navigation, Pagination, Thumbs, Keyboard, A11y, Zoom]}
                    onSwiper={(swiper) => {
                        mainRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.activeIndex);
                        setZoomed(false);
                    }}
                    onZoomChange={(_swiper, scale) => setZoomed(scale > 1)}
                    speed={speed}
                    spaceBetween={0}
                    slidesPerView={1}
                    grabCursor
                    navigation
                    pagination={{ clickable: true }}
                    keyboard={{ enabled: true, onlyInViewport: true }}
                    zoom={{ maxRatio: 2.5, toggle: true }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    a11y={{
                        prevSlideMessage: "الصورة السابقة",
                        nextSlideMessage: "الصورة التالية",
                        firstSlideMessage: "هذه أول صورة",
                        lastSlideMessage: "هذه آخر صورة",
                        paginationBulletMessage: "عرض الصورة {{index}}",
                        slideLabelMessage: "{{index}} من {{slidesLength}}",
                        containerRoleDescriptionMessage: "معرض صور المنتج",
                        itemRoleDescriptionMessage: "صورة",
                    }}
                    className={`${styles["product-swiper"]} h-full w-full`}
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={src} className="!flex items-center justify-center">
                            <div className="swiper-zoom-container">
                                <img
                                    src={src}
                                    alt={galleryAlt(product?.name, index, total)}
                                    width={800}
                                    height={800}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                    decoding="async"
                                    draggable={false}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            {index > 0 && <div className="swiper-lazy-preloader" />}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Position counter */}
                <span
                    className="pointer-events-none absolute start-3 top-3 z-10 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs font-medium tabular-nums text-white"
                    aria-hidden="true"
                    dir="ltr"
                >
                    {activeIndex + 1} / {total}
                </span>

                {/* Zoom toggle (double-tap / double-click on the image does the same) */}
                <button
                    type="button"
                    onClick={() => mainRef.current?.zoom?.toggle()}
                    aria-label={zoomed ? "تصغير الصورة" : "تكبير الصورة"}
                    title={zoomed ? "تصغير الصورة" : "تكبير الصورة (أو انقر مرتين على الصورة)"}
                    className="absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-white hover:text-[var(--main-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-color)] motion-reduce:transition-none"
                >
                    {zoomed ? <ZoomOut className="h-4 w-4" aria-hidden="true" /> : <ZoomIn className="h-4 w-4" aria-hidden="true" />}
                </button>
            </div>

            {/* Thumbnails (tablet / desktop) */}
            <Swiper
                modules={[Thumbs, A11y]}
                onSwiper={setThumbsSwiper}
                slidesPerView="auto"
                spaceBetween={10}
                speed={speed}
                watchSlidesProgress
                a11y={{ enabled: false }}
                className={`${styles["product-thumbs"]} mt-3 !hidden md:!block`}
            >
                {images.map((src, index) => (
                    <SwiperSlide key={src} className="!h-20 !w-20">
                        <button
                            type="button"
                            onClick={() => mainRef.current?.slideTo(index)}
                            aria-label={`عرض ${galleryAlt(product?.name, index, total)}`}
                            aria-current={activeIndex === index ? "true" : undefined}
                            className="block h-full w-full overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-color)] focus-visible:ring-offset-2 motion-reduce:transition-none"
                        >
                            <img
                                src={src}
                                alt=""
                                width={80}
                                height={80}
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});

ProductGallery.displayName = "ProductGallery";
