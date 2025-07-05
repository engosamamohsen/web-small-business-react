import { $api } from "@/client";

import { useAsync } from "react-use";
import { OrderType } from "@/lib/types";
import { OrderDetailType } from "@/components/Orders/Detail/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
