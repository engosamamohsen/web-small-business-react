import { settingsDataAtom } from "@/lib/stores/settingsData";
import { getDefaultStore } from "jotai";
import Image from "next/image";

import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const store = getDefaultStore();
  const settingsData = store.get(settingsDataAtom);
  return (
    <footer className="bg-black py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 max-sm:flex-col">
          <p className="text-sm max-sm:hidden">جميع الحقوق محفوظة 2020</p>
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
          <p className="text-sm sm:hidden">جميع الحقوق محفوظة 2020</p>
        </div>
      </div>
    </footer>
  );
}
