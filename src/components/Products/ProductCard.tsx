/**
 * ProductCard Component - React Island
 *
 * Individual product card with image, name, price
 * Matches Next.js Product component behavior with add to cart button
 */
import { useState } from 'react';
import { ShoppingCart, Flame, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { fetchHook } from '@/lib/fetch-hook';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types/types';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { incrementCartCount } = useCartStore();

  const discount = product.discount ? parseInt(product.discount) : 0;
  const hasDiscount = discount > 0;
  const isVariation = product.is_variation;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = Cookies.get('app_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (isVariation) {
      window.location.href = `/products/${product.id}`;
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('product_id', product.id.toString());
      formData.append('quantity', '1');

      const response = await fetchHook({
        url: 'v1/basket/add',
        init: {
          method: 'POST',
          body: formData,
          headers: {},
        },
        token,
      });

      if (response.ok) {
        toast.success('تم إضافة المنتج للسلة');
        incrementCartCount();
      } else {
        toast.error(response.error || 'حدث خطأ');
      }
    } catch (error: any) {
      toast.error(error?.message || 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group min-h-[350px]">
      <div className="relative h-fit">
        <a href={`/products/${product.id}`} className="relative block h-fit">
          {product.main_image ||
          product.gallery_images?.[0] ||
          product.image ? (
            <img
              src={
                product.main_image ||
                product.gallery_images?.[0] ||
                product.image
              }
              alt={product.name || ''}
              className="h-auto w-full max-w-full object-center transition-all duration-200 group-hover:brightness-90"
              loading="lazy"
            />
          ) : (
            <div className="flex h-52 w-full items-center justify-center bg-gray-200">
              <span className="text-sm text-gray-500">لا توجد صورة</span>
            </div>
          )}
        </a>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute right-4 top-4">
            <Flame fill="red" className="h-8 w-8 text-transparent" />
          </div>
        )}

        {/* Add to Cart Button */}
        {showAddToCart && !isVariation && (
          <button
            aria-label="Add product to cart"
            disabled={isLoading}
            onClick={handleAddToCart}
            className="absolute bottom-2 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[var(--main-color)]" />
            ) : (
              <ShoppingCart className="h-6 w-6 text-[var(--main-color)]" />
            )}
          </button>
        )}

        {/* Not Available Overlay */}
        {product.is_available === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-gray-800 px-3 py-1 text-sm text-white">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-start gap-2 px-4 pb-6 pt-4">
        <h3 className="my-2 line-clamp-2 text-sm font-semibold sm:text-base">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {hasDiscount ? (
              <>
                <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
                  {product.price_after} ج.م
                </span>
                {product.price_after !== product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.price} ج.م
                  </span>
                )}
                <span className="text-sm font-bold text-green-600">
                  {product.discount}%
                </span>
              </>
            ) : (
              <span className="ml-1 text-lg font-bold text-orange-500 sm:text-xl">
                {product.price} ج.م
              </span>
            )}
          </div>
        </div>

        <a
          href={`/products/${product.id}`}
          className="text-sm hover:text-[var(--second-color)] hover:underline"
        >
          عرض المزيد
        </a>
      </div>
    </div>
  );
}
