/**
 * OfferProducts Component - React Island
 *
 * Displays featured/promotional products in a Swiper carousel
 * Matches Next.js SwiperOffer behavior
 */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import type { Product } from '@/types/types';
import ProductCard from '@/components/Products/ProductCard';

interface OfferProductsProps {
  products: Product[];
}

export default function OfferProducts({ products }: OfferProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="container py-10">
        <h2 className="mb-8 text-2xl font-bold">العروض</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-100">
          <p className="text-gray-500">لا توجد عروض حالياً</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <h2 className="mb-8 text-2xl font-bold">العروض</h2>
      <div className="offer-swiper-container">
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
          loop={products.length > 4}
          className="offer-swiper min-h-[300px]"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="py-4">
              <div className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .offer-swiper .swiper-button-next,
        .offer-swiper .swiper-button-prev {
          color: var(--main-color);
          background: white;
          padding: 24px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .offer-swiper .swiper-button-next:after,
        .offer-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}
