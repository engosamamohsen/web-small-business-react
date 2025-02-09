import DetailPage from "./DetailPage";
import { fetchingData } from "@/hooks/fetching";
import { revalidateTime } from "@/constants/constansts";
import { notFound } from "next/navigation";
import { ProductType } from "@/lib/types";
import { Metadata } from "next";
import { getDefaultStore } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";

export async function generateMetadata(): Promise<Metadata> {
  const store = getDefaultStore();
  const settings = store.get(settingsDataAtom);

  return {
    title: settings?.name || "",
    description: settings?.about_us || "",
    icons: settings?.logo ? [settings.logo] : [],
    keywords: settings?.keywords || [],
    // openGraph: {
    //   title: settings?.name || "",
    //   description: settings?.about_us || "",
    //   images: settings?.logo ? [settings.logo] : [],
    // },
  };
}

type PageProps = {
  params: Promise<{ product_id: string }>;
};
async function page({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.product_id;

  const response = await fetchingData({
    url: `/product-details?product_id=${productId}`,
    type: { next: { revalidate: revalidateTime } },
  });

  if (response?.isSuccess && response.data) {
    const product: ProductType = response?.data?.data;
    return <DetailPage product={product} />;
  } else {
    notFound();
  }
}

export default page;
