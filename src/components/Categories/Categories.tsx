/**
 * Categories Component - React Island
 *
 * Product categories navigation with Swiper carousel
 * Matches Next.js CategorySwiper behavior
 */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { cn } from '@/utils/utils';

interface Category {
  id: string | number;
  name: string;
  icon?: string;
  image?: string;
  products_count?: number;
  subcategories?: Category[];
}

interface CategoriesProps {
  categories: Category[];
  selectedCategory?: string;
}

function CategoryBox({
  category,
  onClick,
  isActive,
}: {
  category: Category;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <div
      className="group flex cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <div
        className={cn(
          'relative h-16 w-16 overflow-hidden rounded-full border-2 bg-white p-1 shadow-md transition-all duration-200',
          isActive ? 'border-[var(--main-color)]' : 'border-transparent'
        )}
      >
        <img
          src={category.icon || category.image}
          alt={category.name}
          className="h-full w-full rounded-full object-cover transition-all duration-200 group-hover:brightness-90"
          loading="lazy"
        />
      </div>
      <span
        className={cn(
          'mt-3 text-center text-[14px] font-semibold text-gray-700',
          isActive && 'text-[var(--main-color)]'
        )}
      >
        {category.name}
      </span>
    </div>
  );
}

function scrollToProducts(elementId: string, top: number = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - top,
      behavior: 'smooth',
    });
  }
}

export default function Categories({
  categories,
  selectedCategory,
}: CategoriesProps) {
  const categoryList = Array.isArray(categories) ? categories : [];

  if (categoryList.length === 0) {
    return null;
  }

  const handleCategoryClick = (categoryId: string | number) => {
    const url = new URL(window.location.href);
    const categoryIdStr = String(categoryId);

    if (categoryIdStr === selectedCategory) {
      url.searchParams.delete('category');
      url.searchParams.delete('sub_category');
    } else {
      url.searchParams.delete('sub_category');
      url.searchParams.set('category', categoryIdStr);
      url.searchParams.set('page', '1');
    }

    window.location.href = url.toString();

    if (categoryIdStr !== selectedCategory) {
      setTimeout(() => scrollToProducts('products', 270), 100);
    }
  };

  // Find selected category for subcategories (compare as strings)
  const selectedCategoryData = categoryList.find(
    (c) => String(c.id) === selectedCategory
  );
  const hasSubcategories =
    selectedCategoryData?.subcategories &&
    selectedCategoryData.subcategories.length > 0;

  return (
    <>
      <div className="relative overflow-visible bg-gray-50">
        <div className="container">
          <h2 className="pt-6 text-right text-2xl font-bold text-gray-800">
            اكتشف الفئات
          </h2>
        </div>
        <div className="sticky top-0 z-[400] bg-gray-50">
          <div className="container">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={
                selectedCategory
                  ? false
                  : {
                      delay: 3000,
                      disableOnInteraction: true,
                      pauseOnMouseEnter: true,
                    }
              }
              breakpoints={{
                320: { slidesPerView: 3.4, spaceBetween: 10 },
                480: { slidesPerView: 4.4, spaceBetween: 10 },
                640: { slidesPerView: 5.4, spaceBetween: 15 },
                768: { slidesPerView: 8.5, spaceBetween: 20 },
                1024: { slidesPerView: 10.5, spaceBetween: 15 },
                1280: { slidesPerView: 14.5, spaceBetween: 15 },
              }}
              loop={categoryList.length > 10}
              className="categories-swiper min-h-fit py-4"
            >
              {categoryList.map((category) => (
                <SwiperSlide
                  key={category.id}
                  className="group cursor-pointer overflow-hidden py-4"
                >
                  <CategoryBox
                    isActive={selectedCategory === String(category.id)}
                    category={category}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Header with category name and subcategories */}
      <div className="container flex items-center justify-between py-8 max-md:flex-col max-md:justify-center max-md:gap-4">
        <h2 className="text-right text-2xl font-bold text-gray-800">
          {selectedCategoryData ? selectedCategoryData.name : 'المنتجات'}
        </h2>

        {hasSubcategories && (
          <div className="flex max-w-full items-center justify-center gap-2 max-md:flex-col">
            <bdi className="mb-4 text-sm font-bold">اختر الفئة الفرعية:</bdi>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryData.subcategories!.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('sub_category', String(sub.id));
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                  }}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .categories-swiper .swiper-button-next,
        .categories-swiper .swiper-button-prev {
          color: var(--main-color);
          background: white;
          padding: 20px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .categories-swiper .swiper-button-next:after,
        .categories-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
