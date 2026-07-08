import { useState, memo, useCallback, lazy, Suspense } from "react";
import { useCartHook } from "@/hooks/cart/cart";
import { ProductType, SizeOption, ColorOption } from "@/lib/types";
import Cookies from "js-cookie";
import { useUpdateEffect } from "react-use";
import { cn } from "@/utils/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import { ShoppingCart, Zap, Plus, Minus } from "lucide-react";
import { useSettings } from "@/providers";
import { storeConfig } from "@/lib/store-config";
import { getDiscountedPrice, getEffectiveDiscount } from "@/lib/pricing-utils";

// Lazy-load AuthDialog — only needed when user is not logged in
const AuthDialog = lazy(() => import("@/components/auth/AuthDialog"));

interface FormattedVariation {
    main_variation_id: string;
    main_variation_name: string;
    choices: { id: string; name: string; price: number }[];
}

interface FormattedVariations {
    variations: FormattedVariation[];
}

interface CartActionsProps {
    product: ProductType;
    totalPrice: number;
    currentColor: ColorOption | null;
    currentSize: SizeOption | null;
    selectedVariations: FormattedVariations;
    productVariations: { is_required?: boolean; id?: string }[];
    onAddedToCart?: () => void;
    settings?: Record<string, any> | null;
}

export const CartActions = memo(({
    product,
    currentColor,
    currentSize,
    selectedVariations,
    productVariations,
    totalPrice,
    onAddedToCart,
    settings: settingsProp,
}: CartActionsProps) => {
    const [count, setCount] = useState(1);
    const [productNote, setProductNote] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    // Track what action to run after successful login: "cart" | "buynow"
    const [pendingAction, setPendingAction] = useState<"cart" | "buynow" | null>(null);

    const { loading, addToCart } = useCartHook();
    // Prefer explicitly-passed prop (works across Astro island boundaries)
    // Fall back to context (works when rendered inside a shared SettingsProvider)
    const { settings: contextSettings } = useSettings();
    const settings = settingsProp ?? contextSettings;
    // Discount derived from `discount` OR from price→price_after (mirrors
    // PriceDisplay). totalPrice is the full PRE-discount total (base + additions),
    // so the discount applies to the additions too — price 100, +10 addition,
    // 10% off → 99, not 90 + 10 = 100.
    const discount = getEffectiveDiscount(
        product.price,
        product.discount,
        product.price_after,
    );

    const finalPrice = getDiscountedPrice(totalPrice * count, discount);
    // Final per-unit price (variations + discount included) — the local cart
    // stores this so BASIC-plan prices match what the user saw.
    const finalUnitPrice = getDiscountedPrice(totalPrice, discount);

    // ── Core cart add (called directly or after login) ──────────────────────
    const doAddToCart = useCallback(async () => {
        try {
            const { variations } = selectedVariations;
            await addToCart({
                ...product,
                count,
                currentColor,
                currentSize,
                product_note: productNote,
                variations,
                local_unit_price: finalUnitPrice,
                // Pre-discount per-unit price (variation-inclusive) so the cart
                // can show before-vs-after discount.
                local_original_unit_price: totalPrice,
            });
            setProductNote("");
            onAddedToCart?.();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة"
            );
        }
    }, [selectedVariations, addToCart, product, count, currentColor, currentSize, productNote, finalUnitPrice, totalPrice, onAddedToCart]);

    // ── Core buy now (called directly or after login) ────────────────────────
    const doBuyNow = useCallback(async () => {
        try {
            const { variations } = selectedVariations;
            await addToCart({
                ...product,
                count,
                currentColor,
                currentSize,
                product_note: productNote,
                variations,
                local_unit_price: finalUnitPrice,
                // Pre-discount per-unit price (variation-inclusive) so the cart
                // can show before-vs-after discount.
                local_original_unit_price: totalPrice,
            });
            window.location.href = "/shop/cart";
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة"
            );
        }
    }, [selectedVariations, addToCart, product, count, currentColor, currentSize, productNote, finalUnitPrice, totalPrice]);

    // ── Auth guard ────────────────────────────────────────────────────────────
    const requireAuth = useCallback((action: "cart" | "buynow") => {
        // BASIC plan: cart is local — never ask the user to authenticate
        if (!storeConfig.canAuthenticate) return true;

        const token = Cookies.get("app_token");
        if (!token) {
            setPendingAction(action);
            setShowAuthDialog(true);
            return false;
        }
        return true;
    }, []);

    const handleAddToCart = useCallback(async () => {
        if (!requireAuth("cart")) return;
        await doAddToCart();
    }, [requireAuth, doAddToCart]);

    const handleBuyNow = useCallback(async () => {
        if (!requireAuth("buynow")) return;
        await doBuyNow();
    }, [requireAuth, doBuyNow]);

    // ── Called by AuthDialog after successful login ───────────────────────────
    const handleLoginSuccess = useCallback(async () => {
        setShowAuthDialog(false);
        if (pendingAction === "cart") {
            await doAddToCart();
        } else if (pendingAction === "buynow") {
            await doBuyNow();
        }
        setPendingAction(null);
    }, [pendingAction, doAddToCart, doBuyNow]);

    useUpdateEffect(() => {
        if (!productVariations.length) return;
        const requiredVariations = productVariations.filter((v) => v.is_required);
        const available = requiredVariations.every((main) =>
            selectedVariations.variations.some((v) => v.main_variation_id == main.id)
        );
        setIsAvailable(available);
    }, [productVariations, selectedVariations]);

    return (
        <>
            <div className="mt-4 flex flex-col gap-4">
                {/* Product Note */}
                <div className="mt-4 w-full">
                    <label
                        htmlFor="product-note"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        ملاحظات المنتج (اختياري)
                    </label>
                    <InputTextarea
                        id="product-note"
                        value={productNote}
                        onChange={(e) => setProductNote(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]/20"
                        placeholder="اكتب أي ملاحظات خاصة بالمنتج هنا..."
                    />
                </div>

                {/* Quantity Counter */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">الكمية</span>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2">
                        <button
                            onClick={() => setCount((p) => Math.max(p - 1, 1))}
                            disabled={count <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="min-w-[2rem] text-center text-lg font-bold text-gray-800">
                            {count}
                        </span>
                        <button
                            onClick={() => setCount((p) => p + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                {/* Action Buttons — fixed on mobile, inline on desktop */}
                <div
                    className={cn(
                        "flex gap-3",
                        "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-30",
                        "max-md:flex-row max-md:bg-white max-md:px-4 max-md:py-4 max-md:pb-6",
                        "max-md:shadow-[0_-4px_24px_rgba(0,0,0,0.10)] max-md:border-t max-md:border-gray-100",
                        "md:flex-row md:items-stretch"
                    )}
                >
                    {/* Add to Cart — outlined */}
                    <button
                        disabled={loading || !isAvailable}
                        onClick={handleAddToCart}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--main-color)] px-5 py-3.5 text-sm font-bold text-[var(--main-color)] transition-all duration-200",
                            "hover:bg-[var(--main-color)]/8 active:scale-[0.98]",
                            (loading || !isAvailable) && "cursor-not-allowed border-gray-300 text-gray-400"
                        )}
                    >
                        {loading ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--main-color)] border-t-transparent" />
                        ) : (
                            <ShoppingCart size={16} />
                        )}
                        <span>أضف للسلة</span>
                        <span className="text-xs opacity-70">{finalPrice} ج.م</span>
                    </button>

                    {/* Buy Now — filled → goes to /shop/cart */}
                    <button
                        disabled={loading || !isAvailable}
                        onClick={handleBuyNow}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200",
                            "hover:opacity-90 active:scale-[0.98]",
                            (loading || !isAvailable) && "cursor-not-allowed bg-gray-300"
                        )}
                    >
                        <Zap size={16} />
                        <span>اشتري الآن</span>
                    </button>
                </div>

                {/* Spacer so fixed bar doesn't overlap content on mobile */}
                <div className="h-20 md:hidden" />
            </div>

            {/* Auth Dialog — shown when user is not logged in (premium only) */}
            {storeConfig.canAuthenticate && (
                <Suspense fallback={null}>
                    <AuthDialog
                        visible={showAuthDialog}
                        onHide={() => {
                            setShowAuthDialog(false);
                            setPendingAction(null);
                        }}
                        initSettings={settings || {}}
                        onSuccess={handleLoginSuccess}
                    />
                </Suspense>
            )}
        </>
    );
});

CartActions.displayName = "CartActions";
