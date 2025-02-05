import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/layouts/Header/Header";
import Footer from "@/layouts/Footer";
import ColorHandler from "@/layouts/ColorHandler";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { fetchSettings } from "@/hooks/fetchSettings";
const cairo = Cairo({ subsets: ["arabic"] });
import "./globals.css";
import { getDefaultStore } from "jotai";
import { settingsDataAtom } from "@/lib/stores/settingsData";
export const dynamic = "force-dynamic";
// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await fetchSettings();
  // console.log("settings", settings);

  return {
    title: settings?.name || "",
    description: settings?.about_us || "",
    icons: settings?.logo ? [settings.logo] : [],
    keywords: settings?.keywords || [],
    // openGraph: {
    //   title: settings?.name || "",
    //   description: settings?.about_us || "",
    //   images: settings?.logo ? [settings.logo] : [],
    // },
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
    ...settingResponse.data,
  });
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} relative`}>
        <ColorHandler globalData={settingResponse} />
        <Header />

        {children}

        <Footer />
        <ToastContainer position="bottom-right" rtl />
      </body>
    </html>
  );
}
