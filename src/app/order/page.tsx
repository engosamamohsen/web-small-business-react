import OrderList from "@/components/Orders/OrderList/OrderList";
import { cookies } from "next/headers";
import { fetchingData } from "@/hooks/fetching";

async function page() {
  const { ordersData } = await getOrdersServices();
  return <OrderList orders={ordersData || []} />;
}

export default page;

async function getOrdersServices(): Promise<{
  ordersData: any[];
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("app_token")?.value;
    const response = await fetchingData({
      url: `v1/orders`,
      type: { cache: "no-store" },
      token,
    });

    const ordersData = response?.data?.data;
    if (!ordersData) {
      return {
        ordersData: [],
      };
    }

    return {
      ordersData,
    };
  } catch (error) {
    console.log(error);
    return {
      ordersData: [],
    };
  }
}
