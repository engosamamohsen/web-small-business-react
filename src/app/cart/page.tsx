import Cart from "@/components/Cart/Cart";
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
  console.log("response", response);
  return <Cart items={response.data?.data || []} />;
}
export default CartPage;
