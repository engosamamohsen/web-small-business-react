import { $api } from "@/client";

import { useAsync } from "react-use";
import { OrderType } from "@/lib/types";
import { OrderDetailType } from "@/components/Orders/Detail/types";

export const useOrderServices = () => {
  const { value, loading } = useAsync(async () => {
    return $api.get("v1/orders");
  }, []);
  return { data: value?.data?.data as OrderType[], loading };
};

export const useOrderDetailServices = (orderId: number | string) => {
  const { value, loading } = useAsync(async () => {
    return $api.get(`v1/orders/details?order_id=${orderId}`);
  }, [orderId]);
  return { data: value?.data?.data as OrderDetailType, loading };
};
