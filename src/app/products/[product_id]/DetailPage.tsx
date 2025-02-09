"use client";
import parse from "html-react-parser";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import styles from "./style.module.css";
import { useUpdateEffect } from "react-use";
import { currency } from "@/constants/constansts";

function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export default function DetailPage({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<any | null>(
    product?.sizes[0],
  );
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(
    product?.price_after || product.price,
  );

  useUpdateEffect(() => {
    if (selectedSize?.price) {
      setCurrentPrice(parseFloat(selectedSize.price));
    }
  }, [selectedSize, product]);

  const handleSizeSelect = (sizeOption: any) => {
    setSelectedSize(sizeOption);
    // setCurrentPrice(parseFloat(sizeOption.price || product.price));
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="grid grid-cols-1 gap-8 bg-gray-100 p-8 md:grid-cols-2">
        {/* معرض الصور */}
        <div>
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation
            autoplay
            className={`${styles["product-swiper"]} max-md:h-80`}
          >
            {product?.gallery?.map((data: any) => (
              <SwiperSlide key={data?.id}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={data?.image}
                    alt={product?.name}
                    width={321}
                    height={400}
                    // sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority
                    className="h-[608px] !w-full !max-w-full object-fill transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <h1 className="mb-4 text-2xl font-semibold">{product.name}</h1>

          <PriceContent product={product} currentPrice={currentPrice} />
          <div className="mt-4">{parse(product?.description)}</div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">الحجم</h3>
              <div className="flex gap-2">
                {product.sizes.map((sizeOption: any) => (
                  <button
                    key={sizeOption.id}
                    aria-label={`Select size ${sizeOption.size}`}
                    className={`rounded-md border px-4 py-2 ${
                      selectedSize?.id === sizeOption.id
                        ? "bg-[var(--second-color)] text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleSizeSelect(sizeOption)}
                  >
                    {sizeOption.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">اللون</h3>
              <div className="flex gap-2">
                {product.colors.map((colorOption: any) => (
                  <button
                    key={colorOption.id}
                    aria-label={`Select color ${colorOption.color}`}
                    className={`h-8 w-8 rounded-full border ${
                      selectedColor?.id === colorOption.id
                        ? "ring-2 ring-[var(--main-color)]"
                        : ""
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    onClick={() => setSelectedColor(colorOption)}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            className="mt-6 w-full rounded-md bg-[var(--main-color)] py-3 text-white transition-colors hover:bg-gray-800"
            aria-label="Add product to cart"
          >
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceContent({
  product,
  currentPrice,
}: {
  product: any;
  currentPrice: any;
}) {
  if (+product?.discount > 0) {
    const priceDiscount = getDiscountedPrice(currentPrice, product.discount);
    return (
      <div className="flex flex-col items-start justify-start gap-1">
        {" "}
        <div className="mb-2 text-lg text-gray-500">
          {product.discount ? (
            <bdi>
              <span> السعر قبل الخصم</span> <span> : </span>
              <span className="line-through">
                {product.price} {currency}
              </span>
            </bdi>
          ) : null}
        </div>
        <bdi className="mb-2 text-xl font-bold text-gray-900">
          <bdi> السعر بعد الخصم</bdi> <span> : </span>
          <span>
            {priceDiscount} {currency}{" "}
          </span>
        </bdi>
        {product.discount ? (
          <bdi className="flex items-center text-lg font-semibold text-green-600">
            <div className="ml-1">
              <span>وفرْت </span>
              <span> : </span>
            </div>
            <span className="ml-1">
              {currentPrice - priceDiscount} {currency}
            </span>
            <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600">
              {product.discount}% خصم
            </span>
          </bdi>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-start justify-start gap-1">
        <bdi className="mb-2 text-xl font-bold text-gray-900">
          <bdi>السعر</bdi> <span> : </span>
          <span>
            {currentPrice} {currency}{" "}
          </span>
        </bdi>
      </div>
    );
  }
}

//  const options: HTMLReactParserOptions = {
//   replace: (domNode) => {
//     // Ensure that the node is an HTML element
//     if (domNode instanceof Element) {
//       // If the element is a <p> and doesn't have a class, add the class "said"
//       if (domNode.name === 'p' && !domNode.attribs?.class) {
//         domNode.attribs.class = 'said';
//       }
//       // If the element is an <h1>
//       if (domNode.name === 'h1') {
//         // If the element already has a class
//         if (domNode.attribs?.class) {
//           // Add the class "said-h1" alongside the existing class
//           domNode.attribs.class += ' said-h1';
//         } else {
//           // If the element doesn't have a class, add the class "said-h1"
//           domNode.attribs.class = 'said-h1';
//         }
//       }
//     }
//     return null; // Don't replace the element itself
//   },
// };
