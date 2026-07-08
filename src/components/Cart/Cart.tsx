"use client";

import Link from "@/components/common/Link";
import Image from "@/components/common/Image";
import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useEffect, useRef, useState } from "react";

import { useCartHook, useCartServices } from "@/hooks/cart/cart";
import { fetchSettings } from "@/hooks/fetchSettings";
import { useCart, useSettings, type SettingsData } from "@/providers";
import { cn } from "@/utils/utils";
import { buildProductPath } from "@/lib/product-url";
import { storeConfig } from "@/lib/store-config";
import {
  buildWhatsAppGreeting,
  buildWhatsAppOrderUrl,
  isUsableWhatsappNumber,
} from "@/lib/whatsapp-order";
import { isPlusPlan, type CurrentSubscriptionPlan } from "@/lib/subscription";
import { clearLocalCart } from "@/lib/cart/local-cart";
import { getCartDiscountSummary, originalUnitPrice } from "@/lib/cart/cart-totals";
import { buildGuestOrderItems, submitGuestOrder } from "@/lib/guest-order";
import { captureElementToFile, shareImageFile } from "@/lib/cart-screenshot";
import { trackWhatsAppOrder } from "@/lib/firebase-tracker";
import { toast } from "react-toastify";
import PageLoader from "../PageLoader/PageLoader";
import OrderReceipt from "./OrderReceipt";
import { CartItemType } from "@/types/types";

// ===== Cart Item Component =====
interface CartItemProps {
  item: CartItemType;
  loading: boolean;
  updateCount: (itemId: number, quantity: number, productName: string) => void;
  removeFromCart: (item: any) => void;
  onProductClick: (productId: string, productName: string) => void;
}

