"use client";

import { useEffect, useRef } from "react";
import { X, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { useCartServices } from "@/hooks/cart/cart";
import { cn } from "@/utils/utils";
import { CartItemType } from "@/types/types";

interface CartPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

// ─── Mini cart item ────────────────────────────────────────────────────────────
const MiniCartItem = ({ item }: { item: CartItemType }) => {
    const qty = parseInt(item.qty);
    const total = item.item_total ?? Number(item.unit_price) * qty;

    return (
        <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
                <Image
                    src={item.product_image || "/placeholder-image.jpg"}
                    alt={item.product_name ? `صورة المنتج ${item.product_name}` : "صورة منتج في السلة"}
                    fill
                    sizes="64px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 text-right">
                    {item.product_name}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-orange-500">{total} ج.م</span>
                    <span>الكمية: {qty}</span>
                </div>
                {item.variations && item.variations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {item.variations.map((v) =>
                            v.choices.map((c) => (
                                <span
                                    key={c.id}
                                    className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                                >
                                    {c.name}
                                </span>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Shared props for sub-panels ──────────────────────────────────────────────
interface PanelContentProps extends CartPanelProps {
    items: CartItemType[];
    total: number;
    loading: boolean;
}

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────
const MobileBottomSheet = ({ isOpen, onClose, items, total, loading }: PanelContentProps) => {
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-slate-200" />
                </div>

                <div className="px-6 pb-8 pt-4 text-right">
                    {/* Success indicator */}
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <ShoppingCart className="h-7 w-7 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">تمت الإضافة للسلة ✓</p>
                        <p className="text-sm text-slate-500">المنتج أُضيف بنجاح إلى سلة التسوق</p>
                    </div>

                    {/* Mini cart items */}
                    {loading ? (
                        <div className="flex h-20 items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
                        </div>
                    ) : items.length > 0 ? (
                        <div className="mb-4 max-h-48 overflow-y-auto rounded-xl bg-slate-50 p-3">
                            {items.map((item) => (
                                <MiniCartItem key={item.cart_item_id} item={item} />
                            ))}
                            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                                <span className="text-orange-500">{total.toFixed(2)} ج.م</span>
                                <span className="text-slate-700">الإجمالي</span>
                            </div>
                        </div>
                    ) : null}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/shop/cart"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] py-4 text-base font-semibold text-white shadow-md transition hover:opacity-90"
                        >
                            <ShoppingCart size={18} />
                            عرض السلة والدفع
                        </Link>
                        <button
                            onClick={onClose}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--main-color)] py-4 text-base font-semibold text-[var(--main-color)] transition hover:bg-[var(--main-color)]/5"
                        >
                            <ArrowLeft size={18} />
                            متابعة التسوق
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// ─── Desktop Sidebar (slides in from the RIGHT) ────────────────────────────────
const DesktopSidebar = ({ isOpen, onClose, items, total, loading }: PanelContentProps) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 hidden md:block",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={sidebarRef}
                className={cn(
                    "fixed top-0 right-0 z-50 hidden h-full w-[420px] max-w-[95vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:flex",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                        aria-label="إغلاق"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800">سلة التسوق</h2>
                        <ShoppingCart size={20} className="text-[var(--main-color)]" />
                    </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <div className="flex h-40 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                                🛒
                            </div>
                            <p className="text-sm text-slate-500">السلة فارغة</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <MiniCartItem key={item.cart_item_id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-slate-100 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between text-right">
                            <span className="text-xl font-bold text-slate-800">{total.toFixed(2)} ج.م</span>
                            <span className="text-sm font-medium text-slate-500">الإجمالي</span>
                        </div>
                        <Link
                            href="/shop/checkout"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] py-4 text-base font-semibold text-white shadow-md transition hover:opacity-90"
                        >
                            إتمام الشراء
                        </Link>
                        <button
                            onClick={onClose}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            متابعة التسوق
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// ─── Main CartPanel ────────────────────────────────────────────────────────────
export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
    // Fetch cart data at the top level — shared between mobile & desktop
    const { data: cartResponse, loading, retry } = useCartServices();

    const items: CartItemType[] = cartResponse?.cart_items ?? [];
    const total: number = cartResponse?.total_price ?? 0;

    // Refetch from v1/basket every time the panel opens
    useEffect(() => {
        if (isOpen) {
            retry();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Prevent body scroll when panel is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            <MobileBottomSheet
                isOpen={isOpen}
                onClose={onClose}
                items={items}
                total={total}
                loading={loading}
            />
            <DesktopSidebar
                isOpen={isOpen}
                onClose={onClose}
                items={items}
                total={total}
                loading={loading}
            />
        </>
    );
}
