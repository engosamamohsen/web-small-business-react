import { cn } from "@/utils/utils";
import React, { memo } from "react";

export type SpecificationType = {
    id: number;
    product_id?: string;
    key: string;
    value: string | number;
    created_at?: string;
    updated_at?: string;
};

interface ProductSpecificationsProps {
    specifications: SpecificationType[];
    className?: string;
}

export const ProductSpecifications = memo<ProductSpecificationsProps>(({
    specifications,
    className,
}) => {
    const [showAll, setShowAll] = React.useState(false);

    if (!specifications || specifications.length === 0) return null;

    const visibleSpecifications = showAll
        ? specifications
        : specifications.slice(0, 5);
    const hasMoreSpecifications = specifications.length > 5;

    return (
        <div className={cn("my-6", className)}>
            <h3 className="mb-4 text-xl font-semibold">المواصفات</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <tbody>
                        {visibleSpecifications.map((spec, index) => (
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
                {hasMoreSpecifications && (
                    <div className="flex justify-center border-t border-gray-200 p-3">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm font-medium text-[var(--main-color)] hover:text-[var(--second-color)] focus:outline-none"
                        >
                            {showAll ? "عرض أقل" : "عرض المزيد"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

ProductSpecifications.displayName = "ProductSpecifications";
