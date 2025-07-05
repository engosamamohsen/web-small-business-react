"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartHook, useCartServices } from "@/hooks/cart/cart";
import { cn } from "@/utils/utils";
import React from "react";
import { CartItem as CartItemType } from "@/lib/types";
import PageLoader from "../PageLoader/PageLoader";

// Extended CartItem type to match the API data structure
interface ExtendedCartItem extends CartItemType {
  product_id: number | string;
  count: number;
  price_after: number;
  name: string;
}

// CartItem component for better separation of concerns
type CartItemProps = {
  item: ExtendedCartItem;
  loading: boolean;
  updateCount: (item: ExtendedCartItem) => void;
  removeFromCart: (item: ExtendedCartItem) => void;
  onProductClick: (productId: string | number) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  loading,
  updateCount,
  removeFromCart,
  onProductClick,
}) => {
  return (
    <div
      key={item.id}
      className="mb-4 flex w-full items-center justify-between gap-4 rounded-lg bg-white p-4 text-start max-sm:flex-col-reverse"
    >
      <div
        onClick={() => onProductClick(item.product_id)}
        className="flex w-fit cursor-pointer items-center justify-start gap-4"
      >
        <div className="relative h-24 w-24">
          <Image
            src={item.image || "/placeholder-image.jpg"} // Fallback for undefined image
            alt={item.name || "Product"}
            fill
            className="rounded object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="font-bold text-orange-500">{item.price_after} ج.م</p>
        </div>
      </div>
      <div className="flex w-fit cursor-pointer items-center justify-start gap-8 max-sm:w-full max-sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            onClick={() => updateCount({ ...item, count: item.count - 1 })}
            className={cn(
              "rounded-full p-1 hover:bg-gray-100",
              loading && "cursor-not-allowed",
            )}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 rounded-md bg-gray-100 text-center">
            {item.count}
          </span>
          <button
            disabled={loading}
            onClick={() => updateCount({ ...item, count: item.count + 1 })}
            className={cn(
              "rounded-full p-1 hover:bg-gray-100",
              loading && "cursor-not-allowed",
            )}
            aria-label={`Increase quantity of ${item.name}`}
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
          aria-label={`Remove ${item.name} from cart`}
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
            <span>{total} ج.م</span>
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
  const { loading: cartLoading, data: cartItems } = useCartServices();
  const { loading, removeFromCart, updateCount } = useCartHook();

  // Conditional rendering based on loading and cart state
  if (cartLoading) {
    return <PageLoader text="جاري تحميل عربة التسوق" />;
  }

  if (!cartItems || cartItems?.length === 0) {
    return <EmptyCart />;
  }

  // Cast the cart items to our extended type to satisfy TypeScript
  const items = cartItems as unknown as ExtendedCartItem[];

  // Calculate total price with proper type safety
  const subtotal = items.reduce(
    (acc, item) => acc + item.price_after * item.count,
    0,
  );

  const handleProductClick = (productId: string | number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="mx-auto my-10 min-h-[1000px] max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">عربة التسوق</h1>
      <div className="grid grid-cols-1 gap-8 bg-slate-100 px-6 py-10 lg:grid-cols-3">
        <div className="max-h-[500px] overflow-y-auto pl-6 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              loading={loading}
              updateCount={updateCount}
              removeFromCart={removeFromCart}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <OrderSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
