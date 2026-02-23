"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "react-toastify";

interface ShareButtonProps {
    productName: string;
    className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ productName, className = "" }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: productName,
            text: `تفقد هذا المنتج: ${productName}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                toast.success("تم نسخ الرابط بنجاح");
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error("Error copying link:", err);
                toast.error("فشل نسخ الرابط");
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95 ${className}`}
            title="مشاركة المنتج"
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span>تم النسخ</span>
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4 text-[var(--main-color)]" />
                    <span>مشاركة</span>
                </>
            )}
        </button>
    );
};
