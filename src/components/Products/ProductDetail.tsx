/**
 * ProductDetail Component - React Island
 * Matches Next.js DetailPage with full UI and functionality
 */
import { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { cartCountAtom } from '@/stores/cart';
import { fetchHook } from '@/lib/fetch-hook';
import type {
  Product,
  SizeOption,
  ColorOption,
  Variation,
  TechnicalInfo,
  FormattedVariation,
  FormattedVariations,
} from '@/types/types';
import { cn } from '@/utils/utils';

const CURRENCY = 'جنية';

interface ProductDetailProps {
  product: Product;
  settings?: any;
}

// Helper function to calculate discounted price
function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export default function ProductDetail({
  product,
  settings,
}: ProductDetailProps) {
  const token = Cookies.get('app_token');
  const [, setCartCount] = useAtom(cartCountAtom);

  // Product options state
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [rawSelectedVariations, setRawSelectedVariations] = useState<
    Record<string, string[]>
  >({});
  const [count, setCount] = useState(1);
  const [productNote, setProductNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const basePrice = product?.price_after || product.price;
  const images = product?.gallery_images ||
    product?.gallery ||
    product?.images || [product?.logo || product?.image];

  // Initialize variations
  useEffect(() => {
    if (product?.variations) {
      const initialVariations: Record<string, string[]> = {};
      product.variations.forEach((variation) => {
        if (variation.enable && variation.choices?.length > 0) {
          initialVariations[variation.id] = [];
        }
      });
      setRawSelectedVariations(initialVariations);
    }
  }, [product]);

  // Calculate current price based on selections
  const currentPrice = useMemo(() => {
    let total =
      typeof basePrice === 'number'
        ? basePrice
        : parseFloat(String(basePrice)) || 0;

    // Add price from selected variations
    if (product?.variations) {
      Object.entries(rawSelectedVariations).forEach(
        ([variationId, choiceIds]) => {
          const variation = product.variations?.find(
            (v) => String(v.id) === String(variationId)
          );
          if (variation) {
            choiceIds.forEach((choiceId) => {
              const choice = variation.choices.find((c) => c.id === choiceId);
              if (choice) {
                const choicePrice =
                  typeof choice.price === 'number'
                    ? choice.price
                    : parseFloat(String(choice.price)) || 0;
                total += choicePrice;
              }
            });
          }
        }
      );
    }

    // Add price from selected size if applicable
    if (selectedSize?.price) {
      const sizePrice =
        typeof selectedSize.price === 'number'
          ? selectedSize.price
          : parseFloat(String(selectedSize.price)) || 0;
      total = sizePrice + (total - basePrice);
    }

    return parseFloat(total.toFixed(2));
  }, [basePrice, rawSelectedVariations, selectedSize, product?.variations]);

  // Format selected variations for API
  const selectedVariations: FormattedVariations = useMemo(() => {
    const formatted: FormattedVariation[] = Object.entries(
      rawSelectedVariations
    )
      .filter(([, choices]) => choices.length > 0)
      .map(([variationId, choices]) => ({
        main_variation_id: variationId,
        choices,
      }));
    return { variations: formatted };
  }, [rawSelectedVariations]);

  // Check availability based on required variations
  useEffect(() => {
    if (!product?.variations?.length) return;
    const requiredVariations = product.variations.filter((v) => v.is_required);
    const available = requiredVariations.every((mainVariation) =>
      selectedVariations.variations.some(
        (v) => v.main_variation_id === mainVariation.id
      )
    );
    setIsAvailable(available);
  }, [product?.variations, selectedVariations]);

  // Handlers
  const handleRadioChange = (variationId: string, choiceId: string) => {
    setRawSelectedVariations((prev) => ({
      ...prev,
      [variationId]: [choiceId],
    }));
  };

  const handleCheckboxChange = (variationId: string, choiceId: string) => {
    setRawSelectedVariations((prev) => {
      const currentSelections = prev[variationId] || [];
      const newSelections = currentSelections.includes(choiceId)
        ? currentSelections.filter((id) => id !== choiceId)
        : [...currentSelections, choiceId];
      return { ...prev, [variationId]: newSelections };
    });
  };

  const isChoiceSelected = (variationId: string, choiceId: string): boolean => {
    return rawSelectedVariations[variationId]?.includes(choiceId) || false;
  };

  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: 'v1/basket',
        init: {
          method: 'POST',
          body: JSON.stringify({
            product_id: product.id,
            count,
            current_color: selectedColor,
            current_size: selectedSize,
            product_note: productNote,
            variations: selectedVariations.variations,
          }),
        },
        token,
      });

      if (response.ok) {
        toast.success('تمت الإضافة للسلة');
        setCartCount((prev) => prev + count);
        setProductNote('');
      } else {
        toast.error(response.error || 'حدث خطأ');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const discount = product.discount ? parseInt(product.discount, 10) : 0;

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="grid grid-cols-1 gap-8 bg-gray-100 p-8 lg:grid-cols-2">
        {/* Product Gallery */}
        <div>
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation
            className="product-swiper !h-[608px] max-md:!h-80"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative aspect-square h-full w-full">
                  <img
                    src={img || '/placeholder-image.jpg'}
                    alt={product?.name || 'Product image'}
                    className="h-[608px] !w-full !max-w-full object-contain transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <h1 className="mb-4 text-2xl font-semibold">{product.name}</h1>
          <h5 className="my-2 w-fit rounded-lg bg-white px-6 py-2">
            الفئة : <span>{product?.category?.name}</span>
          </h5>

          {/* Price Display */}
          {discount > 0 ? (
            <div className="flex flex-col items-start justify-start gap-1">
              <div className="mb-2 text-lg text-gray-500">
                <bdi>
                  <span>السعر قبل الخصم</span> <span> : </span>
                  <span className="line-through">
                    {product.price} {CURRENCY}
                  </span>
                </bdi>
              </div>
              <bdi className="mb-2 text-xl font-bold text-gray-900">
                <bdi>السعر بعد الخصم</bdi> <span> : </span>
                <span>
                  {getDiscountedPrice(currentPrice, discount)} {CURRENCY}
                </span>
              </bdi>
              <bdi className="flex items-center text-lg font-semibold text-green-600">
                <div className="ml-1">
                  <span>وفرْت </span>
                  <span> : </span>
                </div>
                <span className="ml-1">
                  {currentPrice - getDiscountedPrice(currentPrice, discount)}{' '}
                  {CURRENCY}
                </span>
                <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600">
                  {discount}% خصم
                </span>
              </bdi>
            </div>
          ) : (
            <div className="flex flex-col items-start justify-start gap-1">
              <bdi className="mb-2 text-lg font-normal text-[var(--second-color)]">
                <bdi>السعر</bdi> <span> : </span>
                <span>
                  {currentPrice} {CURRENCY}
                </span>
              </bdi>
            </div>
          )}

          {/* Product Description */}
          {product?.description && (
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Steps */}
          {product?.steps && product.steps.length > 0 && (
            <ul className="mt-4 list-disc pr-4">
              {product.steps.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}

          {/* Description Steps */}
          {product?.description_steps &&
            product.description_steps.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-3 text-lg font-semibold">
                  المواصفات الأساسية
                </h3>
                <ul className="space-y-2">
                  {product.description_steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="ml-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]"></span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Variations Selector */}
          {product.variations && product.variations.length > 0 && (
            <>
              {product.variations.map((variation) => (
                <div key={variation.id} className="mt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="mb-3 text-lg font-semibold">
                      {variation.name}
                    </h3>
                    {variation.is_required && (
                      <span className="ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-600">
                        مطلوب
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {variation.choices.map((choice) => (
                      <div key={choice.id} className="flex items-center">
                        {variation.is_required ? (
                          <label
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2 rounded-md border p-3',
                              isChoiceSelected(variation.id, choice.id)
                                ? 'border-[var(--second-color)] bg-orange-100'
                                : 'border-gray-300 bg-white'
                            )}
                          >
                            <input
                              type="radio"
                              name={`variation-${variation.id}`}
                              value={choice.id}
                              checked={isChoiceSelected(
                                variation.id,
                                choice.id
                              )}
                              onChange={() =>
                                handleRadioChange(variation.id, choice.id)
                              }
                              className="mr-2 h-4 w-4 accent-[var(--second-color)]"
                            />
                            <span className="flex-1">{choice.name}</span>
                            {choice.price > 0 && (
                              <span className="text-sm font-medium text-gray-600">
                                +{choice.price} {CURRENCY}
                              </span>
                            )}
                          </label>
                        ) : (
                          <label
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2 rounded-md border p-3',
                              isChoiceSelected(variation.id, choice.id)
                                ? 'border-[var(--second-color)] bg-orange-100'
                                : 'border-gray-300 bg-white'
                            )}
                          >
                            <input
                              type="checkbox"
                              name={`variation-${variation.id}`}
                              value={choice.id}
                              checked={isChoiceSelected(
                                variation.id,
                                choice.id
                              )}
                              onChange={() =>
                                handleCheckboxChange(variation.id, choice.id)
                              }
                              className="mr-2 h-4 w-4 accent-[var(--second-color)]"
                            />
                            <span className="flex-1">{choice.name}</span>
                            {choice.price > 0 && (
                              <span className="text-sm font-medium text-gray-600">
                                +{choice.price} {CURRENCY}
                              </span>
                            )}
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">الحجم</h3>
              <div className="flex gap-2">
                {product.sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.id}
                    aria-label={`Select size ${sizeOption.size}`}
                    className={cn(
                      'rounded-md border px-4 py-2',
                      selectedSize?.id === sizeOption.id
                        ? 'border-[var(--main-color)] text-[var(--main-color)]'
                        : 'border-gray-300'
                    )}
                    onClick={() => setSelectedSize(sizeOption)}
                  >
                    <bdi>{sizeOption.size}</bdi>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">اللون</h3>
              <div className="flex gap-2">
                {product.colors.map((colorOption) => (
                  <button
                    key={colorOption.id}
                    aria-label={`Select color ${colorOption.color}`}
                    className={cn(
                      'rounded-md border px-4 py-2',
                      selectedColor?.id === colorOption.id
                        ? 'border-[var(--main-color)] text-[var(--main-color)]'
                        : 'border-gray-300'
                    )}
                    onClick={() => setSelectedColor(colorOption)}
                  >
                    <bdi>{colorOption.color}</bdi>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Note */}
          <div className="mt-6 w-full">
            <label
              htmlFor="product-note"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              ملاحظات المنتج (اختياري)
            </label>
            <textarea
              id="product-note"
              value={productNote}
              onChange={(e) => setProductNote(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-[var(--main-color)] focus:outline-none"
              placeholder="اكتب أي ملاحظات خاصة بالمنتج هنا..."
            />
          </div>

          {/* Cart Actions */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:flex-col-reverse max-md:bg-white max-md:px-8 max-md:py-6 max-md:pb-10 max-md:shadow-[0_0_10px_0_rgba(0,0,0,0.2)]">
              <button
                onClick={handleAddToCart}
                disabled={isLoading || !isAvailable}
                className={cn(
                  'flex w-fit items-center justify-center gap-4 rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-md:w-full',
                  !isAvailable && 'bg-gray-500'
                )}
                aria-label="Add product to cart"
              >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>أضف إلى السلة</span>
                <span>
                  {currentPrice * count} <span>{CURRENCY}</span>
                </span>
              </button>
              <div className="flex w-40 items-center justify-between gap-1 rounded-lg border bg-white p-4 max-md:w-full">
                <button
                  className="p-2 hover:text-[var(--second-color)]"
                  onClick={() => setCount((prev) => prev + 1)}
                >
                  <Plus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold">{count}</span>
                <button
                  className="p-2 hover:text-[var(--second-color)]"
                  onClick={() => {
                    if (count > 1) setCount((prev) => Math.max(prev - 1, 0));
                  }}
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <ProductSpecifications
        specifications={
          product.technicalInformation || product.technical_information
        }
      />
    </div>
  );
}

// ProductSpecifications Sub-component
function ProductSpecifications({
  specifications,
  className,
}: {
  specifications?: TechnicalInfo[];
  className?: string;
}) {
  const [showAll, setShowAll] = useState(false);

  if (!specifications || specifications.length === 0) return null;

  const visibleSpecifications = showAll
    ? specifications
    : specifications.slice(0, 5);
  const hasMoreSpecifications = specifications.length > 5;

  return (
    <div className={cn('my-6 w-full', className)}>
      <h3 className="mb-4 text-xl font-semibold">المواصفات</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <tbody>
            {visibleSpecifications.map((spec, index) => (
              <tr
                key={spec.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {spec.key}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMoreSpecifications && (
          <div className="flex justify-center border-t border-gray-200 p-3">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-[var(--main-color)] hover:text-[var(--second-color)] focus:outline-none"
            >
              {showAll ? 'عرض أقل' : 'عرض المزيد'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
