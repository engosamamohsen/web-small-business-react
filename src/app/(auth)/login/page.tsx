import { Metadata } from "next";
import LoginForm from "./LoginForm";
import { fetchPublicSettings } from "@/hooks/fetchSettings";

// Generate metadata - uses cached settings
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings();

  const defaultMeta: Metadata = {
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

  if (!settings?.ok || !settings?.data) {
    return defaultMeta;
  }

  const { data } = settings;
  const siteName = data.name || "";
  const logo = data.logo ? [data.logo] : [];

  return {
    title: `تسجيل الدخول | ${siteName}`,
    description: data.about_us || "انضم إلينا واحصل على تجربة مميزة",
    icons: logo,
    keywords: [...(data.keywords || []), "تسجيل", "دخول", "تسجيل الدخول"],
    openGraph: {
      title: `تسجيل الدخول | ${siteName}`,
      description: data.about_us || "انضم إلينا واحصل على تجربة مميزة",
      images: logo,
    },
  };
}

// Page component - reuses cached settings from metadata
export default async function Login() {
  // This call is deduped with the generateMetadata call above
  const settings = await fetchPublicSettings();

  return <LoginForm initSettings={settings?.data} />;
}