import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { fetchSettings } from "@/hooks/fetchSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settingResponse = await fetchSettings();

  return {
    title: `استعادة كلمة المرور | ${settingResponse?.data?.name || ""}`,
    description:
      settingResponse?.data?.about_us || "استعادة كلمة المرور للوصول إلى حسابك",
    icons: settingResponse?.data?.logo ? [settingResponse?.data.logo] : [],
    keywords: [
      ...(settingResponse?.data?.keywords || []),
      "استعادة كلمة المرور",
      "نسيت كلمة المرور",
    ],
    openGraph: {
      title: `استعادة كلمة المرور | ${settingResponse?.data?.name || ""}`,
      description:
        settingResponse?.data?.about_us || "استعادة كلمة المرور بسهولة",
      images: settingResponse?.data?.logo ? [settingResponse?.data.logo] : [],
    },
  };
}

export default async function ForgotPassword() {
  const settingResponse = await fetchSettings();

  return <ForgotPasswordForm initSettings={settingResponse?.data} />;
}
