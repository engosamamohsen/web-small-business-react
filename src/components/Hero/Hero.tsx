import { fetchingData } from "@/hooks/fetching";
import SwiperBanner from "./SwiperBanner";
import { revalidateTime } from "@/constants/constansts";

export default async function Hero() {
  const response = await getHeroServer();
  if (response?.isSuccess) {
    return <SwiperBanner response={response} />;
  } else {
    return <></>;
  }
}

async function getHeroServer(): Promise<{
  bannerData: any[];
  isSuccess: boolean;
}> {
  try {
    const response = await fetchingData({
      url: `v1/banner`,
      type: { next: { revalidate: revalidateTime } },
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
    console.log(error);
    return {
      bannerData: [],
      isSuccess: false,
    };
  }
}
