import { cn } from "@/utils/utils";
import React from "react";

export type SpecificationType = {
  id: number;
  product_id: string;
  key: string;
  value: string | number;
  created_at?: string;
  updated_at?: string;
};

interface ProductSpecificationsProps {
  specifications: SpecificationType[];
  className?: string;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  specifications,
  className,
}) => {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className={cn("my-6", className)}>
      <h3 className="mb-4 text-xl font-semibold">المواصفات</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={spec.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                  {spec.key}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
