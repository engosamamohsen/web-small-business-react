import Cookies from "js-cookie";
import { fetchingData } from "./fetching";

export async function fetchSettings() {
  try {
    const settingResponse = await fetchingData({
      url: "v1/setting-profile",
      type: { next: { revalidate: 600 } },
      token: Cookies.get("app_token"),
    });
    return settingResponse?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
