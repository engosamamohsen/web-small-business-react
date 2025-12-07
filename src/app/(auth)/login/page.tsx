import { Metadata } from "next";
import LoginForm from "./LoginForm";
import { fetchPublicSettings } from "@/hooks/fetchSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settingResponse = await fetchPublicSettings();

  if (!settingResponse?.ok) {
    return {
      title: "تسجيل الدخول",
      description: "تسجيل الدخول للوصول إلى جميع ميزات موقعنا",
      icons: [],
      keywords: ["تسجيل", "دخول", "تسجيل الدخول"],
      openGraph: {
        title: "تسجيل الدخول",
        description: "Login",
        images: [],
      },
    };
  }
  return {
    title: `إنشاء حساب جديد | ${settingResponse?.data?.name || ""}`,
    description:
      settingResponse?.data?.about_us ||
      "أنشئ حساب جديد للوصول إلى جميع ميزات موقعنا",
    icons: settingResponse?.data?.logo ? [settingResponse?.data.logo] : [],
    keywords: [
      ...(settingResponse?.data?.keywords || []),
      "تسجيل",
      "حساب جديد",
      "إنشاء حساب",
    ],
    openGraph: {
      title: `تسجيل الدخول | ${settingResponse?.data?.name || ""}`,
      description:
        settingResponse?.data?.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: settingResponse?.data?.logo ? [settingResponse?.data.logo] : [],
    },
  };
}

export default async function Login() {
  const settingResponse = await fetchPublicSettings();

  return <LoginForm initSettings={settingResponse?.data} />;
}
