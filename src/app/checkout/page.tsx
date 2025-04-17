import CheckoutPage from "@/components/Checkout/Checkout";
import { fetchingData } from "@/hooks/fetching";
import { cookies } from "next/headers";
async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const response = await fetchingData({
    url: `/basket`,
    type: { cache: "no-store" },
    token,
  });
  const addressResponse = await fetchingData({
    url: `/customers/address`,
    type: { cache: "no-store" },
    token,
  });

  return (
    <CheckoutPage
      items={response?.data?.data || []}
      address={addressResponse?.data?.data || []}
    />
  );
}
export default CartPage;
