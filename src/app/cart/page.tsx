"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 0),
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">عربة التسوق فارغة</h2>
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 font-semibold"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">عربة التسوق</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-4 rounded-lg mb-4 "
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-orange-500 font-bold">{item.price} ج.م</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4">
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
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>الإجمالي</span>
                <span>{total + 50} ج.م</span>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            إتمام الشراء
          </Link>
        </div>
      </div>
    </div>
  );
}
