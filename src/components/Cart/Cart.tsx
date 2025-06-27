"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { CartItem } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useCartHook } from "@/hooks/cart/cart";
import { cn } from "@/utils/utils";

export default function Cart({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const { loading, removeFromCart, updateCount } = useCartHook();
  const total = items.reduce(
    (acc, item) => acc + (item?.price_after || 0) * (item.count || 1),
    0,
  );

  return (
    <div className="mx-auto my-10 min-h-[1000px] max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">عربة التسوق</h1>
      <div className="grid grid-cols-1 gap-8 bg-slate-100 px-6 py-10 lg:grid-cols-3">
        <div className="max-h-[500px] overflow-y-auto pl-6 lg:col-span-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="mb-4 flex w-full items-center justify-between gap-4 rounded-lg bg-white p-4 text-start"
            >
              <div
                onClick={() => {
                  router.push(`/products/${item.product_id}`);
                }}
                className="flex w-fit cursor-pointer items-center justify-start gap-4"
              >
                <div className="relative h-24 w-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-bold text-orange-500">
                    {item.price_after * 1} ج.م
                  </p>
                </div>
              </div>
              <div className="flex w-fit cursor-pointer items-center justify-start gap-8">
                <div className="flex items-center gap-2">
                  <button
                    disabled={loading}
                    onClick={() =>
                      updateCount({ ...item, count: Number(item.count) - 1 })
                    }
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
                    onClick={() =>
                      updateCount({ ...item, count: Number(item.count) + 1 })
                    }
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
          ))}
        </div>
        <div className="h-fit rounded-lg bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
          <div className="mb-4 space-y-2">
            <div className="flex justify-between">
              <span>إجمالي المنتجات</span>
              <span>{total} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>مصاريف الشحن</span>
              <span>30 ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة</span>
              <span>20 ج.م</span>
            </div>
            <div className="mt-2 border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>الإجمالي</span>
                <span>{total + 50} ج.م</span>
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
      </div>
    </div>
  );
}
