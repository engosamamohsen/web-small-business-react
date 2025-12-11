import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { getSettings, fetchPublicSettings } from "@/hooks/fetchSettings";
import ColorHandler from "@/layouts/ColorHandler";
import Header from "@/layouts/Header/Header";
import LoginHandler from "@/layouts/LoginHandler";
import packageJson from "../../package.json";
import { cookies } from "next/headers";

// Font optimization - load only needed weights
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
  preload: true,
});

// Dynamic import for Footer (not critical for initial render)
const Footer = dynamic(() => import("@/layouts/Footer"), {
  ssr: true,
  loading: () => <div className="h-40 animate-pulse bg-gray-50" />,
});

const appVersion = packageJson.version;

// CSS imports - order matters!
import "./globals.css";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

/**
 * Build WhatsApp link from phone number
 */
function buildWhatsAppLink(phone?: string | null): string | null {
  if (!phone) return null;
  const digitsOnly = phone.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  return `https://wa.me/${encodeURIComponent(digitsOnly)}`;
}

/**
 * Generate dynamic metadata
 * Uses cached fetchPublicSettings - no duplicate calls
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings();

  const defaultMeta: Metadata = {
    title: "Business Platform",
    description: "Small business management platform",
    icons: [],
    keywords: ["small business", "online store", "ecommerce"],
    alternates: { canonical: "/" },
    openGraph: {
      title: "Business Platform",
      description: "Small business management platform",
      images: [],
      type: "website",
      locale: "ar_SA",
      siteName: "Business Platform",
    },
    twitter: {
      card: "summary_large_image",
      title: "Business Platform",
      description: "Small business management platform",
      images: [],
    },
    metadataBase: new URL("https://example.com"),
  };

  if (!settings?.ok || !settings?.data) {
    return defaultMeta;
  }

  const { data } = settings;
  const siteName = data.name || "Business Platform";
  const description = data.about_us || "Small business management platform";
  const logo = data.logo ? [data.logo] : [];
  const baseUrl = data.website_url || "https://example.com";

  return {
    title: siteName,
    description,
    icons: logo,
    keywords: data.keywords || ["small business", "online store", "ecommerce"],
    alternates: { canonical: baseUrl },
    openGraph: {
      title: siteName,
      description,
      images: logo,
      type: "website",
      locale: "ar_SA",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: logo,
    },
    metadataBase: new URL(baseUrl),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Single API call - cached and deduped with metadata call
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;
  const settingResponse = await getSettings();

  const settingsData = settingResponse?.data;
  const isLogin = settingResponse?.ok ? Boolean(settingResponse?.is_login) : undefined;
  const whatsappLink = buildWhatsAppLink(settingsData?.whatsapp_phone);

  return (
    <html lang="ar" dir="rtl">
      <body className={`relative ${cairo.className}`}>
        <LoginHandler isLogin={isLogin} />
        <ColorHandler globalData={settingsData} />
        <Header settingsData={settingsData} token={token} isLogin={isLogin} />

        {children}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر الواتساب"
            className="group fixed left-4 top-40 z-50"
          >
            <div className="flex h-12 w-12 items-center overflow-hidden rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 group-hover:w-[150px] group-hover:shadow-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                <i className="pi pi-whatsapp text-2xl" />
              </div>
              <span className="max-w-0 translate-x-2 whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[100px] group-hover:translate-x-0 group-hover:opacity-100">
                تواصل معنا
              </span>
            </div>
            <span className="sr-only">تواصل معنا عبر الواتساب</span>
          </a>
        )}

        <Footer settingsData={settingsData} appVersion={appVersion} />
        <ToastContainer position="bottom-right" rtl />
      </body>
    </html>
  );
}