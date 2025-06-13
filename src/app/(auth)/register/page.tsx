import { Metadata } from "next";
import styles from "./style.module.css";
import RegisterForm from "./RegisterForm";
import { fetchSettings } from "@/hooks/fetchSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settingResponse = await fetchSettings();

  return {
    title: `إنشاء حساب جديد | ${settingResponse.data?.name || ""}`,
    description:
      settingResponse.data?.about_us ||
      "أنشئ حساب جديد للوصول إلى جميع ميزات موقعنا",
    icons: settingResponse.data?.logo ? [settingResponse.data.logo] : [],
    keywords: [
      ...(settingResponse.data?.keywords || []),
      "تسجيل",
      "حساب جديد",
      "إنشاء حساب",
    ],
    openGraph: {
      title: `إنشاء حساب جديد | ${settingResponse.data?.name || ""}`,
      description:
        settingResponse.data?.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: settingResponse.data?.logo ? [settingResponse.data.logo] : [],
    },
  };
}

export default async function Register() {
  const settingResponse = await fetchSettings();

  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center bg-[var(--second-background)] px-9 py-10">
      <div
        className={`flex h-fit w-full max-w-fit flex-col items-center justify-center gap-4 rounded-md bg-[var(--main-background)] px-10 ${styles["boxFrom"]}`}
      >
        <RegisterForm initSettings={settingResponse.data} />
      </div>
    </div>
  );
}
