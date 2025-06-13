import CheckoutPage from "@/components/Checkout/Checkout";
import { fetchingData } from "@/hooks/fetching";
import { cookies } from "next/headers";
async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const response = await fetchingData({
    url: `v1/basket`,
    type: { cache: "no-store" },
    token,
  });

  return <CheckoutPage items={response?.data?.data || []} />;
}
export default CartPage;
