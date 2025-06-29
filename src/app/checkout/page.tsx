import CheckoutPage from "@/components/Checkout/Checkout";

export const metadata = {
  title: "Checkout",
  description: "Checkout page",
};

async function CartPage() {
  return <CheckoutPage />;
}
export default CartPage;
