import CategorySwiper from "./CategorySwiper";
import SubCategories from "./SubCategories";
import CategoriesSkeleton from "./CategoriesSkeleton";
import { cookies } from "next/headers";
import { revalidateTime } from "@/constants/constansts";
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
  if (response?.isSuccess && response?.categoriesData?.length) {
    return (
      <>
        <div className="relative overflow-visible bg-gray-50">
          <div className="container">
            <h2 className="pt-6 text-right text-2xl font-bold text-gray-800">
              اكتشف الفئات
            </h2>
          </div>
          <CategorySwiper categories={response} />
        </div>
        <div className="container flex items-center justify-between py-8 max-md:flex-col max-md:justify-center max-md:gap-4">
          <h2 className="text-right text-2xl font-bold text-gray-800">
            {targetFilterCategory?.isFilterCategory ? (
              <>{targetFilterCategory?.name}</>
            ) : (
              <>المنتجات</>
            )}
          </h2>
          {targetFilterCategory?.isSubCategory && (
            <div className="flex max-w-full items-center justify-center gap-2 max-md:flex-col">
              <bdi className="mb-4 text-sm font-bold">
                {" "}
                اختر الفئة الفرعية :
              </bdi>
              <SubCategories categories={targetFilterCategory?.subcategories} />
            </div>
          )}
        </div>
      </>
    );
  } else {
    return <CategoriesSkeleton />;
  }
}

const handleSubCategories = async ({
  categories,
  category_id,
}: {
  categories: any;
  category_id: any;
}) => {
  const category = categories?.filter((item: any) => item.id == category_id);
  return {
    ...category[0],
    isFilterCategory: category_id ? true : false,
    isSubCategory: category[0]?.subcategories?.length > 0 ? true : false,
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
      init: { next: { revalidate: revalidateTime } },
      token,
    });

    const categoriesData = response?.data?.data;
    if (!categoriesData) {
      return {
        categoriesData: [],
        isSuccess: true,
      };
    }

    return {
      categoriesData,
      isSuccess: true,
    };
  } catch (error) {
    console.log(error);
    return {
      categoriesData: [],
      isSuccess: false,
    };
  }
}
