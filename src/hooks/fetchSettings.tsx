import { cookies } from "next/headers";
import { fetchingData } from "./fetching";

export async function fetchSettings() {
  const cookieStore = await cookies();

  const CurrentToken = cookieStore.get("app_token");
  try {
    const settingResponse = await fetchingData({
      url: "v1/setting-profile",
      type: { next: { revalidate: 600 } },
      token: CurrentToken?.value,
    });
    return settingResponse?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
