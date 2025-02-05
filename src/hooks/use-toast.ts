import { ProductType } from "@/lib/types";
import { toast } from "react-toastify";

export function useToast() {
  const toastAddToCart = (product: ProductType) => {
    toast.success(`تمت إضافة ${product.title} إلى سلة التسوق`, {
      position: "top-right",
      autoClose: 2000,
      rtl: true,
    });
  };

  return { toastAddToCart };
}