const CartItem = ({
  item,
  loading,
  updateCount,
  removeFromCart,
  onProductClick,
}: CartItemProps) => {
  const quantity = parseInt(item.qty);
  const itemTotal = item.item_total ?? Number(item.unit_price) * quantity;
  const originalUnit = originalUnitPrice(item);
  const hasDiscount = originalUnit > Number(item.unit_price);
  const originalTotal = Math.round(originalUnit * quantity * 100) / 100;

  return (
    <div className="mb-4 flex w-full flex-col gap-4 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-slate-100 transition-shadow max-md:flex-col-reverse md:flex-row md:items-center md:justify-between md:gap-6">
      {/* Image + Info */}
      <div
        onClick={() => onProductClick(String(item.product_id), item.product_name)}
        className="flex w-full cursor-pointer gap-4 max-md:flex-col"
      >
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
          <Image
            src={item.product_image || "/placeholder-image.jpg"}
            alt={item.product_name ? `صورة المنتج ${item.product_name}` : "صورة منتج في السلة"}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 md:text-base">
            {item.product_name}
          </h3>

          <div className="flex flex-wrap items-baseline gap-3 text-sm">
            <span className="font-medium text-orange-500">
              {hasDiscount && (
                <span className="ml-1 text-xs font-normal text-slate-400 line-through">
                  {originalUnit} ج.م
                </span>
              )}
              {item.unit_price} ج.م
              <span className="text-xs text-slate-500"> (سعر الوحدة)</span>
            </span>
            <span className="text-xs text-slate-500">
              الكمية: <span className="font-semibold">{quantity}</span>
            </span>
            <span className="text-xs font-semibold text-slate-800">
              الإجمالي:{" "}
              {hasDiscount && (
                <span className="ml-1 font-normal text-slate-400 line-through">
                  {originalTotal} ج.م
                </span>
              )}
              <span className="text-slate-900">{itemTotal} ج.م</span>
            </span>
          </div>

          {/* Variations */}
          {item.variations && item.variations.length > 0 && (
            <div className="mt-1 flex flex-col gap-1 text-xs text-slate-600">
              {item.variations.map((variation) => (
                <div
                  key={variation.main_variation_id}
                  className="flex flex-wrap items-center gap-1"
                >
                  <span className="font-medium text-slate-700">
                    {variation.main_variation_name}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {variation.choices.map((choice) => (
                      <span
                        key={choice.id}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px]"
                      >
                        {choice.name}
                        {choice.price > 0 && (
                          <span className="text-[10px] text-slate-500">
                            (+{choice.price} ج.م)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          {item.product_note && (
            <div className="mt-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
              <span className="font-medium">ملاحظة:</span> {item.product_note}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full items-center justify-between gap-4 md:w-auto md:flex-col md:items-end">
        {/* Quantity */}
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
          <button
            disabled={loading || quantity <= 1}
            onClick={() =>
              updateCount(item.cart_item_id, quantity - 1, item.product_name)
            }
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              (loading || quantity <= 1) &&
              "cursor-not-allowed opacity-40 hover:bg-transparent"
            )}
          >
            <Minus size={16} />
          </button>
          <span className="mx-1 min-w-[2.25rem] rounded-md bg-white px-2 py-1 text-center text-sm font-semibold text-slate-800">
            {quantity}
          </span>
          <button
            disabled={loading}
            onClick={() =>
              updateCount(item.cart_item_id, quantity + 1, item.product_name)
            }
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100",
              loading && "cursor-not-allowed opacity-60"
            )}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove */}
        <button
          onClick={() => !loading && removeFromCart(item)}
          disabled={loading}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-200 transition hover:bg-red-600 hover:text-white",
            loading && "cursor-not-allowed opacity-60"
          )}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// ===== Order Summary Component =====
const OrderSummary = ({
  subtotal,
  originalSubtotal = 0,
  discountAmount = 0,
  shipping = 0,
  tax = 0,
  taxRate = 0,
  onWhatsAppOrder,
  processing = false,
  whatsappAvailable = false,
}: {
  subtotal: number;
  originalSubtotal?: number;
  discountAmount?: number;
  shipping?: number;
  tax?: number;
  taxRate?: number;
  onWhatsAppOrder?: () => void;
  processing?: boolean;
  whatsappAvailable?: boolean;
}) => {
  const total = subtotal + shipping + tax;
  const hasDiscount = discountAmount > 0;

  return (
    <div className="h-fit rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">ملخص الطلب</h2>
      <div className="mb-4 space-y-2">
        {hasDiscount && (
          <>
            <div className="flex justify-between text-slate-500">
              <span>الإجمالي قبل الخصم</span>
              <span className="line-through">
                {originalSubtotal.toFixed(2)} ج.م
              </span>
            </div>
            <div className="flex justify-between font-medium text-green-600">
              <span>الخصم</span>
              <span>- {discountAmount.toFixed(2)} ج.م</span>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <span>إجمالي المنتجات{hasDiscount ? " بعد الخصم" : ""}</span>
          <span>{subtotal?.toFixed(2)} ج.م</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between">
            <span>الضريبة{taxRate > 0 ? ` (${taxRate}%)` : ""}</span>
            <span>{tax.toFixed(2)} ج.م</span>
          </div>
        )}
        <div className="mt-2 border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>الإجمالي</span>
            <span>{total?.toFixed(2)} ج.م</span>
          </div>
        </div>
      </div>
      {storeConfig.checkoutMode === "whatsapp" ? (
        // Both tiers order via WhatsApp: the order image is shared straight into
        // WhatsApp (native share sheet, no download), falling back to a wa.me
        // text order. Plus ALSO places the guest-buy order first (handled in the
        // parent). The number is sensitive — a fake/default would route the order
        // to a stranger — so show the button ONLY when a real number is
        // available; otherwise fail closed.
        whatsappAvailable ? (
          <button
            type="button"
            onClick={onWhatsAppOrder}
            disabled={processing}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-center font-semibold text-white transition-colors hover:bg-green-600",
              processing && "cursor-not-allowed opacity-70 hover:bg-green-500",
            )}
          >
            {processing ? (
              "جارٍ تجهيز الطلب..."
            ) : (
              <>
                <i className="pi pi-whatsapp text-lg" aria-hidden="true" />
                اطلب عبر واتساب
              </>
            )}
          </button>
        ) : (
          <p className="rounded-lg bg-slate-100 py-3 text-center text-sm font-medium text-slate-500">
            الطلب عبر واتساب غير متاح حالياً
          </p>
        )
      ) : (
        <Link
          href="/shop/checkout"
          className="block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600"
        >
          إتمام الشراء
        </Link>
      )}
    </div>
  );
};

// ===== Customer Info Fields (Plus plan only) =====
// Shown on the cart for Plus-plan stores. The name / phone / full address are
// required and submitted to the basket/guest-buy order API together with an
// optional order note. Payment is always cash on delivery (payment_method = 1).
const CustomerInfoFields = ({
  name,
  phone,
  address,
  notes,
  errors,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onNotesChange,
}: {
  name: string;
  phone: string;
  address: string;
  notes: string;
  errors: { name?: boolean; phone?: boolean; address?: boolean };
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}) => (
  <div className="mb-4 rounded-lg bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold">بيانات الطلب</h2>
    <div className="space-y-4">
      <div>
        <label
          htmlFor="customer-name"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          اسم العميل <span className="text-red-500">*</span>
        </label>
        <input
          id="customer-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="ادخل اسمك بالكامل"
          aria-invalid={errors.name ? "true" : "false"}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30",
            errors.name ? "border-red-400" : "border-slate-200",
          )}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">برجاء إدخال اسم العميل</p>
        )}
      </div>
      <div>
        <label
          htmlFor="customer-phone"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <input
          id="customer-phone"
          type="tel"
          inputMode="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="01XXXXXXXXX"
          aria-invalid={errors.phone ? "true" : "false"}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-end text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30",
            errors.phone ? "border-red-400" : "border-slate-200",
          )}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">برجاء إدخال رقم هاتف صحيح</p>
        )}
      </div>
      <div>
        <label
          htmlFor="customer-address"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          العنوان بالتفصيل <span className="text-red-500">*</span>
        </label>
        <textarea
          id="customer-address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          rows={3}
          placeholder="رقم العقار، الشارع، الحي، المدينة"
          aria-invalid={errors.address ? "true" : "false"}
          className={cn(
            "w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30",
            errors.address ? "border-red-400" : "border-slate-200",
          )}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">برجاء إدخال العنوان بالتفصيل</p>
        )}
      </div>
      <div>
        <label
          htmlFor="order-notes"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          ملاحظات الطلب <span className="text-slate-400">(اختياري)</span>
        </label>
        <textarea
          id="order-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          placeholder="أي ملاحظات إضافية على الطلب"
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
      </div>
    </div>
  </div>
);

