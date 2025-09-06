import { cookies } from "next/headers";
import { fetchHook } from "./fetch-hook";

export async function fetchSettings() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  try {
    const res = await fetchHook({
      url: `/v1/setting-profile`,
      init: { next: { revalidate: 600 } },
      token,
    });
    console.log("_v1.0.........");
    console.log("res_v1.0", res);
    return res.ok ? { ...res.data, ok: true } : null;
  } catch (error) {
    console.log(error);
    return { ok: false, status: 500, error: error, isLogin: false };
  }
}
