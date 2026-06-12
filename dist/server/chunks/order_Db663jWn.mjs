import { $ as $api, u as useRouter } from './package_DEA60gZM.mjs';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { u as useAsync } from './useAsync_R33OG2Tx.mjs';

const useOrderServices = () => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.get("v1/orders");
  }, []);
  const errorStatus = error?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return { data: value?.data?.data, loading };
};
const useOrderDetailServices = (orderId) => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.get(`v1/orders/details?order_id=${orderId}`);
  }, [orderId]);
  const errorStatus = error?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return { data: value?.data?.data, loading };
};
const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const createPayment = async (paymentId, orderId) => {
    try {
      setLoading(true);
      const data = await $api.post(`v1/orders/pay`, {
        payment_method_id: paymentId,
        order_id: orderId
      });
      toast.success(`تمت الدفع بنجاح`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return data;
    } catch (err) {
      toast.error(`  فشل الدفع : ${err?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return err?.response;
    } finally {
      setLoading(false);
    }
  };
  return {
    createPayment,
    loading
  };
};

export { useOrderDetailServices as a, useOrderServices as b, usePayment as u };
