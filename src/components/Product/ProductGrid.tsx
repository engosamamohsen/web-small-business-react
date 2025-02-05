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
    null
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
        products.filter((product) => product.category === activeFilter)
      );
    }
  }, [activeFilter, products]);

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
          العروض
        </h2>

        {/* Filter Navigation */}
        <div className="w-full flex justify-between items-center max-sm:flex-col max-sm:gap-4 max-sm:justify-center">
          {" "}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex space-x-4 space-x-reverse rtl:space-x-reverse border-b">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative
                  ${
                    activeFilter === filter.id
                      ? "text-orange-500 border-b-2 border-orange-500 -mb-[2px]"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white group rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
