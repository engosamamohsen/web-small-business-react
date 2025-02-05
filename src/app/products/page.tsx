"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductType } from "@/lib/types";
import { Search } from "lucide-react";
import { Product } from "@/components/Product/Product";
import ProductModal from "@/components/Product/ProductModal";
import { InputText } from "primereact/inputtext";

export default function ProductsPage() {
  // Consolidate all useState hooks at the top of the component
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Constants outside of hooks
  const productsPerPage = 6;

  // Categories for the sidebar
  const categories = useMemo(
    () => [
      { id: "all", label: "كل الأطباق", count: products.length },
      { id: "main", label: "مساعدة لإسم البيع", count: 0 },
      { id: "appetizers", label: "مساعدة لإسم البيع", count: 0 },
      { id: "desserts", label: "مساعدة لإسم البيع", count: 0 },
      { id: "drinks", label: "مساعدة لإسم البيع", count: 0 },
    ],
    [products.length]
  );

  // First useEffect for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Second useEffect for filtering products
  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (product) => product.category === selectedCategory
        );
      }

      // Apply price filter
      filtered = filtered.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [searchQuery, selectedCategory, priceRange, products]);

  // Memoize pagination calculations
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return { totalPages, currentProducts, pageNumbers };
  }, [filteredProducts, currentPage, productsPerPage]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-pink-50 py-8">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="mb-2 text-center text-3xl font-bold">كل العروض</h1>
            <p className="text-center text-gray-600">
              الصفحة الرئيسية لكل العروض
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Search and Sort Section */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <InputText
                type="text"
                placeholder="ابحث عن المنتج"
                className="w-full p-2 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <span className="self-center text-sm text-gray-500">
                الفرز حسب
              </span>
              <select className="rounded-md border px-3 py-2">
                <option>الأحدث</option>
                <option>الأقدم</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Sidebar Filters */}
            <div className="w-full space-y-6 md:w-64">
              {/* Categories */}
              <div>
                <h3 className="mb-4 font-semibold">الفئات</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full rounded-md px-3 py-2 text-right transition-colors ${
                        selectedCategory === category.id
                          ? "bg-orange-100 text-orange-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{category.label}</span>
                      {category.count > 0 && (
                        <span className="text-sm text-gray-500">
                          {" "}
                          ({category.count})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-4 font-semibold">نطاق السعر</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{priceRange[0]} ج.م</span>
                    <span>{priceRange[1]} ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginationInfo.currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                {paginationInfo.pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`rounded-md border px-3 py-1 ${
                      currentPage === number
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, paginationInfo.totalPages)
                    )
                  }
                  disabled={currentPage === paginationInfo.totalPages}
                  className="rounded-md border px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
