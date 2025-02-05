"use server";

import { settingsDataAtom } from "@/lib/stores/settingsData";
import { SettingsType } from "@/lib/types";
import { getDefaultStore } from "jotai";
import { revalidatePath } from "next/cache";

export async function updateServerSettings(data: SettingsType) {
  const store = getDefaultStore();
  store.set(settingsDataAtom, data); // تحديث الـ Atom في الخادم
  console.log("Server Updated:", store.get(settingsDataAtom));
  revalidatePath("/register"); // تحديث البيانات في العميل
}

export async function getServerSettings() {
  const store = getDefaultStore();
  return store.get(settingsDataAtom);
}
// "use server";
// import { cookies } from "next/headers";

// export async function createCookieStore(data: any) {
//   const cookieStore = await cookies();

//   cookieStore.set("app_data", JSON.stringify(data), {
//     httpOnly: false, // Prevents client-side JavaScript from accessing the cookie
//     secure: false, // Ensures the cookie is only sent over HTTPS
//     maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
//     path: "/", // Cookie is available across the entire site
//   });

//   return { success: true, message: "كوكيز اتبعتت بنجاح!" };
// }
