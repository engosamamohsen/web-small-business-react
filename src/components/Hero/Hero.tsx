/**
 * Hero Component - React Island
 *
 * Banner carousel using Swiper
 * Displays promotional banners fetched from API
 * Matches Next.js SwiperBanner with HeroContent overlay
 */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface Banner {
  id: string;
  image: string;
  title?: string;
  desc?: string;
  type?: 'product' | 'category' | 'external';
  link?: string;
}

interface HeroProps {
  banners: Banner[];
}

function HeroContent({ data }: { data: Banner }) {
  const linkLocation =
    data?.type === 'product'
      ? `/products/${data?.id}`
      : data?.type === 'category'
        ? `/?category=${data?.id}`
        : data?.type === 'external'
          ? data?.link || ''
          : '/';

  return (
    <a
      href={linkLocation}
      aria-label={`Navigate to ${data.title}`}
      className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center"
    >
      {data.title && (
        <h1 className="text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {data.title}
        </h1>
      )}
      {data.desc && (
        <p className="max-w-2xl text-sm text-white opacity-90 drop-shadow md:text-base lg:text-lg">
          {data.desc}
        </p>
      )}
    </a>
  );
}

export default function Hero({ banners }: HeroProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="heroContainer relative w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        loop={banners.length > 1}
        className="heroSwiper h-[300px] w-full md:h-[400px] lg:h-[500px]"
      >
        {banners.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title || 'Banner'}
                  className="h-full w-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--main-color)_80%,transparent)] to-transparent" />
              </div>

              {/* Content Overlay */}
              <HeroContent data={slide} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .heroSwiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .heroSwiper .swiper-pagination-bullet-active {
          background: var(--main-color);
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
