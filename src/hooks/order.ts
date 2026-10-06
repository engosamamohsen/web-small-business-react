import { $api } from "@/client";

import { useAsyncRetry } from "react-use";
import { OrderType } from "@/lib/types";
import { OrderDetailType } from "@/components/Orders/Detail/types";
import Cookies from "js-cookie";
import { useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

/** An expired or missing token: sign out and go to the login page. */
function useSignOutOnAuthError(error: unknown) {
  const router = useRouter();
  const status = (error as any)?.status ?? (error as any)?.response?.status;
  if (status === 401 || status === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
}

export const useOrderServices = () => {
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get("v1/orders");
  }, []);
  useSignOutOnAuthError(error);
  return { data: value?.data?.data as OrderType[], loading, reload: retry };
};

export const useOrderDetailServices = (orderId: number | string) => {
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get(`v1/orders/details?order_id=${orderId}`);
  }, [orderId]);
  useSignOutOnAuthError(error);
  return { data: value?.data?.data as OrderDetailType, loading, reload: retry };
};

/** The customer cancels their own order (only while the store hasn't started preparing it). */
export const useCancelOrder = () => {
  const [loading, setLoading] = useState(false);

  const cancelOrder = async (orderId: number | string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await $api.post(`v1/orders/customer-cancel`, { order_id: orderId });
      toast.success(data?.message || "تم إلغاء طلبك.", { position: "top-right", autoClose: 2500, rtl: true });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر إلغاء الطلب. حاول مرة أخرى.", {
        position: "top-right",
        autoClose: 4000,
        rtl: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cancelOrder, loading };
};

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  // create a new expense
  const createPayment = async (
    paymentId: number | string,
    orderId: number | string,
  ) => {
    try {
      setLoading(true);

      const data = await $api.post(`v1/orders/pay`, {
        payment_method_id: paymentId,
        order_id: orderId,
      });
      toast.success(`تمت الدفع بنجاح`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });

      return data;
    } catch (err: any) {
      toast.error(`  فشل الدفع : ${err?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2000,
        rtl: true,
      });
      return err?.response;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
  };
};