// ===== Empty Cart Component =====
const EmptyCart = () => (
  <div className="mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
      🛒
    </div>
    <h2 className="mb-2 text-2xl font-bold text-slate-900">عربة التسوق فارغة</h2>
    <p className="mb-4 text-sm text-slate-500">
      أضف بعض المنتجات لعربة التسوق للمتابعة في عملية الشراء.
    </p>
    <Link
      href="/"
      className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
    >
      العودة للتسوق
    </Link>
  </div>
);

// ===== Main Cart Component =====
export default function Cart({
  settings: propSettings,
  subscriptionPlan: propSubscriptionPlan = null,
}: {
  settings?: SettingsData | null;
  subscriptionPlan?: CurrentSubscriptionPlan | null;
}) {
  const router = useRouter();
  const { loading: cartLoading, data: cartResponse, retry } = useCartServices();
  const { loading, removeFromCart, updateCount } = useCartHook();
  const { setCartCount } = useCart();
  // React context does NOT cross Astro island boundaries, so useSettings() is
  // empty in this island. Seed from the SSR prop / context, then refresh from
  // the settings API on the client so the WhatsApp number is always the shop's
  // real, current one (and the order never falls back to the default number).
  const { settings: contextSettings } = useSettings();
  const [settings, setSettings] = useState<SettingsData | null>(
    propSettings ?? contextSettings ?? null,
  );
  // Subscription plan (current_subscription_plan) is a top-level sibling of
  // `data` — the SSR prop is authoritative because a client cache hit drops it.
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<CurrentSubscriptionPlan | null>(propSubscriptionPlan);

  // Plus-plan order details (only collected/used when isPlusOrder is true).
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [customerErrors, setCustomerErrors] = useState<{
    name?: boolean;
    phone?: boolean;
    address?: boolean;
  }>({});
  // Guards the WhatsApp order flow (API call for Plus + image capture) against
  // double submits.
  const [processing, setProcessing] = useState(false);

  // The off-screen <OrderReceipt> element captured into the order PNG that is
  // shared into WhatsApp via the native share sheet (no download).
  const receiptRef = useRef<HTMLDivElement>(null);

  // Call the settings API in the cart page itself — independent of the SSR
  // prop, which can be null (e.g. an upstream settings hiccup) or stale.
  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((res) => {
        if (cancelled || !res.ok) return;
        if (res.data) setSettings(res.data as SettingsData);
        // Only overwrite the plan when the response actually carries it — a
        // client localStorage cache hit omits current_subscription_plan, and we
        // must not clobber the SSR-provided plan with undefined.
        if (res.current_subscription_plan) {
          setSubscriptionPlan(res.current_subscription_plan);
        }
      })
      .catch(() => {
        // keep the SSR-seeded settings on failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only true for a real, non-placeholder number — drives whether the WhatsApp
  // order button is shown at all (fail closed when absent/fake).
  const whatsappAvailable = isUsableWhatsappNumber(settings?.whatsapp_phone);

  // Plus tier (in WhatsApp checkout mode) replaces the wa.me deep link with a
  // real server order via basket/guest-buy — it collects name / phone / address.
  // Basic / unknown tier keeps the WhatsApp button.
  const isPlusOrder =
    isPlusPlan(subscriptionPlan) && storeConfig.checkoutMode === "whatsapp";

  // Order tax. The backend applies VAT (settings.vat — a percentage) to the
  // subtotal; mirror it here so the cart total matches the order that gets
  // placed. Verified against real orders: order.tax = sub_total × vat%,
  // total = sub_total + tax (service/shipping are 0 for web orders). A missing
  // / zero vat → no tax line, total = subtotal.
  const taxRate = parseFloat(String(settings?.vat ?? 0)) || 0;
  const subtotal = cartResponse?.total_price ?? 0;
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;

  // Before/after-discount products totals (shown in the summary, receipt and
  // WhatsApp message). Derived from the cart items' original_unit_price.
  const discountSummary = getCartDiscountSummary(cartResponse?.cart_items ?? []);

  // WhatsApp order — the two tiers deliberately differ:
  //   • Plus: validate name/phone/address → POST basket/guest-buy
  //     (payment_method = 1) → render the order to a PNG (off-screen
  //     <OrderReceipt>) and push it into WhatsApp via the native share sheet
  //     (NO download); if the device can't share a file, fall back to a wa.me
  //     FULL-text order. The server order is placed regardless, so the cart is
  //     cleared even if the customer dismisses the share sheet.
  //   • Basic: NO screenshot and NO form — the order goes to WhatsApp as a
  //     wa.me FULL-text message (primary), and is ALSO recorded server-side via
  //     basket/guest-buy (best-effort; empty customer fields — the details reach
  //     the shop through the WhatsApp text).
  const handleWhatsAppOrder = async () => {
    const items = cartResponse?.cart_items ?? [];
    if (!items.length) return;

    // Plus tier: customer fields are required and go into the API order + the
    // order image. Validate before doing anything irreversible.
    if (isPlusOrder) {
      const name = customerName.trim();
      const phoneDigits = customerPhone.replace(/[^\d]/g, "");
      const address = customerAddress.trim();
      const errors = {
        name: !name,
        phone: phoneDigits.length < 7 || phoneDigits.length > 15,
        address: !address,
      };
      if (errors.name || errors.phone || errors.address) {
        setCustomerErrors(errors);
        toast.error("برجاء إدخال اسم العميل ورقم هاتف صحيح والعنوان", {
          rtl: true,
        });
        return;
      }
      setCustomerErrors({});
    }

    // Fail closed on a missing/placeholder number BEFORE placing a Plus order we
    // couldn't deliver (the number is also the text-fallback target).
    if (!isUsableWhatsappNumber(settings?.whatsapp_phone)) {
      toast.error("رقم الواتساب غير متوفر حالياً", { rtl: true });
      return;
    }

    const greeting = buildWhatsAppGreeting(settings?.name, settings?.shop_type);
    const customer = isPlusOrder
      ? { name: customerName, address: customerAddress }
      : null;
    const orderTotal = subtotal + (isPlusOrder ? taxAmount : 0);

    const finishOrder = (message: string) => {
      clearLocalCart();
      setCartCount(0);
      retry();
      toast.success(message, { rtl: true });
    };

    setProcessing(true);
    try {
      // ── Basic tier: TEXT WhatsApp order + background guest-buy record ───────
      // The wa.me text message is still the primary order channel (it carries the
      // product details to the shop). We ALSO record the order server-side via
      // basket/guest-buy — Basic has no customer form, so name / phone / address /
      // notes are sent empty; the details reach the shop through the WhatsApp text.
      if (!isPlusOrder) {
        trackWhatsAppOrder().catch(() => {});
        const textUrl = buildWhatsAppOrderUrl(items, orderTotal, settings, customer);
        const win = textUrl ? window.open(textUrl, "_blank") : null;
        if (win) {
          try {
            win.opener = null;
          } catch {
            // cross-origin — ignore
          }
          // Record the order server-side, best-effort (fire-and-forget so an API
          // failure never blocks the WhatsApp flow). Fired only AFTER the wa.me
          // window opened, so a blocked-popup retry can't double-record.
          submitGuestOrder({
            items: buildGuestOrderItems(items),
            payment_method: 1, // cash on delivery (online not enabled yet)
            order_type: "takeaway", // Basic has no address → takeaway
            full_name: "",
            full_address: "",
            phone: "",
            notes: "",
          }).catch(() => {});
          finishOrder("تم تجهيز طلبك عبر واتساب");
        } else {
          // Nothing opened / recorded → keep the cart so the user can retry.
          toast.error("تعذر فتح واتساب — يرجى السماح بالنوافذ المنبثقة", {
            rtl: true,
          });
        }
        return;
      }

      // ── Plus tier: SHARE the image FIRST (keep the click "fresh"), place the
      // server order alongside it ────────────────────────────────────────────
      // navigator.share() needs transient user activation. Awaiting the
      // guest-buy POST *before* the share spends that activation, so the share
      // throws (NotAllowedError) and the image silently degrades to a text
      // order — the reported "no screenshot" bug. So: capture the PNG, fire the
      // order request (don't await it yet, so it can't block the share), share
      // while the gesture is still valid, then confirm the order landed.
      const file = await captureElementToFile(
        receiptRef.current,
        `order-${Date.now()}.png`,
      );

      // Place the real server order. Kept in flight (mapped so it never rejects)
      // until after the share so the network round-trip can't cost us the share
      // activation.
      const orderResult = submitGuestOrder({
        items: buildGuestOrderItems(items),
        payment_method: 1, // cash on delivery (online not enabled yet)
        order_type: "delivery", // Plus collects an address → delivery
        full_name: customerName.trim(),
        full_address: customerAddress.trim(),
        phone: customerPhone.trim(),
        notes: orderNotes.trim(),
      }).then(
        () => ({ ok: true as const }),
        (error: any) => ({ ok: false as const, error }),
      );

      // Push the order image straight into WhatsApp (native share sheet) with
      // the greeting as the caption. No download, ever.
      const result = file ? await shareImageFile(file, greeting) : "failed";

      // Now confirm the order actually landed. On failure surface the message and
      // keep the cart so the customer can retry (the image may already be shared,
      // which the shop still receives in WhatsApp).
      const order = await orderResult;
      if (!order.ok) {
        const message =
          order.error?.response?.data?.message ||
          "تعذر تأكيد الطلب، حاول مرة أخرى";
        toast.error(message, { rtl: true });
        return;
      }

      // Fire-and-forget order counter.
      trackWhatsAppOrder().catch(() => {});

      if (result === "shared") {
        finishOrder("تم إرسال صورة طلبك عبر واتساب");
        return;
      }

      if (result === "cancelled") {
        // Customer dismissed the share sheet, but the Plus order is already
        // placed server-side → clear and confirm.
        finishOrder("تم استلام طلبك");
        return;
      }

      // "unsupported" / "failed" → this device can't share a file. Fall back to
      // a wa.me FULL-text order to the shop number (still no download). The order
      // is placed server-side regardless of whether the popup opens.
      const fallbackUrl = buildWhatsAppOrderUrl(
        items,
        orderTotal,
        settings,
        customer,
      );
      const win = fallbackUrl ? window.open(fallbackUrl, "_blank") : null;
      if (win) {
        try {
          win.opener = null;
        } catch {
          // cross-origin — ignore
        }
      }
      finishOrder("تم استلام طلبك");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "تعذر تأكيد الطلب، حاول مرة أخرى";
      toast.error(message, { rtl: true });
    } finally {
      setProcessing(false);
    }
  };

  // Sync cart count when data changes
  useEffect(() => {
    if (cartResponse?.cart_items) {
      const totalCount = cartResponse.cart_items.reduce(
        (sum: number, item: CartItemType) => sum + Number(item.qty ?? 0),
        0
      );
      setCartCount(totalCount);
    } else {
      setCartCount(0);
    }
  }, [cartResponse, setCartCount]);

  if (cartLoading) {
    return <PageLoader text="جاري تحميل عربة التسوق" />;
  }

  if (!cartResponse?.cart_items?.length) {
    return <EmptyCart />;
  }

  const handleProductClick = (productId: string, productName: string) => {
    // Cart items carry no slug — the details page 301s to the canonical slug
    router.push(buildProductPath({ id: productId, name: productName }));
  };

  const handleUpdateCount = async (
    itemId: number,
    newQuantity: number,
    productName: string
  ) => {
    const response = await updateCount({
      cart_item_id: itemId,
      qty: newQuantity,
      product_name: productName,
    });
    if (response?.status) retry();
  };

  const handleRemoveFromCart = async (item: any) => {
    const response = await removeFromCart({ cart_item_id: item });
    if (response?.status) retry();
  };

  return (
    <div className="mx-auto my-10 min-h-[800px] max-w-7xl px-4 py-8">
      {/* Off-screen order image captured to PNG for the WhatsApp attachment. */}
      <OrderReceipt
        ref={receiptRef}
        greeting={buildWhatsAppGreeting(settings?.name, settings?.shop_type)}
        items={cartResponse.cart_items}
        customer={
          isPlusOrder
            ? {
                name: customerName,
                phone: customerPhone,
                address: customerAddress,
              }
            : undefined
        }
        subtotal={subtotal}
        originalSubtotal={discountSummary.originalSubtotal}
        discountAmount={discountSummary.discountAmount}
        vatRate={isPlusOrder ? taxRate : 0}
        vatAmount={isPlusOrder ? taxAmount : 0}
        total={subtotal + (isPlusOrder ? taxAmount : 0)}
      />

      <h1 className="mb-2 text-3xl font-bold text-slate-900">عربة التسوق</h1>
      <p className="mb-6 text-sm text-slate-500">
        يمكنك تعديل الكمية أو إزالة المنتجات قبل إتمام الطلب.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="max-h-[520px] overflow-y-auto rounded-2xl bg-slate-50 p-4 lg:p-6">
          {cartResponse.cart_items.map((item) => (
            <CartItem
              key={item.cart_item_id}
              item={item}
              loading={loading}
              updateCount={handleUpdateCount}
              removeFromCart={handleRemoveFromCart}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <div className="lg:self-start">
          {isPlusOrder && (
            <CustomerInfoFields
              name={customerName}
              phone={customerPhone}
              address={customerAddress}
              notes={orderNotes}
              errors={customerErrors}
              onNameChange={(value) => {
                setCustomerName(value);
                if (customerErrors.name) {
                  setCustomerErrors((prev) => ({ ...prev, name: false }));
                }
              }}
              onPhoneChange={(value) => {
                setCustomerPhone(value);
                if (customerErrors.phone) {
                  setCustomerErrors((prev) => ({ ...prev, phone: false }));
                }
              }}
              onAddressChange={(value) => {
                setCustomerAddress(value);
                if (customerErrors.address) {
                  setCustomerErrors((prev) => ({ ...prev, address: false }));
                }
              }}
              onNotesChange={setOrderNotes}
            />
          )}
          <OrderSummary
            subtotal={cartResponse.total_price}
            originalSubtotal={discountSummary.originalSubtotal}
            discountAmount={discountSummary.discountAmount}
            tax={isPlusOrder ? taxAmount : 0}
            taxRate={isPlusOrder ? taxRate : 0}
            onWhatsAppOrder={handleWhatsAppOrder}
            processing={processing}
            whatsappAvailable={whatsappAvailable}
          />
        </div>
      </div>
    </div>
  );
}
