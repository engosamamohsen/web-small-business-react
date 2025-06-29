import Cart from "@/components/Cart/Cart";
import { fetchingData } from "@/hooks/fetching";
import { cookies } from "next/headers";
import Link from "next/link";

// Force dynamic rendering since this page uses cookies
export const dynamic = "force-dynamic";

async function CartPage() {
  const { basketData } = await getCartServices();
  if (basketData.length === 0) {
    return (
      <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">عربة التسوق فارغة</h2>
        <Link
          href="/"
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }
  return <Cart items={basketData || []} />;
}
export default CartPage;

async function getCartServices(): Promise<{
  basketData: any;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("app_token")?.value;
    const response = await fetchingData({
      url: `v1/basket`,
      type: { cache: "no-store" },
      token,
    });
    const basketData = response?.data?.data;
    if (!basketData) {
      return {
        basketData: [],
      };
    }

    return {
      basketData,
    };
  } catch (error) {
    console.log(error);
    return {
      basketData: [],
    };
  }
}
