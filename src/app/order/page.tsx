import OrderList from "@/components/Orders/OrderList/OrderList";

export const metadata = {
  title: "طلباتي",
  description: "طلباتي ",
};

async function page() {
  return <OrderList />;
}

export default page;
