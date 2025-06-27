import { Metadata } from "next";
import LoginForm from "./LoginForm";
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

export default async function Login() {
  const settingResponse = await fetchSettings();

  return <LoginForm initSettings={settingResponse.data} />;
}
