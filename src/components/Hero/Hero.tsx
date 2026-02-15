import SwiperBanner from "./SwiperBanner";
// import { revalidateTime } from "@/constants/constansts";

interface HeroProps {
  bannerData: any[];
}

export default function Hero({ bannerData }: HeroProps) {
  if (bannerData?.length) {
    return <SwiperBanner response={{ bannerData, isSuccess: true }} />;
  }

  return null;
}
