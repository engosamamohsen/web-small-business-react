"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { ProductType } from "@/lib/types";
import { HandleAddToCart } from "./ProductGrid";

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
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-right">معلومات للمنتج</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/2 aspect-square">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between w-full md:w-1/2">
              <div>
                <h3 className="text-xl font-bold mb-4 text-right">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-6 text-right">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-500">
                    {product.price} ج.م
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    addToCart(product, e);
                    onClose();
                  }}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
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
