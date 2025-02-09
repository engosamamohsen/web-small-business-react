"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 0),
    0,
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">عربة التسوق فارغة</h2>
        <Link
          href="/"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">عربة التسوق</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="mb-4 flex items-center gap-4 rounded-lg bg-white p-4"
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
                <p className="font-bold text-orange-500">{item.price} ج.م</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
                  className="rounded-full p-1 hover:bg-gray-100"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded-full p-1 hover:bg-gray-100"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X size={20} />
              </button>
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
