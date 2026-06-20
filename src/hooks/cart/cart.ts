import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { useAsyncRetry } from "react-use";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import { $api } from "@/client";
import { CartResponseType } from "@/types/types";
import { useCart } from "@/providers/SettingsProvider";
import { storeConfig } from "@/lib/store-config";
import {
  readLocalCart,
  addLocalCartItem,
  updateLocalCartQty,
  removeLocalCartItem,
  localCartCount,
} from "@/lib/cart/local-cart";

/**
 * Hook for fetching cart data.
 * PREMIUM → basket API; BASIC → localStorage cart (same response shape).
 */
export const useCartServices = () => {
  const router = useRouter();

  const { value, loading, error, retry } = useAsyncRetry(async () => {
    if (storeConfig.usesLocalCart) {
      return { data: { data: readLocalCart() } };
    }
    return $api.get("v1/basket");
  }, []);

  // Handle 403 - redirect to login (premium only; basic never authenticates)
  const errorStatus = (error as any)?.status;
  if (storeConfig.canAuthenticate && errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }

  return {
    data: value?.data?.data as CartResponseType,
    loading,
    error,
    retry,
  };
};

/**
 * Hook for cart actions (add, update, remove).
 * Same interface for both plans; BASIC mutates the local cart.
 */
export const useCartHook = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get cart actions from context
  const { incrementCartCount, setCartCount } = useCart();

  /**
   * Add product to cart
   */
  const addToCart = async (product: any) => {
    if (storeConfig.usesLocalCart) {
      addLocalCartItem(product);
      setCartCount(localCartCount());
      toast.success(`تمت إضافة ${product.name} إلى سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return { status: true };
    }

    try {
      setLoading(true);

      const response = await $api.post("v1/basket/add", transformData(product));

      // Update cart count
      incrementCartCount();

      toast.success(`تمت إضافة ${product.name} إلى سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return response.data;
    } catch (error: any) {
      handleError(error, router);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update item quantity
   */
  const updateCount = async (product: any) => {
    if (storeConfig.usesLocalCart) {
      updateLocalCartQty(Number(product?.cart_item_id), Number(product?.qty));
      setCartCount(localCartCount());
      toast.success(`تم تحديث ${product.product_name} في سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return { status: true };
    }

    try {
      setLoading(true);

      const { data } = await $api.post("update-count", {
        cart_item_id: product?.cart_item_id,
        qty: product?.qty,
      });

      toast.success(`تم تحديث ${product.product_name} في سلة التسوق`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (product: any) => {
    // Callers pass { cart_item_id: <full cart item> }
    const cartItem = product?.cart_item_id;

    if (storeConfig.usesLocalCart) {
      removeLocalCartItem(Number(cartItem?.cart_item_id ?? cartItem));
      setCartCount(localCartCount());
      toast.success(`تم حذف ${cartItem?.product_name ?? "المنتج"} من السلة`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return { status: true };
    }

    try {
      setLoading(true);

      const { data } = await $api.delete(
        `v1/basket/delete/${product.cart_item_id.cart_item_id}`
      );

      router.refresh();

      toast.success(`تم حذف ${product.cart_item_id.product_name} من السلة`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (error: any) {
      toast.error(`فشل حذف من السلة: ${error?.response?.data?.message}`, {
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
    updateCount,
    removeFromCart,
  };
};

// ===== Helper Functions =====

function handleError(error: any, router: ReturnType<typeof useRouter>) {
  if (storeConfig.canAuthenticate && error?.status === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }

  toast.error(`فشل إضافة للسلة: ${error?.response?.data?.message}`, {
    position: "top-right",
    autoClose: 2000,
    rtl: true,
  });
}

function transformData(product: any) {
  const data: Record<string, any> = {
    product_id: product?.id,
    count: product?.count || 1,
  };

  if (product?.product_note) {
    data.product_note = product.product_note;
  }

  if (product?.currentSize) {
    data.size_id = product.currentSize.id;
  }

  if (product?.currentColor) {
    data.color_id = product.currentColor.id;
  }

  if (product?.variations?.length > 0) {
    // The selection now carries names/prices for the local cart + WhatsApp message;
    // the basket API only wants {main_variation_id, choices:[id]}, so normalize here.
    data.variations = product.variations.map((variation: any) => ({
      main_variation_id: variation.main_variation_id,
      choices: (variation.choices ?? []).map((choice: any) =>
        choice && typeof choice === "object" ? choice.id : choice
      ),
    }));
  }

  return data;
}

// ===== Legacy Exports =====
export const useCartStore = useCart;
