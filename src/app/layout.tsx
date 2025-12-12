// ===== CSS Imports FIRST (order matters for styles!) =====
import "./globals.css";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

// ===== Type & Library Imports =====
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";

// ===== Local Imports =====
import { fetchSettings, fetchPublicSettings } from "@/hooks/fetchSettings";
import { SettingsProvider } from "@/providers";
import Header from "@/layouts/Header/Header";
import LoginHandler from "@/layouts/LoginHandler";
import ColorHandler from "@/layouts/ColorHandler";
import packageJson from "../../package.json";

// ===== Font Configuration =====
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  preload: true,
  variable: "--font-cairo",
});

// ===== Dynamic Imports =====
const Footer = dynamic(() => import("@/layouts/Footer"), {
  ssr: true,
  loading: () => <footer className="h-40 animate-pulse bg-gray-50" />,
});

const appVersion = packageJson.version;

// ===== Helper Functions =====
function buildWhatsAppLink(phone?: string | null): string | null {
  if (!phone) return null;
  const digitsOnly = phone.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  return `https://wa.me/${encodeURIComponent(digitsOnly)}`;
}

// ===== Metadata Generation =====
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings();

  const defaults: Metadata = {
    title: "Business Platform",
    description: "Small business management platform",
    keywords: ["small business", "online store", "ecommerce"],
    openGraph: {
      title: "Business Platform",
      description: "Small business management platform",
      type: "website",
      locale: "ar_SA",
    },
  };

  if (!settings?.ok || !settings?.data) {
    return defaults;
  }

  const { data } = settings;

  return {
    title: data.name || defaults.title,
    description: data.about_us || defaults.description,
    icons: data.logo ? [{ url: data.logo }] : [],
    keywords: data.keywords || defaults.keywords,
    alternates: {
      canonical: data.website_url || "/",
    },
    openGraph: {
      title: data.name || "Business Platform",
      description: data.about_us || "Small business management platform",
      images: data.logo ? [{ url: data.logo }] : [],
      type: "website",
      locale: "ar_SA",
      siteName: data.name,
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.about_us,
      images: data.logo ? [data.logo] : [],
    },
    metadataBase: new URL(data.website_url || "https://example.com"),
  };
}

// ===== Root Layout =====
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;

  // Fetch settings ONCE - cached and deduped with generateMetadata
  const settingsResponse = await fetchSettings(token);

  // Extract data with defaults
  const settingsData = settingsResponse?.data ?? null;
  const isLogin = settingsResponse?.ok ? Boolean(settingsResponse?.is_login) : false;
  const cartCount = settingsResponse?.cart_count ?? 0;
  const whatsappLink = buildWhatsAppLink(settingsData?.whatsapp_phone);

  console.log("Settings Data:", settingsData);
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`relative ${cairo.className}`}>
        {/* Global Provider - Settings available to ALL children */}
        <SettingsProvider
          initialSettings={settingsData}
          isLogin={isLogin}
          cartCount={cartCount}
          token={token}
        >
          {/* These components read from SettingsProvider context - no props needed! */}
          <LoginHandler />
          <ColorHandler />
          <Header />

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* WhatsApp Floating Button */}
          {whatsappLink && <WhatsAppButton link={whatsappLink} />}

          {/* Footer */}
          <Footer settingsData={settingsData} appVersion={appVersion} />

          {/* Toast Notifications */}
          <ToastContainer
            position="bottom-right"
            rtl
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SettingsProvider>
      </body>
    </html>
  );
}

// ===== WhatsApp Button Component =====
function WhatsAppButton({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر الواتساب"
      className="group fixed left-4 top-40 z-50"
    >
      <div
        className="
          flex h-12 w-12 items-center overflow-hidden
          rounded-full bg-green-500 text-white shadow-lg
          transition-all duration-300
          group-hover:w-[150px] group-hover:shadow-xl
        "
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
          <i className="pi pi-whatsapp text-2xl" />
        </div>
        <span
          className="
            max-w-0 translate-x-2 whitespace-nowrap text-sm font-medium
            opacity-0 transition-all duration-300
            group-hover:max-w-[100px] group-hover:translate-x-0 group-hover:opacity-100
          "
        >
          تواصل معنا
        </span>
      </div>
      <span className="sr-only">تواصل معنا عبر الواتساب</span>
    </a>
  );
}