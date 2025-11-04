import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../style.module.css";
import { ProductType } from "@/lib/types";

interface ProductGalleryProps {
  product: ProductType;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  return (
    <Swiper
      modules={[Navigation]}
      loop={true}
      navigation
      autoplay
      className={`${styles["product-swiper"]} !h-[608px] max-md:!h-80`}
    >
      {product?.gallery_images?.map((data) => (
        <SwiperSlide key={data}>
          <div className="relative aspect-square h-full w-full">
            <Image
              src={data || "/placeholder-image.jpg"}
              alt={product?.name || "Product image"}
              width={321}
              height={400}
              priority
              className="h-[608px] !w-full !max-w-full object-fill transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
