"use client";

import Image from "@/components/common/Image";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "@/lib/navigation";
import { cn } from "@/utils/utils";
import { useSettingsData } from "@/providers/SettingsProvider";

interface FooterProps {
  settingsData?: any; // Keep for backwards compatibility
  appVersion?: string;
}

export default function Footer({ settingsData, appVersion }: FooterProps) {
  const pathname = usePathname();

  // ✅ Prefer context over props (new logic)
  const contextSettings = useSettingsData();
  const settings = contextSettings || settingsData;

  const siteName = settings?.name || "Business Platform";
  const year = new Date().getFullYear();

  const hasFacebook = Boolean(settings?.facebook_link);
  const hasInstagram = Boolean(settings?.instagram_link);

  return (
    <footer
      className={cn(
        "mt-10 border-t border-white/10 bg-black/95 text-white",
        "backdrop-blur",
        pathname.startsWith("/product") ? "max-md:pb-72" : "",
      )}
    >
      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* Top row: logo + name + socials */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand block */}
          <div className="flex items-center gap-3">
            {settings?.logo && (
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                <Image
                  src={settings.logo}
                  alt={`شعار ${siteName}`}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-sm font-semibold tracking-wide text-[var(--main-color)]">
                {siteName}
              </h4>
              {settings?.about_us && (
                <p className="max-w-md text-xs leading-relaxed text-gray-300">
                  {settings.about_us}
                </p>
              )}
              {settings?.phone && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <Phone size={12} className="mt-0.5" />
                  {settings.phone.split(" ").map((p: string) => (
                    <a key={p} href={`tel:${p}`} className="hover:text-white">
                      {p}
                    </a>
                  ))}
                </div>
              )}
              {settings?.contact_email && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail size={12} className="shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-white"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings?.full_address && (
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <span>{settings.full_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Socials */}
          {(hasFacebook || hasInstagram) && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 max-md:hidden">
                تابعنا على
              </span>
              <div className="flex gap-2">
                {hasFacebook && (
                  <a
                    href={settings.facebook_link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit our Facebook page"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition-all duration-200 hover:border-[var(--main-color)] hover:bg-[var(--main-color)]/15 hover:text-[var(--main-color)]"
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {hasInstagram && (
                  <a
                    href={settings.instagram_link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit our Instagram page"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition-all duration-200 hover:border-[var(--main-color)] hover:bg-[var(--main-color)]/15 hover:text-[var(--main-color)]"
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar: rights + version */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-400 md:flex-row">
            <p className="text-center md:text-right">
              © {year} {siteName}. جميع الحقوق محفوظة.
            </p>

            {appVersion && (
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[var(--main-color)]" />
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-200">
                  الإصدار {appVersion}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
