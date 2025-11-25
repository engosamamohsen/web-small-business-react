import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { fetchSettings } from "@/hooks/fetchSettings";
const cairo = Cairo({ subsets: ["arabic"] });
import { getDefaultStore } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";
import ColorHandler from "@/layouts/ColorHandler";
import packageJson from "../../package.json";



const Footer = dynamic(() => import("@/layouts/Footer"), {
  ssr: true,
  loading: () => <div className="h-40 animate-pulse bg-gray-50"></div>,
});

const appVersion = packageJson.version;

import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "./globals.css";
import Header from "@/layouts/Header/Header";
import LoginHandler from "@/layouts/LoginHandler";

// 🔹 helper to build wa.me link from backend phone
// 🔹 helper to build encoded wa.me link from backend phone
function buildWhatsAppLink(phone?: string | null): string | null {
  if (!phone) return null;

  const digitsOnly = phone.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  const encodedPhone = encodeURIComponent(digitsOnly);

  return `https://wa.me/${encodedPhone}`;
}


// Generate dynamic metadata with enhanced SEO
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();

  console.log(settings);

  if (!settings?.ok) {
    return {
      title: "Business Platform",
      description: "Small business management platform",
      icons: [],
      keywords: ["small business", "online store", "ecommerce"],
      alternates: {
        canonical: "/",
      },
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
  } else {
    const siteName = settings?.data?.name || "Business Platform";
    const description =
      settings?.data?.about_us || "Small business management platform";
    return {
      title: siteName,
      description: description,
      icons: settings?.data?.logo ? [settings?.data?.logo] : [],
      keywords: settings?.data?.keywords || [
        "small business",
        "online store",
        "ecommerce",
      ],
      alternates: {
        canonical: settings?.data?.website_url || "/",
      },
      openGraph: {
        title: siteName,
        description: description,
        images: settings?.data?.logo ? [settings.data.logo] : [],
        type: "website",
        locale: "ar_SA",
        siteName: siteName,
      },
      twitter: {
        card: "summary_large_image",
        title: siteName,
        description: description,
        images: settings?.data?.logo ? [settings.data.logo] : [],
      },
      metadataBase: new URL(
        settings?.data?.website_url || "https://example.com",
      ),
    };
  }
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

  const whatsappLink = buildWhatsAppLink(
    settingResponse?.data?.whatsapp_phone,
  );

  return (
    <html lang="ar" dir="rtl">
      <body className={`relative ${cairo.className}`}>
        <LoginHandler isLogin={settingResponse?.is_login ?? false} />
        <ColorHandler globalData={settingResponse?.data} />
        <Header settingsData={settingResponse?.data} />

        {children}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر الواتساب"
            className="group fixed top-40 left-4 z-50"
          >
            <div
              className="
        flex items-center
        h-12 w-12
        rounded-full bg-green-500 text-white shadow-lg
        overflow-hidden
        transition-all duration-300
        group-hover:w-[150px] group-hover:shadow-xl
      "
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                <i className="pi pi-whatsapp text-2xl" />
              </div>

              <span
                className="
          whitespace-nowrap text-sm font-medium
          opacity-0 max-w-0 translate-x-2
          transition-all duration-300
          group-hover:opacity-100 group-hover:max-w-[100px] group-hover:translate-x-0
        "
              >
                تواصل معنا
              </span>
            </div>

            <span className="sr-only">تواصل معنا عبر الواتساب</span>
          </a>
        )}

        <Footer settingsData={settingResponse?.data} appVersion={appVersion} />

        <ToastContainer position="bottom-right" rtl />
      </body>
    </html>
  );
}
