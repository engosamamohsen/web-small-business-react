/**
 * Products Component - React Island
 *
 * Main product grid with pagination
 * Matches Next.js Products component behavior
 */
import type { Product } from '@/types/types';
import ProductCard from './ProductCard';

interface ProductsProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  selectedCategory?: string;
}

function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    window.location.href = url.toString();
  };

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Show limited pages with ellipsis
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 5) return pages;

    const visible: (number | string)[] = [];
    if (currentPage <= 3) {
      visible.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      visible.push(
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      visible.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }
    return visible;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        السابق
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`rounded border px-3 py-2 transition-colors ${
              page === currentPage
                ? 'border-[var(--main-color)] bg-[var(--main-color)] text-white'
                : 'border-gray-200 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2">
            ...
          </span>
        )
      )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        التالي
      </button>
    </div>
  );
}

function NotFoundProducts({ text = 'منتجات' }: { text?: string }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-gray-50">
      <div className="text-center">
        <div className="mb-4 text-6xl">📦</div>
        <p className="text-xl text-gray-500">لا توجد {text}</p>
      </div>
    </div>
  );
}

export default function Products({
  products,
  currentPage,
  totalPages,
  selectedCategory,
}: ProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-10" id="products">
        <div className="container">
          <NotFoundProducts />
          {selectedCategory && (
            <div className="mt-4 text-center">
              <a href="/" className="text-[var(--main-color)] hover:underline">
                عرض جميع المنتجات
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10" id="products">
      <div className="container">
        <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4">
          {/* Placeholder for future links */}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        )}
      </div>
    </section>
  );
}
