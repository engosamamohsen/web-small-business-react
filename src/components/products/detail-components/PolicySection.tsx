import { useState, memo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";

interface PolicySectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const PolicySection = memo(({
    title,
    icon,
    children,
    defaultOpen = false,
}: PolicySectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <button
                onClick={() => setIsOpen((p) => !p)}
                className="flex w-full items-center justify-between gap-3 px-6 py-4 text-right transition hover:bg-slate-50"
                aria-expanded={isOpen}
            >
                <ChevronDown
                    size={20}
                    className={cn(
                        "flex-shrink-0 text-slate-400 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
                <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-slate-800">{title}</span>
                    <span className="text-2xl">{icon}</span>
                </div>
            </button>

            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-100 px-6 py-5 text-right text-sm leading-relaxed text-slate-600">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
});

PolicySection.displayName = "PolicySection";
