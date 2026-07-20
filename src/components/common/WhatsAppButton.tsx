import React from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp-order";

export default function WhatsAppButton({ phone }: { phone?: string | null }) {
    // null for missing OR placeholder/default numbers — hide the button rather
    // than link to a fake line. Normalization (incl. country code) is shared.
    const link = buildWhatsAppLink(phone);
    if (!link) return null;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:bottom-8 sm:left-8"
            aria-label="Contact on WhatsApp"
        >
            <i className="pi pi-whatsapp text-2xl" />
        </a>
    );
}
