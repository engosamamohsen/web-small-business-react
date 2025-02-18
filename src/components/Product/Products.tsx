import { revalidateTime } from "@/constants/constansts";
import { fetchingData } from "@/hooks/fetching";
import ProductsGrid from "./ProductsGrid";
import Pagination from "../Pagination/Pagination";
import NotFoundProducts from "../NotFoundProducts/NotFoundProducts";
// import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Products({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsUrl = await searchParams;
  const currentPage = Number(searchParamsUrl?.page) || 1;
  const limit = Number(searchParamsUrl?.limit) || 10;

  const url = `/product${
    searchParamsUrl?.category ? `?category_id=${searchParamsUrl?.category}` : ""
  }${searchParamsUrl?.sub_category ? `&sub_category_id=${searchParamsUrl?.sub_category}` : ""}${searchParamsUrl?.sub_category || searchParamsUrl?.category ? `&` : "?"}page=${currentPage}&limit=${limit}`;
  console.log("url", url);

  const response = await fetchingData({
    url: url,
    type: { next: { revalidate: revalidateTime } },
  });
  console.log(
    "response?.data?.pagination?.last_page",
    response?.data?.pagination?.last_page,
  );
  console.log("response?.data", response?.data);
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
          <ProductsGrid products={response} />
          {response?.data?.pagination?.last_page > 1 && (
            <Pagination totalPages={response?.data?.pagination?.last_page} />
          )}
          {response?.data?.data?.length == 0 && <NotFoundProducts />}
        </div>
      </section>
    );
  } else {
    return (
      <>
        {" "}
        <section className="py-10" id="products">
          <div className="container">
            <div className="flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4"></div>
            <NotFoundProducts />
          </div>
        </section>
      </>
    );
  }
}
