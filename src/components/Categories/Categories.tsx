import CategorySwiper from "./CategorySwiper";
import SubCategories from "./SubCategories";
import { cookies } from "next/headers";
// import { revalidateTime } from "@/constants/constansts";
import { fetchHook } from "@/hooks/fetch-hook";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Categories({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParamsUrl = await searchParams;
  const response = await getCategoriesServer();

  const targetFilterCategory = await handleSubCategories({
    categories: response?.categoriesData,
    category_id: searchParamsUrl.category,
  });

  if (!response?.isSuccess) return null;

  return (
    <>
      {/* Featured header + categories swiper */}
      <section className="relative overflow-visible bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <h2 className="pt-8 text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:pt-6 max-md:text-xl">
            اكتشف الفئات
          </h2>
          {/* <p className="mt-1 text-right text-sm text-gray-500 max-md:text-xs">
            اختار الفئة اللي تدور عليها بسرعة
          </p> */}
        </div>

        <CategorySwiper categories={response} />
      </section>

      {/* Title + optional subcategories */}
      <section className="container flex items-center justify-between py-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <h2 className="text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:text-xl">
          {targetFilterCategory?.isFilterCategory
            ? targetFilterCategory?.name
            : "المنتجات"}
        </h2>

        {targetFilterCategory?.isSubCategory && (
          <div className="flex max-w-full items-center gap-3 max-md:w-full max-md:flex-col max-md:items-start">
            <bdi className="text-sm font-bold text-gray-700 max-md:text-xs">
              اختر الفئة الفرعية :
            </bdi>

            <SubCategories categories={targetFilterCategory?.subcategories} />
          </div>
        )}
      </section>
    </>
  );
}

const handleSubCategories = async ({
  categories,
  category_id,
}: {
  categories: any[];
  category_id: any;
}) => {
  if (!category_id) {
    return { isFilterCategory: false, isSubCategory: false };
  }

  const category = categories?.find((item: any) => item.id == category_id);

  return {
    ...(category || {}),
    isFilterCategory: true,
    isSubCategory: (category?.subcategories?.length || 0) > 0,
  };
};

async function getCategoriesServer(): Promise<{
  categoriesData: any[];
  isSuccess: boolean;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("app_token")?.value;

    const response = await fetchHook({
      url: `v1/categories`,
      init: { next: { revalidate: 300 } }, // Cache for 5 minutes
      token,
    });

    const categoriesData = response?.data?.data;

    return {
      categoriesData: categoriesData || [],
      isSuccess: true,
    };
  } catch (error) {
    // Error handling - categories will return empty array
    return { categoriesData: [], isSuccess: false };
  }
}
