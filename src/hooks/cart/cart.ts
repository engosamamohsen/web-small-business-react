import { $api } from "@/client";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAsyncRetry } from "react-use";
import Cookies from "js-cookie";
import { useCartStore } from "@/lib/stores";
import { CartResponseType } from "@/types/types";

export const useCartServices = () => {
  const router = useRouter();
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get("v1/basket");
  }, []);

  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/login");
  }

  return { data: value?.data?.data as CartResponseType, loading, retry };
};

export const useCartHook = () => {
  const [loading, setLoading] = useState(false);
  const routes = useRouter();
  const incrementCartCount = useCartStore((state) => state.incrementCartCount);

  /**
   * Add product to cart
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

  /**
   * Update item quantity in cart
   */
  const updateCount = async (product: any) => {
    try {
      setLoading(true);

      const { data } = await $api.post(`update-count`, {
        cart_item_id: product?.cart_item_id,
        qty: product?.qty,
      });

      toast.success(`تمت تحديث ${product.product_name} في سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (product: any) => {
    try {
      setLoading(true);

      const { data } = await $api.delete(
        `v1/basket/delete/${product.cart_item_id.cart_item_id}`
      );
      routes.refresh();

      toast.success(`تم حذف ${product.cart_item_id.product_name} من السلة`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (error: any) {
      toast.error(`فشل حذف من السلة : ${error?.response?.data?.message}`, {
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

/**
 * Transform product data for API request
 */
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
    data.variations = product.variations;
  }

  return data;
};