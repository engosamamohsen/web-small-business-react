import { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import { fetchPublicSettings } from "@/hooks/fetchSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settingResponse = await fetchPublicSettings();

  if (!settingResponse?.ok) {
    return {
      title: "إنشاء حساب جديد",
      description: "إنشاء حساب جديد للوصول إلى جميع ميزات موقعنا",
      icons: [],
      keywords: ["تسجيل", "حساب جديد", "إنشاء حساب"],
      openGraph: {
        title: "إنشاء حساب جديد",
        description: "Register",
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
      title: `إنشاء حساب جديد | ${settingResponse?.data?.name || ""}`,
      description:
        settingResponse?.data?.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: settingResponse?.data?.logo ? [settingResponse?.data.logo] : [],
    },
  };
}

export default async function Register() {
  const settingResponse = await fetchPublicSettings();
  return <RegisterForm initSettings={settingResponse?.data} />;
}
