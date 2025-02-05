import { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import styles from "./style.module.css";
import { fetchSettings } from "@/hooks/fetchSettings";
import { settingsDataAtom } from "@/lib/stores/settingsData";
import { getDefaultStore } from "jotai";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await fetchSettings();

  return {
    title: `إنشاء حساب جديد | ${settings?.name || ""}`,
    description:
      settings?.about_us || "أنشئ حساب جديد للوصول إلى جميع ميزات موقعنا",
    icons: settings?.logo ? [settings.logo] : [],
    keywords: [
      ...(settings?.keywords || []),
      "تسجيل",
      "حساب جديد",
      "إنشاء حساب",
    ],
    openGraph: {
      title: `إنشاء حساب جديد | ${settings?.name || ""}`,
      description: settings?.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: settings?.logo ? [settings.logo] : [],
    },
  };
}

export default function Register() {
  const store = getDefaultStore();

  store.set(settingsDataAtom, {
    page: "register",
    ...store.get(settingsDataAtom),
  });
  const settings = store.get(settingsDataAtom);

  console.log("settings-server-register", store.get(settingsDataAtom));
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center bg-[var(--second-background)] px-9 py-10">
      <div
        className={`flex h-fit w-full max-w-fit flex-col items-center justify-center gap-4 rounded-md bg-[var(--main-background)] px-10 ${styles["boxFrom"]}`}
      >
        <RegisterForm initSettings={settings} />
      </div>
    </div>
  );
}
