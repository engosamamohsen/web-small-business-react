import { $api } from "@/client";
import { toast } from "react-toastify";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAsync } from "react-use";
import { CartItem } from "@/lib/types";
import Cookies from "js-cookie";
import { useCartStore } from "@/Store/cart";

export const useCartServices = () => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.get("v1/basket");
  }, []);
  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/login");
  }
  return { data: value?.data?.data as CartItem[], loading };
};

// export const useCartServices = () => {
//   const router = useRouter();
//   const [, setCartCount] = useAtom(cartCountAtom);

//   const { value, loading, error } = useAsync(async () => {
//     const response = await $api.get("v1/basket");
//     // Update cart count when fetching cart data
//     if (response?.data?.data) {
//       // Ensure we're setting a numeric value
//       const count = response.data.data.length || 0;
//       setCartCount(count);
//     }
//     return response;
//   }, [setCartCount]);

//   const errorStatus = (error as any)?.status;
//   if (errorStatus === 403) {
//     Cookies.remove("app_token");
//     router.push("/login");
//   }
//   return { data: value?.data?.data as CartItem[], loading };
// };

export const useCartHook = () => {
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const { incrementCartCount } = useCartStore();
  /**
   * On Share Project action
   */
  const addToCart = async (product: any) => {
    try {
      setLoading(true);

      const response = await $api.post(`v1/basket/add`, transformData(product));

      // Update cart count on successful addition
      incrementCartCount();

      toast.success(`تمت إضافة ${product.name} إلى سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return response.data;
    } catch (error: any) {
      if (error?.status === 403) {
        Cookies.remove("app_token");
        routes.push("/login");
      }
      toast.error(`فشل اضافة للسلة : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const updateCount = async (product: any) => {
    try {
      setLoading(true);

      const {} = await $api.post(`v1/basket/add`, transformUpdateData(product));

      toast.success(`تمت تحديث ${product.name} في سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      routes.refresh();
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const removeFromCart = async (product: any) => {
    try {
      setLoading(true);

      const {} = await $api.delete(`v1/basket/delete/${product.id}`);
      routes.push(`/cart`);

      toast.success(`تم حذف ${product.name} من السلة`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
    } catch (error: any) {
      toast.error(`  فشل حذف من السلة  : ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    addToCart,
    removeFromCart,
    updateCount,
  };
};

const transformData = (product: any) => {
  const data: Record<string, any> = {
    product_id: product?.id,
    count: product?.count || 1,
  };

  // Add product note if provided
  if (product?.product_note) {
    data.product_note = product.product_note;
  }

  // Add size if selected
  if (product?.currentSize) {
    data.size_id = product?.currentSize?.id;
  }

  // Add color if selected
  if (product?.currentColor) {
    data.color_id = product?.currentColor?.id;
  }

  // Add variations if any
  if (product?.variations && product.variations.length > 0) {
    // Just pass the variations array directly
    data.variations = product.variations;
  }

  return data;
};

const transformUpdateData = (product: any) => {
  const formData = new FormData();
  formData.append("product_id", product?.product_id);
  formData.append("count", product?.count || 1);

  return formData;
};

// const transformUpdateData = (product: any) => {
//   const data: Record<string, any> = {
//     product_id: product?.product_id,
//     count: product?.count || 1
//   };

//   return data;
// };
