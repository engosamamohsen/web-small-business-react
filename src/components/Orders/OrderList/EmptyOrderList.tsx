import Link from "next/link";
import React from "react";

/**
 * Component displayed when the order list is empty
 */
const EmptyOrderList: React.FC = () => (
  <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
    <h2 className="mb-4 text-2xl font-bold">لا توجد طلبات</h2>
    <p className="mb-6 text-gray-600">لم يتم العثور على أي طلبات سابقة</p>
    <Link
      href="/"
      className="font-semibold text-orange-500 hover:text-orange-600"
    >
      العودة للتسوق
    </Link>
  </div>
);

export default EmptyOrderList;
