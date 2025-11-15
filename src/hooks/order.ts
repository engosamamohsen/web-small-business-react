import { $api } from "@/client";

import { useAsync } from "react-use";
import { OrderType } from "@/lib/types";
import { OrderDetailType } from "@/components/Orders/Detail/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export const useOrderServices = () => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.get("v1/orders");
  }, []);
  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/login");
  }
  return { data: value?.data?.data as OrderType[], loading };
};

export const useOrderDetailServices = (orderId: number | string) => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.get(`v1/orders/details?order_id=${orderId}`);
  }, [orderId]);
  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/login");
  }
  return { data: value?.data?.data as OrderDetailType, loading };
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
