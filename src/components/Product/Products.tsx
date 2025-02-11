import { revalidateTime } from "@/constants/constansts";
import { fetchingData } from "@/hooks/fetching";
import ProductsGrid from "./ProductsGrid";
// import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Products({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsUrl = await searchParams;
  const response = await fetchingData({
    url: `/product${searchParamsUrl?.category ? `?category_id=${searchParamsUrl?.category}` : ""}`,
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
    return (
      <section className="py-10" id="products">
        <div className="container">
          <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4">
            {/* <Link
              href="/products"
              className="text-lg font-semibold text-[var(--main-color)] transition-all hover:underline"
            >
              تصفح كل العروض
            </Link> */}
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
