import OrderDetail from "@/components/Orders/Detail/OrderDetail";
import { fetchingData } from "@/hooks/fetching";
import { cookies } from "next/headers";
type PageProps = {
  params: Promise<{ order_id: string }>;
};
async function page({ params }: PageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.order_id;
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;

  const response = await fetchingData({
    url: `v1/orders/details?order_id=${orderId}`,
    type: { cache: "no-store" },
    token,
  });

  // Check if response has data property and it contains order information
  const orderData = response?.data?.data || response;
  if (!orderData) {
    return (
      <div className="container mt-20 flex min-h-[calc(100vh-300px)] items-center justify-center text-lg font-semibold">
        ليس لديك أي طلبات
      </div>
    );
  }
  return <OrderDetail order={orderData} />;
}

export default page;
