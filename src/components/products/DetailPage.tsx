"use client";
import parse from "html-react-parser";
import { ProductType } from "@/lib/types";
import { useProductOptions } from "./hooks/useProductOptions";
import { useMemo, useState, lazy, Suspense } from "react";
import { useSettingsData } from "@/providers/SettingsProvider";
import type { SettingsData } from "@/providers/SettingsProvider";

// Detail sub-components
import {
    ProductGallery,
    PriceDisplay,
    VariationsSelector,
    ProductOptions,
    CartActions,
    ProductSpecifications,
    PolicySection,
    ShareButton,
} from "./detail-components";

// Cart panel (lazy — not needed until user clicks "Add to Cart")
const CartPanel = lazy(() => import("@/components/Cart/CartPanel"));

export default function DetailPage({
    product,
    settings: settingsProp,
}: {
    product: ProductType;
    settings?: SettingsData | null;
}) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    // Prefer explicitly-passed prop (works across Astro island boundaries)
    // Fall back to context (works when rendered inside a SettingsProvider)
    const contextSettings = useSettingsData();
    const settings = settingsProp ?? contextSettings;


    const {
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        selectedVariations,
        handleRadioChange,
        handleCheckboxChange,
        isChoiceSelected,
        currentPrice,
    } = useProductOptions(product);

    const formattedVariations = useMemo(() => {
        // Carry the human-readable variation/choice names + prices so the local
        // (BASIC-plan) cart and the WhatsApp order message can show the selection.
        // The premium API path normalizes this back to {main_variation_id, choices:[id]}
        // in cart.ts → transformData().
        const variations = Object.entries(selectedVariations).map(([variationId, choice]) => {
            const def = product.variations?.find((v) => v.id === variationId);
            return {
                main_variation_id: variationId,
                main_variation_name: def?.name ?? "",
                choices: [{ id: choice.id, name: choice.name, price: Number(choice.price) || 0 }],
            };
        });
        return { variations };
    }, [selectedVariations, product.variations]);

    const parsedDescription = useMemo(() => {
        return parse(product?.description || "");
    }, [product?.description]);

    return (
        <>
            <div className="container flex min-h-screen flex-col items-center justify-center py-10">
                {/* ── Main product card ── */}
                <div className="grid w-full grid-cols-1 gap-8 rounded-2xl bg-gray-50 p-6 shadow-sm lg:grid-cols-2 lg:p-10">
                    {/* Gallery */}
                    <div>
                        <ProductGallery product={product} />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                            <ShareButton productName={product.name} />
                        </div>

                        {/* Category / Sub-category badges */}
                        <div className="flex flex-wrap gap-2">
                            {product?.category?.name && (
                                <span className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                                    {product.category.name}
                                </span>
                            )}
                            {product?.sub_category?.name && (
                                <span className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                                    {product.sub_category.name}
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        {product?.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full bg-[var(--main-color)]/10 px-3 py-0.5 text-xs font-medium text-[var(--main-color)]"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Price */}
                        <PriceDisplay product={product} currentPrice={currentPrice} />

                        {/* Description */}
                        {product?.description && (
                            <div className="mt-2 text-sm leading-relaxed text-slate-600">
                                {parsedDescription}
                            </div>
                        )}

                        {/* Description steps */}
                        {product?.description_steps && product.description_steps.length > 0 && (
                            <div className="mt-3">
                                <h3 className="mb-2 text-base font-semibold text-slate-800">
                                    المواصفات الأساسية
                                </h3>
                                <ul className="space-y-1.5">
                                    {product.description_steps.map((step, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]" />
                                            <span className="text-sm text-slate-700">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Variations */}
                        {product.variations && product.variations.length > 0 && (
                            <VariationsSelector
                                variations={product.variations}
                                handleRadioChange={handleRadioChange}
                                handleCheckboxChange={handleCheckboxChange}
                                isChoiceSelected={isChoiceSelected}
                            />
                        )}

                        {/* Size / Color options */}
                        <ProductOptions
                            sizes={product.sizes}
                            colors={product.colors}
                            selectedSize={selectedSize}
                            selectedColor={selectedColor}
                            onSizeSelect={setSelectedSize}
                            onColorSelect={setSelectedColor}
                        />

                        {/* Cart actions (two buttons) */}
                        <CartActions
                            product={product}
                            productVariations={product?.variations || []}
                            totalPrice={currentPrice}
                            currentColor={selectedColor}
                            currentSize={selectedSize}
                            selectedVariations={formattedVariations}
                            onAddedToCart={() => setIsCartOpen(true)}
                            settings={settings}
                        />
                    </div>
                </div>

                {/* ── Technical specifications ── */}
                {product.technicalInformation && product.technicalInformation.length > 0 && (
                    <div className="mt-8 w-full">
                        <ProductSpecifications
                            specifications={product.technicalInformation}
                            className="w-full"
                        />
                    </div>
                )}

                {/* ── Policy sections ── */}
                <div className="mt-6 w-full space-y-4">
                    {/* Return Policy */}
                    <PolicySection title="سياسة العائدات" icon="↩️">
                        <div className="space-y-4 text-right">
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">شروط العودة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>يمكن للعملاء طلب إرجاع المنتج خلال 14 يومًا من تاريخ استلام الطلب.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>يجب أن يكون المنتج بحالته الأصلية وغير مستخدم ومزود بجميع الملصقات والتغليف الأصلي.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">إجراءات العودة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>يجب على العميل الاتصال بخدمة العملاء لتقديم طلب الإرجاع والحصول على تعليمات التعبئة والشحن.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>يلتزم العميل بتغليف المنتج بشكل آمن قبل إرساله إلى مركز الإرجاع.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">المبالغ المستردة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>بعد استلام المنتج ومعاينته، سيتم استرداد المبلغ المدفوع حسب طريقة الدفع المستخدمة.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>قد يتم خصم تكاليف الشحن من المبلغ المسترد في حالة الإرجاعات التي لا تتعلق بخطأ في المتجر.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">الاستثناءات</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>لا يتم قبول إرجاع المنتجات المعدلة أو المستعملة.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>قد لا تكون بعض المنتجات قابلة للإرجاع لأسباب تتعلق بالصحة أو السلامة، وسيتم توضيح ذلك عند الشراء.</span></li>
                                </ul>
                            </section>
                        </div>
                    </PolicySection>

                    {/* COD Policy */}
                    <PolicySection title="سياسة الدفع عند التسليم" icon="💵">
                        <div className="space-y-4 text-right">
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">تعريف الخدمة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>خدمة الدفع عند الاستلام تتيح للعملاء دفع قيمة الطلب نقدًا أو عن طريق البطاقة الائتمانية عند استلام المنتج مباشرة.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">شروط الخدمة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>هذه الخدمة متاحة في مناطق محددة فقط، وسيتم توضيحها أثناء عملية الشراء.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>قد يتم فرض رسوم إضافية على هذه الخدمة وفقًا لسياسة المتجر.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">إجراءات الدفع</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>عند تسليم الطلب، يطلب من العميل دفع كامل المبلغ نقدًا أو عن طريق بطاقة الائتمان حسب الخيارات المتاحة.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>إذا لم يكن العميل متواجدًا وقت التسليم، فقد يتم إلغاء الطلب أو إعادة جدولة التسليم.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">مزايا الخدمة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>يمنح العملاء الثقة في استلام المنتج قبل الدفع.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>تسهيل عملية الشراء للأشخاص الذين لا يفضلون الدفع الإلكتروني.</span></li>
                                </ul>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">ملاحظات هامة</h4>
                                <ul className="space-y-1.5 text-slate-600">
                                    <li className="flex gap-2"><span>•</span><span>قد يختلف وقت إعداد الطلب والشحن عند اختيار الدفع عند الاستلام بسبب الإجراءات الإضافية.</span></li>
                                    <li className="flex gap-2"><span>•</span><span>لا يمكن إرجاع الطلبات المدفوعة نقدًا عند الاستلام إلا وفقًا لسياسة الإرجاع العامة.</span></li>
                                </ul>
                            </section>
                        </div>
                    </PolicySection>

                    {/* Shipping Policy */}
                    <PolicySection title="سياسة الشحن" icon="🚚">
                        <div className="space-y-4 text-right">
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">1. مناطق الشحن</h4>
                                <p className="text-slate-600">نقوم بالشحن إلى جميع المحافظات داخل جمهورية مصر العربية.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">2. مدة تجهيز الطلب</h4>
                                <p className="text-slate-600">يتم تجهيز الطلب خلال مدة تتراوح بين 24 إلى 48 ساعة من تأكيد الطلب.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">3. مدة الشحن والتوصيل</h4>
                                <p className="text-slate-600">تتراوح مدة الشحن عادة بين 2 إلى 5 أيام عمل حسب المحافظة وموقع العميل.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">4. رسوم الشحن</h4>
                                <p className="text-slate-600">قد تختلف رسوم الشحن حسب موقع التوصيل ويتم توضيحها للعميل قبل إتمام عملية الشراء.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">5. تأكيد الطلب</h4>
                                <p className="text-slate-600">قد يتم التواصل مع العميل عبر الهاتف أو البريد الإلكتروني لتأكيد الطلب قبل الشحن.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">6. في حالة تأخر الشحن</h4>
                                <p className="text-slate-600">في بعض الحالات الاستثنائية (مثل العطل الرسمية أو الظروف الجوية) قد يحدث تأخير بسيط في الشحن، وسيتم إبلاغ العميل بذلك.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">7. استلام الطلب</h4>
                                <p className="text-slate-600">يرجى التأكد من سلامة المنتج عند الاستلام، وفي حال وجود أي مشكلة يرجى التواصل معنا خلال 24 ساعة من استلام الطلب.</p>
                            </section>
                            <section>
                                <h4 className="mb-2 font-bold text-slate-700">8. التواصل معنا</h4>
                                <p className="text-slate-600">
                                    في حال وجود أي استفسار بخصوص الشحن أو الطلبات يمكنكم التواصل معنا:
                                </p>
                                <ul className="mt-2 space-y-1.5 text-slate-600">
                                    {settings?.contact_email && (
                                        <li className="flex gap-2">
                                            <span>•</span>
                                            <span>البريد الإلكتروني: <a href={`mailto:${settings.contact_email}`} className="text-[var(--main-color)] hover:underline">{settings.contact_email}</a></span>
                                        </li>
                                    )}
                                    {settings?.whatsapp_phone && (
                                        <li className="flex gap-2">
                                            <span>•</span>
                                            <span>واتساب: <a href={`https://wa.me/${settings.whatsapp_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-[var(--main-color)] hover:underline">{settings.whatsapp_phone}</a></span>
                                        </li>
                                    )}
                                    {settings?.phone && (
                                        <li className="flex gap-2">
                                            <span>•</span>
                                            <span>هاتف: <a href={`tel:${settings.phone}`} className="text-[var(--main-color)] hover:underline">{settings.phone}</a></span>
                                        </li>
                                    )}
                                </ul>
                            </section>
                        </div>
                    </PolicySection>
                </div>
            </div>

            {/* Cart Panel (lazy-loaded) */}
            <Suspense fallback={null}>
                <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </Suspense>
        </>
    );
}
