import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { memo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../style.module.css";
import { ProductType } from "@/lib/types";

interface ProductGalleryProps {
    product: ProductType;
}

export const ProductGallery = memo(({ product }: ProductGalleryProps) => {
    // Only enable loop if there are enough images (2 or more)
    const imageCount = product?.gallery_images?.length || 0;
    const enableLoop = imageCount >= 2;

    return (
        <Swiper
            modules={[Navigation]}
            loop={enableLoop}
            navigation
            autoplay
            className={`${styles["product-swiper"]} !h-[608px] max-md:!h-80`}
        >
            {product?.gallery_images?.map((data, index) => (
                <SwiperSlide key={data}>
                    <div className="relative aspect-square h-full w-full">
                        <img
                            src={data || "/placeholder-image.jpg"}
                            alt={product?.name ? `صورة المنتج ${product.name}` : "صورة المنتج"}
                            width={321}
                            height={400}
                            loading={index === 0 ? "eager" : "lazy"}
                            className="h-[608px] !w-full !max-w-full object-contain transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
});

ProductGallery.displayName = "ProductGallery";
