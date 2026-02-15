"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "@/lib/navigation";
import ReactPaginate from "react-paginate";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // الحصول على جميع البارامترات الحالية
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;

  const handlePageChange = ({ selected }: { selected: number }) => {
    const page = selected + 1; // لأن React Paginate يبدأ من 0
    const newSearchParams = new URLSearchParams(searchParams.toString()); // إنشاء نسخة من searchParams

    newSearchParams.set("page", page.toString());
    newSearchParams.set("limit", currentLimit.toString()); // الحفاظ على limit الحالي

    // تحديث URL بدون فقدان باقي القيم
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="my-8 flex items-center justify-center">
      <ReactPaginate
        previousLabel={<ChevronRight />}
        nextLabel={<ChevronLeft />}
        breakLabel="..."
        pageCount={totalPages}
        forcePage={currentPage - 1} // ضبط الصفحة الحالية بناءً على searchParams
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName="flex items-center gap-2 bg-white p-2 rounded-full shadow-md"
        pageClassName="px-3 py-1 rounded-full transition-all duration-200 hover:bg-gray-200"
        activeClassName="bg-[var(--main-color)] text-white"
        previousClassName="p-2 rounded-full transition-all duration-200 bg-white shadow-md hover:bg-gray-200"
        nextClassName="p-2 rounded-full transition-all duration-200 bg-white shadow-md hover:bg-gray-200"
        breakClassName="px-2"
      />
    </div>
  );
};

export default Pagination;
