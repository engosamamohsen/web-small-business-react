import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { fetchSettings } from "@/hooks/fetchSettings";
const cairo = Cairo({ subsets: ["arabic"] });
import { getDefaultStore } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";
import ColorHandler from "@/layouts/ColorHandler";

// Use dynamic imports for layout components
const Header = dynamic(() => import("@/layouts/Header/Header"), {
  ssr: true,
  loading: () => <div className="h-16 animate-pulse bg-gray-50"></div>,
});

const Footer = dynamic(() => import("@/layouts/Footer"), {
  ssr: true,
  loading: () => <div className="h-40 animate-pulse bg-gray-50"></div>,
});

const LoginHandler = dynamic(() => import("@/layouts/LoginHandler"), {
  ssr: true,
});
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "./globals.css";

// Generate dynamic metadata with enhanced SEO
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await fetchSettings();
  const siteName = settings?.name || "Business Platform";
  const description =
    settings?.about_us || "Small business management platform";

  return {
    title: siteName,
    description: description,
    icons: settings?.logo ? [settings.logo] : [],
    keywords: settings?.keywords || [
      "small business",
      "online store",
      "ecommerce",
    ],
    alternates: {
      canonical: settings?.website_url || "/",
    },
    openGraph: {
      title: siteName,
      description: description,
      images: settings?.logo ? [settings.logo] : [],
      type: "website",
      locale: "ar_SA",
      siteName: siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: description,
      images: settings?.logo ? [settings.logo] : [],
    },
    metadataBase: new URL(settings?.website_url || "https://example.com"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingResponse = await fetchSettings();
  const store = getDefaultStore();
  store.set(settingsDataAtom, {
    ...store.get(settingsDataAtom),
    ...settingResponse?.data,
  });
  console.log("settingResponse", settingResponse);
  // Cookie handling moved to client component
  return (
    <html lang="ar" dir="rtl">
      <body className={`relative ${cairo.className}`}>
        <LoginHandler isLogin={settingResponse.is_login} />
        <ColorHandler globalData={settingResponse} />
        <Header settingsData={settingResponse?.data} />

        {children}

        <Footer settingsData={settingResponse?.data} />
        <ToastContainer position="bottom-right" rtl />
      </body>
    </html>
  );
}
