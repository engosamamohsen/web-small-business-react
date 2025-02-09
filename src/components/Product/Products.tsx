import { revalidateTime } from "@/constants/constansts";
import { fetchingData } from "@/hooks/fetching";
import ProductsGrid from "./ProductsGrid";
import Link from "next/link";

export default async function Products() {
  const response = await fetchingData({
    url: "/product?offer=1",
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
    return (
      <section className="py-20" id="products">
        <div className="container">
          <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4">
            <h2 className="mb-8 text-right text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">
              المنتجات
            </h2>
            <Link
              href="/products"
              className="text-lg font-semibold text-[var(--main-color)] transition-all hover:underline"
            >
              تصفح كل العروض
            </Link>
          </div>
          {/* Filter Navigation */}
          <ProductsGrid products={response} />
        </div>
      </section>
    );
  } else {
    return <></>;
  }
}
