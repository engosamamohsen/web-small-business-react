// import { revalidateTime } from "@/constants/constansts";
import ProductsGrid from "./ProductsGrid";
import Pagination from "../Pagination/Pagination";
import NotFoundProducts from "../NotFoundProducts/NotFoundProducts";
import { fetchHook } from "@/hooks/fetch-hook";
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

  const url = `v1/product${searchParamsUrl?.category ? `?category_id=${searchParamsUrl?.category}` : ""
    }${searchParamsUrl?.sub_category ? `&sub_category_id=${searchParamsUrl?.sub_category}` : ""}${searchParamsUrl?.sub_category || searchParamsUrl?.category ? `&` : "?"}page=${currentPage}&limit=${limit}`;

  const response = await getProductsServer(url);
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
          {response?.pagination?.last_page > 1 && (
            <Pagination totalPages={response?.pagination?.last_page} />
          )}
          {response?.data?.length == 0 && <NotFoundProducts />}
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

async function getProductsServer(url: string) {
  try {
    const response = await fetchHook({
      url: url,
      init: { cache: "no-store" },
    });

    const data = response?.data?.data;
    if (!data) {
      return {
        data: [],
        isSuccess: true,
        pagination: {
          last_page: 1,
        },
      };
    }

    return {
      data,
      isSuccess: true,
      pagination: response?.data?.pagination,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      isSuccess: false,
      pagination: {
        last_page: 1,
      },
    };
  }
}
