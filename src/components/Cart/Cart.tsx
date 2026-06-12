"use client";

import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useEffect } from "react";

import { useCartHook, useCartServices } from "@/hooks/cart/cart";
import { useCart } from "@/providers";
import { cn } from "@/utils/utils";
import { buildProductPath } from "@/lib/product-url";
import PageLoader from "../PageLoader/PageLoader";
import { CartItemType } from "@/types/types";

// ===== Cart Item Component =====
interface CartItemProps {
  item: CartItemType;
  loading: boolean;
  updateCount: (itemId: number, quantity: number, productName: string) => void;
  removeFromCart: (item: any) => void;
  onProductClick: (productId: string, productName: string) => void;
}

const CartItem = ({
  item,
  loading,
  updateCount,
  removeFromCart,
  onProductClick,
}: CartItemProps) => {
  const quantity = parseInt(item.qty);
  const itemTotal = item.item_total ?? Number(item.unit_price) * quantity;

  return (
    <div className="mb-4 flex w-full flex-col gap-4 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-slate-100 transition-shadow max-md:flex-col-reverse md:flex-row md:items-center md:justify-between md:gap-6">
      {/* Image + Info */}
      <div
        onClick={() => onProductClick(String(item.product_id), item.product_name)}
        className="flex w-full cursor-pointer gap-4 max-md:flex-col"
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
          <Image
            src={item.product_image || "/placeholder-image.jpg"}
            alt={item.product_name ? `صورة المنتج ${item.product_name}` : "صورة منتج في السلة"}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 md:text-base">
            {item.product_name}
          </h3>

          <div className="flex flex-wrap items-baseline gap-3 text-sm">
            <span className="font-medium text-orange-500">
              {item.unit_price} ج.م
              <span className="text-xs text-slate-500"> (سعر الوحدة)</span>
            </span>
            <span className="text-xs text-slate-500">
              الكمية: <span className="font-semibold">{quantity}</span>
            </span>
            <span className="text-xs font-semibold text-slate-800">
              الإجمالي: <span className="text-slate-900">{itemTotal} ج.م</span>
            </span>
          </div>

          {/* Variations */}
          {item.variations && item.variations.length > 0 && (
            <div className="mt-1 flex flex-col gap-1 text-xs text-slate-600">
              {item.variations.map((variation) => (
                <div
                  key={variation.main_variation_id}
                  className="flex flex-wrap items-center gap-1"
                >
                  <span className="font-medium text-slate-700">
                    {variation.main_variation_name}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {variation.choices.map((choice) => (
                      <span
                        key={choice.id}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px]"
                      >
                        {choice.name}
                        {choice.price > 0 && (
                          <span className="text-[10px] text-slate-500">
                            (+{choice.price} ج.م)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          {item.product_note && (
            <div className="mt-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
              <span className="font-medium">ملاحظة:</span> {item.product_note}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-col md:items-end">
        {/* Quantity */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
          <button
            disabled={loading || quantity <= 1}
            onClick={() =>
              updateCount(item.cart_item_id, quantity - 1, item.product_name)
            }
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              (loading || quantity <= 1) &&
              "cursor-not-allowed opacity-40 hover:bg-transparent"
            )}
          >
            <Minus size={16} />
          </button>
          <span className="mx-1 min-w-[2.25rem] rounded-md bg-white px-2 py-1 text-center text-sm font-semibold text-slate-800">
            {quantity}
          </span>
          <button
            disabled={loading}
            onClick={() =>
              updateCount(item.cart_item_id, quantity + 1, item.product_name)
            }
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              loading && "cursor-not-allowed opacity-60"
            )}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={() => !loading && removeFromCart(item)}
          disabled={loading}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-200 transition hover:bg-red-600 hover:text-white",
            loading && "cursor-not-allowed opacity-60"
          )}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// ===== Order Summary Component =====
const OrderSummary = ({
  subtotal,
  shipping = 0,
  tax = 0,
}: {
  subtotal: number;
  shipping?: number;
  tax?: number;
}) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="h-fit rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
      <div className="mb-4 space-y-2">
        <div className="flex justify-between">
          <span>إجمالي المنتجات</span>
          <span>{subtotal?.toFixed(2)} ج.م</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between">
            <span>الضريبة</span>
            <span>{tax} ج.م</span>
          </div>
        )}
        <div className="mt-2 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{total?.toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>
      <Link
        href="/shop/checkout"
        className="block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
      >
        إتمام الشراء
      </Link>
    </div>
  );
};

// ===== Empty Cart Component =====
const EmptyCart = () => (
  <div className="mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
      🛒
    </div>
    <h2 className="mb-2 text-2xl font-bold text-slate-900">عربة التسوق فارغة</h2>
    <p className="mb-4 text-sm text-slate-500">
      أضف بعض المنتجات لعربة التسوق للمتابعة في عملية الشراء.
    </p>
    <Link
      href="/"
      className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
    >
      العودة للتسوق
    </Link>
  </div>
);

// ===== Main Cart Component =====
export default function Cart() {
  const router = useRouter();
  const { loading: cartLoading, data: cartResponse, retry } = useCartServices();
  const { loading, removeFromCart, updateCount } = useCartHook();
  const { setCartCount } = useCart();

  // Sync cart count when data changes
  useEffect(() => {
    if (cartResponse?.cart_items) {
      const totalCount = cartResponse.cart_items.reduce(
        (sum: number, item: CartItemType) => sum + Number(item.qty ?? 0),
        0
      );
      setCartCount(totalCount);
    } else {
      setCartCount(0);
    }
  }, [cartResponse, setCartCount]);

  if (cartLoading) {
    return <PageLoader text="جاري تحميل عربة التسوق" />;
  }

  if (!cartResponse?.cart_items?.length) {
    return <EmptyCart />;
  }

  const handleProductClick = (productId: string, productName: string) => {
    // Cart items carry no slug — the details page 301s to the canonical slug
    router.push(buildProductPath({ id: productId, name: productName }));
  };

  const handleUpdateCount = async (
    itemId: number,
    newQuantity: number,
    productName: string
  ) => {
    const response = await updateCount({
      cart_item_id: itemId,
      qty: newQuantity,
      product_name: productName,
    });
    if (response?.status) retry();
  };

  const handleRemoveFromCart = async (item: any) => {
    const response = await removeFromCart({ cart_item_id: item });
    if (response?.status) retry();
  };

  return (
    <div className="mx-auto my-10 min-h-[800px] max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">عربة التسوق</h1>
      <p className="mb-6 text-sm text-slate-500">
        يمكنك تعديل الكمية أو إزالة المنتجات قبل إتمام الطلب.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="max-h-[520px] overflow-y-auto rounded-2xl bg-slate-50 p-4 lg:p-6">
          {cartResponse.cart_items.map((item) => (
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
        <div className="lg:self-start">
          <OrderSummary subtotal={cartResponse.total_price} />
        </div>
      </div>
    </div>
  );
}
