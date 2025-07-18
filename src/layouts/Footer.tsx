"use client";
import Image from "next/image";

import { Facebook, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";

export default function Footer({ settingsData }: { settingsData: any }) {
  const pathname = usePathname();

  return (
    <footer
      className={cn(
        "bg-black py-10 text-white",
        pathname.startsWith("/products") ? "max-md:pb-72" : "",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 max-md:flex-col">
          <p className="text-sm max-md:hidden">جميع الحقوق محفوظة 2020</p>
          <div className="flex items-center justify-center gap-2 text-center">
            <h4 className="text-[15px] text-xl font-bold text-[var(--main-color)]">
              {settingsData?.name ? settingsData?.name : ""}
            </h4>
            {settingsData?.logo && (
              <Image
                src={settingsData?.logo}
                alt="logo app"
                width={80}
                height={80}
                className="mr-[6px]"
              />
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={settingsData?.facebook_link}
              target="_blank"
              aria-label="Visit our Facebook page"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Facebook size={20} />
            </a>
            <a
              href={settingsData?.instagram_link}
              target="_blank"
              aria-label="Visit our Instagram page"
              className="transform transition-all duration-300 ease-in-out hover:scale-125 hover:text-orange-500"
            >
              <Instagram size={20} />
            </a>
          </div>
          <p className="text-sm md:hidden">جميع الحقوق محفوظة 2020</p>
        </div>
      </div>
    </footer>
  );
}
