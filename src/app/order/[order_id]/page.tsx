import OrderDetail from "@/components/Orders/Detail/OrderDetail";

type PageProps = {
  params: Promise<{ order_id: string }>;
};
async function page({ params }: PageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.order_id;

  return <OrderDetail orderId={orderId} />;
}

export default page;
