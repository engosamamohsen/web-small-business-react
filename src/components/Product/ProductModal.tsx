"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { ProductType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  product: ProductType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  if (!product || !isOpen) return null;
  const addToCart = HandleAddToCart();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-right text-xl font-bold">معلومات للمنتج</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative aspect-square w-full md:w-1/2">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex w-full flex-col justify-between md:w-1/2">
              <div>
                <h3 className="mb-4 text-right text-xl font-bold">
                  {product.title}
                </h3>
                <p className="mb-6 text-right text-gray-600">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">
                    {product.price} ج.م
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    addToCart(product, e);
                    onClose();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-white transition-colors hover:bg-orange-600"
                >
                  إضافة لعربة التسوق
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HandleAddToCart() {
  // const { addItem } = useCartStore((state) => state);
  const { toastAddToCart } = useToast();

  const addToCart = (product: ProductType, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // addItem(product);
    toastAddToCart(product);
  };

  return addToCart;
}
