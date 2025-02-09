import { fetchingData } from "@/hooks/fetching";
import CategorySwiper from "./CategorySwiper";
import { revalidateTime } from "@/constants/constansts";

export default async function Categories() {
  const response = await fetchingData({
    url: "/categories",
    type: { next: { revalidate: revalidateTime } },
  });
  if (response?.isSuccess) {
    return (
      <div className="relative overflow-visible bg-gray-50">
        <div className="container">
          {" "}
          <h2 className="text-right text-2xl font-bold text-gray-800">
            اكتشف الفئات
          </h2>
        </div>
        <CategorySwiper categories={response} />
      </div>
    );
  } else {
    <></>;
  }
}
