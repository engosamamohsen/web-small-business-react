"use client";

import { useSettingsServices } from "@/hooks/Settings";
import dynamic from "next/dynamic";

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

const ColorHandler = dynamic(() => import("@/layouts/ColorHandler"), {
  ssr: true,
});
function SubLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useSettingsServices();

  console.log("settingResponse", data);
  return (
    <>
      <LoginHandler isLogin={data?.is_login ?? false} />
      <ColorHandler globalData={data?.data} />
      <Header settingsData={data?.data} />
      {children}

      <Footer settingsData={data?.data ?? {}} />
    </>
  );
}

export default SubLayout;
