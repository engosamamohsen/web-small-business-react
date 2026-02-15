import React from "react";

export default function WhatsAppButton({ phone }: { phone?: string }) {
    if (!phone) return null;
    
    // Clean phone number for WhatsApp
    // Handle Egypt numbers: +201001234567 -> 201001234567
    let digits = phone.replace(/^\+/, ""); // Remove + prefix
    
    // If starts with 0 (local Egypt number), convert to country code
    if (digits.startsWith("0")) {
        digits = "20" + digits.slice(1);
    }
    
    // Remove any non-digit characters
    digits = digits.replace(/\D/g, "");
    
    // Ensure it starts with country code
    if (!digits.startsWith("20")) {
        digits = "20" + digits;
    }
    
    const link = `https://wa.me/${digits}`;

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
