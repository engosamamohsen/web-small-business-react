import React from "react";
import { PackageOpen } from "lucide-react";

function NotFoundProducts({ text = "منتجات" }: { text?: string }) {
  return (
    <div className="flex h-full min-h-72 w-full flex-col items-center justify-center gap-5 bg-slate-100 text-center">
      <PackageOpen className="h-16 w-16 text-gray-500" />
      <span className="text-2xl font-semibold text-gray-500">
        عذراً، لم يتم العثور على <span>{text}</span>
      </span>
    </div>
  );
}

export default NotFoundProducts;
