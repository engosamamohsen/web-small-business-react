import { useState } from 'react';
import { b as useCart, $ as $api, u as useRouter } from './package_CJwS4JJH.mjs';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { u as useAsyncRetry } from './useAsyncRetry_RBGU_9EX.mjs';

const useCartServices = () => {
  const router = useRouter();
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get("v1/basket");
  }, []);
  const errorStatus = error?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return {
    data: value?.data?.data,
    loading,
    error,
    retry
  };
};
const useCartHook = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { incrementCartCount } = useCart();
  const addToCart = async (product) => {
    try {
      setLoading(true);
      const response = await $api.post("v1/basket/add", transformData(product));
      incrementCartCount();
      toast.success(`تمت إضافة ${product.name} إلى سلة التسوق`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return response.data;
    } catch (error) {
      handleError(error, router);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const updateCount = async (product) => {
    try {
      setLoading(true);
      const { data } = await $api.post("update-count", {
        cart_item_id: product?.cart_item_id,
        qty: product?.qty
      });
      toast.success(`تم تحديث ${product.product_name} في سلة التسوق`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const removeFromCart = async (product) => {
    try {
      setLoading(true);
      const { data } = await $api.delete(
        `v1/basket/delete/${product.cart_item_id.cart_item_id}`
      );
      router.refresh();
      toast.success(`تم حذف ${product.cart_item_id.product_name} من السلة`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return data;
    } catch (error) {
      toast.error(`فشل حذف من السلة: ${error?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
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
    removeFromCart
  };
};
function handleError(error, router) {
  if (error?.status === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  toast.error(`فشل إضافة للسلة: ${error?.response?.data?.message}`, {
    position: "top-right",
    autoClose: 2e3,
    rtl: true
  });
}
function transformData(product) {
  const data = {
    product_id: product?.id,
    count: product?.count || 1
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
    data.variations = product.variations;
  }
  return data;
}

export { useCartServices as a, useCartHook as u };
