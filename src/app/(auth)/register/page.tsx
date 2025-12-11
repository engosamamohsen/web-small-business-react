import { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import { fetchPublicSettings } from "@/hooks/fetchSettings";

// Generate metadata - uses cached settings
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings();

  const defaultMeta: Metadata = {
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

  if (!settings?.ok || !settings?.data) {
    return defaultMeta;
  }

  const { data } = settings;
  const siteName = data.name || "";
  const logo = data.logo ? [data.logo] : [];

  return {
    title: `إنشاء حساب جديد | ${siteName}`,
    description: data.about_us || "أنشئ حساب جديد للوصول إلى جميع ميزات موقعنا",
    icons: logo,
    keywords: [...(data.keywords || []), "تسجيل", "حساب جديد", "إنشاء حساب"],
    openGraph: {
      title: `إنشاء حساب جديد | ${siteName}`,
      description: data.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: logo,
    },
  };
}

// Page component - reuses cached settings from metadata
export default async function Register() {
  // This call is deduped with the generateMetadata call above
  const settings = await fetchPublicSettings();

  return <RegisterForm initSettings={settings?.data} />;
}