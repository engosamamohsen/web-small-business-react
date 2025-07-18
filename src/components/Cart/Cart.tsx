"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartHook, useCartServices } from "@/hooks/cart/cart";
import { cn } from "@/utils/utils";
import React from "react";
import PageLoader from "../PageLoader/PageLoader";
import { CartItemType } from "@/types/types";

// CartItem component for better separation of concerns
type CartItemProps = {
  item: CartItemType;
  loading: boolean;
  updateCount: (itemId: number, quantity: number, productName: string) => void;
  removeFromCart: (item: any) => void;
  onProductClick: (productId: string) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  loading,
  updateCount,
  removeFromCart,
  onProductClick,
}) => {
  const quantity = parseInt(item.qty);
  return (
    <div
      key={item.cart_item_id}
      className="mb-4 flex w-full items-center justify-between gap-4 rounded-lg bg-white p-4 text-start max-md:flex-col-reverse"
    >
      <div
        onClick={() => onProductClick(item.product_id)}
        className="flex w-fit cursor-pointer justify-start gap-4 max-md:w-full max-md:flex-col"
      >
        <div className="relative h-24 w-24">
          <Image
            src={item.product_image || "/placeholder-image.jpg"} // Fallback for undefined image
            alt={item.product_name || "Product"}
            fill
            className="rounded object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-semibold">{item.product_name}</h3>
          <p className="font-bold text-orange-500">{item.unit_price} ج.م</p>

          {/* Display variations if they exist */}
          {item.variations && item.variations.length > 0 && (
            <div className="mt-2 flex flex-1 flex-col gap-2 text-sm text-gray-600">
              {item.variations.map((variation) => (
                <div key={variation.main_variation_id} className="flex gap-1">
                  <span className="font-medium">
                    {variation.main_variation_name} :
                  </span>
                  <div className="flex gap-1">
                    {variation.choices.map((choice) => (
                      <span
                        key={choice.id}
                        className="rounded bg-gray-100 px-2 py-1 text-xs"
                      >
                        {choice.name}{" "}
                        {choice.price > 0 && `(+${choice.price} ج.م)`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show product note if exists */}
          {item.product_note && (
            <div className="mt-1 text-sm italic text-gray-500">
              ملاحظة: {item.product_note}
            </div>
          )}
        </div>
      </div>
      <div className="flex w-fit cursor-pointer items-center justify-start gap-8 max-md:w-full max-md:justify-between">
        <div className="flex items-center gap-2">
          <button
            disabled={loading || quantity <= 1}
            onClick={() =>
              updateCount(item.cart_item_id, quantity - 1, item?.product_name)
            }
            className={cn(
              "rounded-full p-1 hover:bg-gray-100",
              (loading || quantity <= 1) && "cursor-not-allowed opacity-50",
            )}
            aria-label={`Decrease quantity of ${item.product_name}`}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 rounded-md bg-gray-100 text-center">
            {quantity}
          </span>
          <button
            disabled={loading}
            onClick={() =>
              updateCount(item.cart_item_id, quantity + 1, item?.product_name)
            }
            className={cn(
              "rounded-full p-1 hover:bg-gray-100",
              loading && "cursor-not-allowed",
            )}
            aria-label={`Increase quantity of ${item.product_name}`}
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={() => {
            if (!loading) removeFromCart(item);
          }}
          disabled={loading}
          className={cn(
            "rounded-sm bg-black p-1 text-gray-400 hover:text-red-500",
            loading && "cursor-not-allowed",
          )}
          aria-label={`Remove ${item.product_name} from cart`}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

// Order Summary component
type OrderSummaryProps = {
  subtotal: number;
  shipping?: number;
  tax?: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping = 30,
  tax = 20,
}) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="h-fit rounded-lg bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
      <div className="mb-4 space-y-2">
        <div className="flex justify-between">
          <span>إجمالي المنتجات</span>
          <span>{subtotal} ج.م</span>
        </div>
        <div className="flex justify-between">
          <span>مصاريف الشحن</span>
          <span>{shipping} ج.م</span>
        </div>
        <div className="flex justify-between">
          <span>الضريبة</span>
          <span>{tax} ج.م</span>
        </div>
        <div className="mt-2 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{total?.toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>
      <Link
        href="/checkout"
        className="block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
      >
        إتمام الشراء
      </Link>
    </div>
  );
};

// Loading state component

// Empty cart component
const EmptyCart: React.FC = () => (
  <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
    <h2 className="mb-4 text-2xl font-bold">عربة التسوق فارغة</h2>
    <Link
      href="/"
      className="font-semibold text-orange-500 hover:text-orange-600"
    >
      العودة للتسوق
    </Link>
  </div>
);

// Main Cart component
export default function Cart() {
  // Hooks at the top level as per best practices (adhering to the React hooks rule in memory)
  const router = useRouter();
  const { loading: cartLoading, data: cartResponse, retry } = useCartServices();
  const { loading, removeFromCart, updateCount } = useCartHook();

  // Conditional rendering based on loading and cart state
  if (cartLoading) {
    return <PageLoader text="جاري تحميل عربة التسوق" />;
  }

  // Handle empty cart case
  if (
    !cartResponse ||
    !cartResponse.cart_items ||
    cartResponse.cart_items.length === 0
  ) {
    return <EmptyCart />;
  }

  // Use the cart items from the response - ensure proper type safety
  const cart_items = cartResponse.cart_items;
  const total_price = cartResponse.total_price;

  // Handle product click to navigate to product details
  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Handle quantity update
  const handleUpdateCount = async (
    itemId: number,
    newQuantity: number,
    productName: string,
  ) => {
    const response = await updateCount({
      cart_item_id: itemId,
      qty: newQuantity,
      product_name: productName,
    });
    if (response?.status) {
      retry();
    }
  };

  // Handle item removal
  const handleRemoveFromCart = async (itemId: number) => {
    const response = await removeFromCart({ cart_item_id: itemId });
    if (response?.status) {
      retry();
    }
  };

  return (
    <div
      className="mx-auto my-10 min-h-[1000px] max-w-7xl px-4 py-12"
      suppressHydrationWarning={true}
    >
      <h1 className="mb-8 text-3xl font-bold">عربة التسوق</h1>
      <div className="grid grid-cols-1 gap-8 bg-slate-100 px-6 py-10 lg:grid-cols-3">
        <div className="max-h-[500px] overflow-y-auto pl-6 lg:col-span-2">
          {cart_items.map((item) => (
            <CartItem
              key={item.cart_item_id}
              item={item}
              loading={loading}
              updateCount={handleUpdateCount}
              removeFromCart={handleRemoveFromCart}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <OrderSummary subtotal={total_price} />
      </div>
    </div>
  );
}
