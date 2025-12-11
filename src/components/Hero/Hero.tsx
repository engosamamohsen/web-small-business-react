import SwiperBanner from "./SwiperBanner";
// import { revalidateTime } from "@/constants/constansts";
import { fetchHook } from "@/hooks/fetch-hook";

export default async function Hero() {
  const response = await getHeroServer();

  if (response?.isSuccess && response?.bannerData?.length) {
    return <SwiperBanner response={response} />;
  }

  return null;
}

async function getHeroServer(): Promise<{
  bannerData: any[];
  isSuccess: boolean;
}> {
  try {
    const response = await fetchHook({
      url: "v1/banner",
      init: { next: { revalidate: 60 } }, // Cache for 60 seconds
    });

    const bannerData = response?.data?.data;

    if (!bannerData) {
      return {
        bannerData: [],
        isSuccess: true,
      };
    }

    return {
      bannerData,
      isSuccess: true,
    };
  } catch (error) {
    // Server component - log error on server
    console.error("Error fetching banner data:", error);
    return {
      bannerData: [],
      isSuccess: false,
    };
  }
}
