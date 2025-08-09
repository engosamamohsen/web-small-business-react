import { useAsyncRetry } from "react-use";
import { $api } from "@/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { PaymentMethod } from "@/lib/types";

export const usePaymentMethods = () => {
  const router = useRouter();
  const { value, loading, error, retry } = useAsyncRetry(async () => {
    return $api.get("/payment/methods");
  }, []);
  const errorStatus = (error as any)?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/login");
  }
  return { data: value?.data?.data as PaymentMethod[], loading, retry };
};
