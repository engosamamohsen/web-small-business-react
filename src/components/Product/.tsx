"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import ProductModal from "./ProductModal";
import { ProductType } from "@/lib/types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Product } from "./Product";

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "كل العروض" },
    { id: "electronics", label: "إلكترونيات" },
    { id: "jewelery", label: "مجوهرات" },
    { id: "men's clothing", label: "ملابس رجالي" },
    { id: "women's clothing", label: "ملابس نسائي" },
  ];

  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === activeFilter),
      );
    }
  }, [activeFilter, products]);

  return (
    <section className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
          العروض
        </h2>

        {/* Filter Navigation */}
        <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4">
          {" "}
          <div className="mb-8 flex justify-center overflow-x-auto">
            <div className="flex space-x-4 space-x-reverse border-b rtl:space-x-reverse">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? "-mb-[2px] border-b-2 border-orange-500 text-orange-500"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <Link href="/products">تصفح كل العروض</Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              onClick={() => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
            >
              <Product product={product} />
            </div>
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

// handle function add to cart

export function HandleAddToCart() {
  const { addItem } = useCartStore((state) => state);
  const { toastAddToCart } = useToast();

  const addToCart = (product: ProductType, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem(product);
    toastAddToCart(product);
  };

  return addToCart;
}
