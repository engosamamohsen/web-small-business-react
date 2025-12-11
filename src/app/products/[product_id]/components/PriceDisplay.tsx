import { currency } from "@/constants/constansts";
import { ProductType } from "@/lib/types";

interface PriceDisplayProps {
  product: ProductType;
  currentPrice: number;
}

// Helper function to calculate discounted price
function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export const PriceDisplay = ({ product, currentPrice }: PriceDisplayProps) => {
  const discount = product.discount ? parseInt(product.discount, 10) : 0;

  if (discount > 0) {
    const priceDiscount = getDiscountedPrice(currentPrice, discount);
    return (
      <div className="flex flex-col items-start justify-start gap-1">
        <div className="mb-2 text-lg text-gray-500">
          <bdi>
            <span>السعر قبل الخصم</span> <span> : </span>
            <span className="line-through">
              {product.price} {currency}
            </span>
          </bdi>
        </div>
        <bdi className="mb-2 text-xl font-bold text-gray-900">
          <bdi>السعر بعد الخصم</bdi> <span> : </span>
          <span>
            {priceDiscount} {currency}
          </span>
        </bdi>
        <bdi className="flex items-center text-lg font-semibold text-green-600">
          <div className="ml-1">
            <span>وفرْت </span>
            <span> : </span>
          </div>
          <span className="ml-1">
            {currentPrice - priceDiscount} {currency}
          </span>
          <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600">
            {discount}% خصم
          </span>
        </bdi>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <bdi className="mb-2 text-lg font-normal text-[var(--second-color)]">
        <bdi>السعر</bdi> <span> : </span>
        <span>
          {currentPrice} {currency}
        </span>
      </bdi>
    </div>
  );
};
