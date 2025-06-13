import OrderList from "@/components/Orders/OrderList/OrderList";
import { cookies } from "next/headers";
import { fetchingData } from "@/hooks/fetching";

async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const response = await fetchingData({
    url: `v1/orders`,
    type: { cache: "no-store" },
    token,
  });

  // Extract orders data from response
  const orders = response?.data?.data || [];
  console.log(orders);
  return <OrderList orders={orders} />;
}

export default page;
