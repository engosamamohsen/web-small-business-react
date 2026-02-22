import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead, i as addAttribute } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C9OKOB99.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import parse from 'html-react-parser';
import React__default, { useState, useEffect, useMemo, memo, lazy, useCallback, Suspense } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
/* empty css                                    */
import { s as styles } from '../../chunks/_slug_.f3890f68_BNLXg2IS.mjs';
import { u as useCartHook } from '../../chunks/cart_BD2bV6iC.mjs';
import Cookies from 'js-cookie';
import { a as useSettings, c as cn, H as Header, F as Footer, p as packageJson } from '../../chunks/package_CJwS4JJH.mjs';
import { u as useUpdateEffect, I as InputTextarea } from '../../chunks/inputtextarea.esm_vZbFMe2d.mjs';
import { toast } from 'react-toastify';
import { Minus, Plus, ShoppingCart, Zap, ChevronDown, Check, Share2 } from 'lucide-react';
import { a as fetchSettings } from '../../chunks/fetchSettings_Ldq5l7Md.mjs';
import { f as fetchHook } from '../../chunks/fetch-hook_BU6KRHu2.mjs';
export { renderers } from '../../renderers.mjs';

function useProductOptions(product) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      const initialVariations = {};
      if (product.variations) {
        product.variations.forEach((variation) => {
          const defaultChoice = variation.choices.find((c) => c.enable);
          if (defaultChoice) {
            initialVariations[variation.id] = defaultChoice;
          }
        });
        setSelectedVariations(initialVariations);
      }
    }
  }, [product]);
  const handleRadioChange = (variationId, choice) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [variationId]: choice
    }));
  };
  const handleCheckboxChange = (variationId, choice, checked) => {
    if (checked) {
      handleRadioChange(variationId, choice);
    } else {
      const newVariations = { ...selectedVariations };
      delete newVariations[variationId];
      setSelectedVariations(newVariations);
    }
  };
  const isChoiceSelected = (variationId, choiceId) => {
    return selectedVariations[variationId]?.id === choiceId;
  };
  const currentPrice = useMemo(() => {
    let price = product.price_after || product.price;
    Object.values(selectedVariations).forEach((choice) => {
      if (choice.price) price += choice.price;
    });
    if (selectedSize?.price) {
      const sizePrice = typeof selectedSize.price === "string" ? parseFloat(selectedSize.price) : selectedSize.price;
      if (!isNaN(sizePrice)) price = sizePrice;
    }
    return price;
  }, [product, selectedVariations, selectedSize]);
  return {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    selectedVariations,
    handleRadioChange,
    handleCheckboxChange,
    isChoiceSelected,
    currentPrice
  };
}

const ProductGallery = memo(({ product }) => {
  const imageCount = product?.gallery_images?.length || 0;
  const enableLoop = imageCount >= 2;
  return /* @__PURE__ */ jsx(
    Swiper,
    {
      modules: [Navigation],
      loop: enableLoop,
      navigation: true,
      autoplay: true,
      className: `${styles["product-swiper"]} !h-[608px] max-md:!h-80`,
      children: product?.gallery_images?.map((data, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("div", { className: "relative aspect-square h-full w-full", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: data || "/placeholder-image.jpg",
          alt: product?.name || "Product image",
          width: 321,
          height: 400,
          loading: index === 0 ? "eager" : "lazy",
          className: "h-[608px] !w-full !max-w-full object-contain transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
        }
      ) }) }, data))
    }
  );
});
ProductGallery.displayName = "ProductGallery";

const currency = "جنيه";

function getDiscountedPrice(price, discount) {
  const discountedPrice = price - price * discount / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

const PriceDisplay = memo(({ product, currentPrice }) => {
  const discount = product.discount ? parseInt(String(product.discount), 10) : 0;
  const priceDiscount = useMemo(() => {
    return discount > 0 ? getDiscountedPrice(currentPrice, discount) : 0;
  }, [currentPrice, discount]);
  if (discount > 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start gap-1", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-2 text-lg text-gray-500", children: /* @__PURE__ */ jsxs("bdi", { children: [
        /* @__PURE__ */ jsx("span", { children: "السعر قبل الخصم" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: " : " }),
        /* @__PURE__ */ jsxs("span", { className: "line-through", children: [
          product.price,
          " ",
          currency
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("bdi", { className: "mb-2 text-xl font-bold text-gray-900", children: [
        /* @__PURE__ */ jsx("bdi", { children: "السعر بعد الخصم" }),
        " ",
        /* @__PURE__ */ jsx("span", { children: " : " }),
        /* @__PURE__ */ jsxs("span", { children: [
          priceDiscount,
          " ",
          currency
        ] })
      ] }),
      /* @__PURE__ */ jsxs("bdi", { className: "flex items-center text-lg font-semibold text-green-600", children: [
        /* @__PURE__ */ jsxs("div", { className: "ml-1", children: [
          /* @__PURE__ */ jsx("span", { children: "وفرْت " }),
          /* @__PURE__ */ jsx("span", { children: " : " })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "ml-1", children: [
          currentPrice - priceDiscount,
          " ",
          currency
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600", children: [
          discount,
          "% خصم"
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-start justify-start gap-1", children: /* @__PURE__ */ jsxs("bdi", { className: "mb-2 text-lg font-normal text-[var(--second-color)]", children: [
    /* @__PURE__ */ jsx("bdi", { children: "السعر" }),
    " ",
    /* @__PURE__ */ jsx("span", { children: " : " }),
    /* @__PURE__ */ jsxs("span", { children: [
      currentPrice,
      " ",
      currency
    ] })
  ] }) });
});
PriceDisplay.displayName = "PriceDisplay";

const VariationsSelector = memo(({
  variations,
  handleRadioChange,
  handleCheckboxChange,
  isChoiceSelected
}) => {
  if (!variations || variations.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: variations.map((variation) => /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: variation.name }),
      variation.is_required && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-600", children: "مطلوب" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: variation.choices.map((choice) => /* @__PURE__ */ jsx("div", { className: "flex items-center", children: variation.is_required ? (
      // Radio buttons for required variations
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: `flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"}`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: `variation-${variation.id}`,
                value: choice.id,
                checked: isChoiceSelected(variation.id, choice.id),
                onChange: () => handleRadioChange(variation.id, choice),
                className: "mr-2 h-4 w-4 accent-[var(--second-color)]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: choice.name }),
            choice.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-600", children: [
              "+",
              choice.price,
              " ",
              currency
            ] })
          ]
        }
      )
    ) : (
      // Checkboxes for optional variations
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: `flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 ${isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"}`,
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                name: `variation-${variation.id}`,
                value: choice.id,
                checked: isChoiceSelected(variation.id, choice.id),
                onChange: (e) => handleCheckboxChange(variation.id, choice, e.target.checked),
                className: "mr-2 h-4 w-4 accent-[var(--second-color)]"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: choice.name }),
            choice.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-600", children: [
              "+",
              choice.price,
              " ",
              currency
            ] })
          ]
        }
      )
    ) }, choice.id)) })
  ] }, variation.id)) });
});
VariationsSelector.displayName = "VariationsSelector";

const ProductOptions = memo(({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeSelect,
  onColorSelect
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    sizes && sizes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-semibold", children: "الحجم" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: sizes.map((sizeOption) => /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": `Select size ${sizeOption.size}`,
          className: `rounded-md border px-4 py-2 ${selectedSize?.id === sizeOption.id ? "border-[var(--main-color)] text-[var(--main-color)]" : "border-gray-300"}`,
          onClick: () => onSizeSelect(sizeOption),
          children: /* @__PURE__ */ jsx("bdi", { children: sizeOption.size })
        },
        sizeOption.id
      )) })
    ] }),
    colors && colors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-semibold", children: "اللون" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: colors.map((colorOption) => /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": `Select color ${colorOption.color}`,
          className: `rounded-md border px-4 py-2 ${selectedColor?.id === colorOption.id ? "border-[var(--main-color)] text-[var(--main-color)]" : "border-gray-300"}`,
          onClick: () => onColorSelect(colorOption),
          children: /* @__PURE__ */ jsxs("bdi", { children: [
            " ",
            colorOption.color
          ] })
        },
        colorOption.id
      )) })
    ] })
  ] });
});
ProductOptions.displayName = "ProductOptions";

const AuthDialog = lazy(() => import('../../chunks/package_CJwS4JJH.mjs').then(n => n.Q));
const CartActions = memo(({
  product,
  currentColor,
  currentSize,
  selectedVariations,
  productVariations,
  totalPrice,
  onAddedToCart
}) => {
  const [count, setCount] = useState(1);
  const [productNote, setProductNote] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { loading, addToCart } = useCartHook();
  const { settings } = useSettings();
  const discount = product.discount ? parseInt(String(product.discount), 10) : 0;
  const finalPrice = discount > 0 ? getDiscountedPrice(product?.price, discount) : totalPrice * count;
  const doAddToCart = useCallback(async () => {
    try {
      const { variations } = selectedVariations;
      await addToCart({
        ...product,
        count,
        currentColor,
        currentSize,
        product_note: productNote,
        variations
      });
      setProductNote("");
      onAddedToCart?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة"
      );
    }
  }, [selectedVariations, addToCart, product, count, currentColor, currentSize, productNote, onAddedToCart]);
  const doBuyNow = useCallback(async () => {
    try {
      const { variations } = selectedVariations;
      await addToCart({
        ...product,
        count,
        currentColor,
        currentSize,
        product_note: productNote,
        variations
      });
      window.location.href = "/shop/cart";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة"
      );
    }
  }, [selectedVariations, addToCart, product, count, currentColor, currentSize, productNote]);
  const requireAuth = useCallback((action) => {
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
    const available = requiredVariations.every(
      (main) => selectedVariations.variations.some((v) => v.main_variation_id == main.id)
    );
    setIsAvailable(available);
  }, [productVariations, selectedVariations]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "mt-4 w-full", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "product-note",
            className: "mb-2 block text-sm font-medium text-gray-700",
            children: "ملاحظات المنتج (اختياري)"
          }
        ),
        /* @__PURE__ */ jsx(
          InputTextarea,
          {
            id: "product-note",
            value: productNote,
            onChange: (e) => setProductNote(e.target.value),
            rows: 3,
            className: "w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[var(--main-color)] focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]/20",
            placeholder: "اكتب أي ملاحظات خاصة بالمنتج هنا..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-600", children: "الكمية" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCount((p) => Math.max(p - 1, 1)),
              disabled: count <= 1,
              className: "flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:opacity-40",
              children: /* @__PURE__ */ jsx(Minus, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "min-w-[2rem] text-center text-lg font-bold text-gray-800", children: count }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCount((p) => p + 1),
              className: "flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100",
              children: /* @__PURE__ */ jsx(Plus, { size: 14 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "flex gap-3",
            "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-30",
            "max-md:flex-row max-md:bg-white max-md:px-4 max-md:py-4 max-md:pb-6",
            "max-md:shadow-[0_-4px_24px_rgba(0,0,0,0.10)] max-md:border-t max-md:border-gray-100",
            "md:flex-row md:items-stretch"
          ),
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: loading || !isAvailable,
                onClick: handleAddToCart,
                className: cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--main-color)] px-5 py-3.5 text-sm font-bold text-[var(--main-color)] transition-all duration-200",
                  "hover:bg-[var(--main-color)]/8 active:scale-[0.98]",
                  (loading || !isAvailable) && "cursor-not-allowed border-gray-300 text-gray-400"
                ),
                children: [
                  loading ? /* @__PURE__ */ jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-[var(--main-color)] border-t-transparent" }) : /* @__PURE__ */ jsx(ShoppingCart, { size: 16 }),
                  /* @__PURE__ */ jsx("span", { children: "أضف للسلة" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs opacity-70", children: [
                    finalPrice,
                    " ج.م"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: loading || !isAvailable,
                onClick: handleBuyNow,
                className: cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--main-color)] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200",
                  "hover:opacity-90 active:scale-[0.98]",
                  (loading || !isAvailable) && "cursor-not-allowed bg-gray-300"
                ),
                children: [
                  /* @__PURE__ */ jsx(Zap, { size: 16 }),
                  /* @__PURE__ */ jsx("span", { children: "اشتري الآن" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "h-20 md:hidden" })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      AuthDialog,
      {
        visible: showAuthDialog,
        onHide: () => {
          setShowAuthDialog(false);
          setPendingAction(null);
        },
        initSettings: settings || {},
        onSuccess: handleLoginSuccess
      }
    ) })
  ] });
});
CartActions.displayName = "CartActions";

const ProductSpecifications = memo(({
  specifications,
  className
}) => {
  const [showAll, setShowAll] = React__default.useState(false);
  if (!specifications || specifications.length === 0) return null;
  const visibleSpecifications = showAll ? specifications : specifications.slice(0, 5);
  const hasMoreSpecifications = specifications.length > 5;
  return /* @__PURE__ */ jsxs("div", { className: cn("my-6", className), children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-xl font-semibold", children: "المواصفات" }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-gray-200", children: [
      /* @__PURE__ */ jsx("table", { className: "w-full", children: /* @__PURE__ */ jsx("tbody", { children: visibleSpecifications.map((spec, index) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: index % 2 === 0 ? "bg-gray-50" : "bg-white",
          children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm font-medium text-gray-700", children: spec.key }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-gray-700", children: spec.value })
          ]
        },
        spec.id
      )) }) }),
      hasMoreSpecifications && /* @__PURE__ */ jsx("div", { className: "flex justify-center border-t border-gray-200 p-3", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowAll(!showAll),
          className: "text-sm font-medium text-[var(--main-color)] hover:text-[var(--second-color)] focus:outline-none",
          children: showAll ? "عرض أقل" : "عرض المزيد"
        }
      ) })
    ] })
  ] });
});
ProductSpecifications.displayName = "ProductSpecifications";

const PolicySection = memo(({
  title,
  icon,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen((p) => !p),
        className: "flex w-full items-center justify-between gap-3 px-6 py-4 text-right transition hover:bg-slate-50",
        "aria-expanded": isOpen,
        children: [
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              size: 20,
              className: cn(
                "flex-shrink-0 text-slate-400 transition-transform duration-300",
                isOpen && "rotate-180"
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-slate-800", children: title }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: icon })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ),
        children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 px-6 py-5 text-right text-sm leading-relaxed text-slate-600", children }) })
      }
    )
  ] });
});
PolicySection.displayName = "PolicySection";

const ShareButton = ({ productName, className = "" }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `تفقد هذا المنتج: ${productName}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success("تم نسخ الرابط بنجاح");
        setTimeout(() => setIsCopied(false), 2e3);
      } catch (err) {
        console.error("Error copying link:", err);
        toast.error("فشل نسخ الرابط");
      }
    }
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: handleShare,
      className: `flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95 ${className}`,
      title: "مشاركة المنتج",
      children: isCopied ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" }),
        /* @__PURE__ */ jsx("span", { children: "تم النسخ" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4 text-[var(--main-color)]" }),
        /* @__PURE__ */ jsx("span", { children: "مشاركة" })
      ] })
    }
  );
};

const CartPanel = lazy(() => import('../../chunks/CartPanel_DqPX2Bkc.mjs'));
function DetailPage({ product }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    selectedVariations,
    handleRadioChange,
    handleCheckboxChange,
    isChoiceSelected,
    currentPrice
  } = useProductOptions(product);
  const formattedVariations = useMemo(() => {
    const variations = Object.entries(selectedVariations).map(([variationId, choice]) => ({
      main_variation_id: variationId,
      choices: [choice.id]
    }));
    return { variations };
  }, [selectedVariations]);
  const parsedDescription = useMemo(() => {
    return parse(product?.description || "");
  }, [product?.description]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "container flex min-h-screen flex-col items-center justify-center py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid w-full grid-cols-1 gap-8 rounded-2xl bg-gray-50 p-6 shadow-sm lg:grid-cols-2 lg:p-10", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ProductGallery, { product }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900", children: product.name }),
            /* @__PURE__ */ jsx(ShareButton, { productName: product.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            product?.category?.name && /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200", children: product.category.name }),
            product?.sub_category?.name && /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200", children: product.sub_category.name })
          ] }),
          product?.tags && product.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: product.tags.map((tag) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "rounded-full bg-[var(--main-color)]/10 px-3 py-0.5 text-xs font-medium text-[var(--main-color)]",
              children: [
                "#",
                tag.name
              ]
            },
            tag.id
          )) }),
          /* @__PURE__ */ jsx(PriceDisplay, { product, currentPrice: product?.price || 0 }),
          product?.description && /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm leading-relaxed text-slate-600", children: parsedDescription }),
          product?.description_steps && product.description_steps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-base font-semibold text-slate-800", children: "المواصفات الأساسية" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: product.description_steps.map((step, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: step })
            ] }, i)) })
          ] }),
          product.variations && product.variations.length > 0 && /* @__PURE__ */ jsx(
            VariationsSelector,
            {
              variations: product.variations,
              handleRadioChange,
              handleCheckboxChange,
              isChoiceSelected
            }
          ),
          /* @__PURE__ */ jsx(
            ProductOptions,
            {
              sizes: product.sizes,
              colors: product.colors,
              selectedSize,
              selectedColor,
              onSizeSelect: setSelectedSize,
              onColorSelect: setSelectedColor
            }
          ),
          /* @__PURE__ */ jsx(
            CartActions,
            {
              product,
              productVariations: product?.variations || [],
              totalPrice: currentPrice,
              currentColor: selectedColor,
              currentSize: selectedSize,
              selectedVariations: formattedVariations,
              onAddedToCart: () => setIsCartOpen(true)
            }
          )
        ] })
      ] }),
      product.technicalInformation && product.technicalInformation.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 w-full", children: /* @__PURE__ */ jsx(
        ProductSpecifications,
        {
          specifications: product.technicalInformation,
          className: "w-full"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 w-full space-y-4", children: [
        /* @__PURE__ */ jsx(PolicySection, { title: "سياسة العائدات", icon: "↩️", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-right", children: [
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "شروط العودة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "يمكن للعملاء طلب إرجاع المنتج خلال 14 يومًا من تاريخ استلام الطلب." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "يجب أن يكون المنتج بحالته الأصلية وغير مستخدم ومزود بجميع الملصقات والتغليف الأصلي." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "إجراءات العودة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "يجب على العميل الاتصال بخدمة العملاء لتقديم طلب الإرجاع والحصول على تعليمات التعبئة والشحن." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "يلتزم العميل بتغليف المنتج بشكل آمن قبل إرساله إلى مركز الإرجاع." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "المبالغ المستردة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "بعد استلام المنتج ومعاينته، سيتم استرداد المبلغ المدفوع حسب طريقة الدفع المستخدمة." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "قد يتم خصم تكاليف الشحن من المبلغ المسترد في حالة الإرجاعات التي لا تتعلق بخطأ في المتجر." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "الاستثناءات" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "لا يتم قبول إرجاع المنتجات المعدلة أو المستعملة." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "قد لا تكون بعض المنتجات قابلة للإرجاع لأسباب تتعلق بالصحة أو السلامة، وسيتم توضيح ذلك عند الشراء." })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(PolicySection, { title: "سياسة الدفع عند التسليم", icon: "💵", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-right", children: [
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "تعريف الخدمة" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-slate-600", children: /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "خدمة الدفع عند الاستلام تتيح للعملاء دفع قيمة الطلب نقدًا أو عن طريق البطاقة الائتمانية عند استلام المنتج مباشرة." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "شروط الخدمة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "هذه الخدمة متاحة في مناطق محددة فقط، وسيتم توضيحها أثناء عملية الشراء." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "قد يتم فرض رسوم إضافية على هذه الخدمة وفقًا لسياسة المتجر." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "إجراءات الدفع" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "عند تسليم الطلب، يطلب من العميل دفع كامل المبلغ نقدًا أو عن طريق بطاقة الائتمان حسب الخيارات المتاحة." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "إذا لم يكن العميل متواجدًا وقت التسليم، فقد يتم إلغاء الطلب أو إعادة جدولة التسليم." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "مزايا الخدمة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "يمنح العملاء الثقة في استلام المنتج قبل الدفع." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "تسهيل عملية الشراء للأشخاص الذين لا يفضلون الدفع الإلكتروني." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-2 font-bold text-slate-700", children: "ملاحظات هامة" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 text-slate-600", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "قد يختلف وقت إعداد الطلب والشحن عند اختيار الدفع عند الاستلام بسبب الإجراءات الإضافية." })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: "لا يمكن إرجاع الطلبات المدفوعة نقدًا عند الاستلام إلا وفقًا لسياسة الإرجاع العامة." })
              ] })
            ] })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(CartPanel, { isOpen: isCartOpen, onClose: () => setIsCartOpen(false) }) })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://admin-osama.cashierthru.com");
async function getStaticPaths() {
  return [];
}
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const id = slug.split("-").pop();
  if (!id) {
    return Astro2.redirect("/404");
  }
  const token = Astro2.cookies.get("app_token")?.value;
  const settingsResponse = await fetchSettings(token);
  const settingsData = settingsResponse?.data ?? null;
  const isLogin = settingsResponse?.ok ? Boolean(settingsResponse?.is_login) : false;
  const cartCount = settingsResponse?.cart_count ?? 0;
  const appVersion = packageJson.version;
  function buildWhatsAppLink(phone) {
    if (!phone) return null;
    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (!digitsOnly) return null;
    return `https://wa.me/${encodeURIComponent(digitsOnly)}`;
  }
  const whatsappLink = buildWhatsAppLink(settingsData?.whatsapp_phone);
  let productData = null;
  try {
    const response = await fetchHook({
      url: `v1/product-details?product_id=${id}`,
      init: {}
    });
    if (response?.ok && response?.data?.data) {
      productData = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
  if (!productData) {
    return Astro2.redirect("/404");
  }
  const pageTitle = productData?.name || "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C";
  const pageDescription = productData?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || "\u0639\u0631\u0636 \u062A\u0641\u0627\u0635\u064A\u0644 \u0648\u0645\u0648\u0627\u0635\u0641\u0627\u062A \u0627\u0644\u0645\u0646\u062A\u062C";
  const pageKeywords = [
    productData?.name,
    productData?.category?.name,
    "\u0645\u0646\u062A\u062C",
    "\u0634\u0631\u0627\u0621 \u0623\u0648\u0646\u0644\u0627\u064A\u0646"
  ].filter(Boolean);
  const productImage = productData?.main_image || productData?.gallery_images?.[0] || productData?.image;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData?.name,
    description: productData?.description?.replace(/<[^>]*>/g, ""),
    image: productImage,
    brand: {
      "@type": "Brand",
      name: settingsData?.name || "Store"
    },
    offers: {
      "@type": "Offer",
      url: `${Astro2.url.origin}/products/${slug}`,
      priceCurrency: "EGP",
      price: productData?.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: settingsData?.name || "Store"
      }
    },
    category: productData?.category?.name
  }) || "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "image": productImage, "imageWidth": 1200, "imageHeight": 630 }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '  <script type="application/ld+json">', "<\/script> "])), renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "DetailPage", DetailPage, { "product": productData, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/products/DetailPage", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
            flex h-12 w-12 items-center overflow-hidden
            rounded-full bg-green-500 text-white shadow-lg
            transition-all duration-300
            group-hover:w-[150px] group-hover:shadow-xl
          "> <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center"> <i class="pi pi-whatsapp text-2xl"></i> </div> <span class="
              max-w-0 translate-x-2 whitespace-nowrap text-sm font-medium
              opacity-0 transition-all duration-300
              group-hover:max-w-[100px] group-hover:translate-x-0 group-hover:opacity-100
            ">
تواصل معنا
</span> </div> <span class="sr-only">تواصل معنا عبر الواتساب</span> </a>`} ${renderComponent($$result3, "Footer", Footer, { "settingsData": settingsData, "appVersion": appVersion, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/layouts/Footer", "client:component-export": "default" })}  ${renderComponent($$result3, "ToastContainer", null, { "position": "bottom-right", "rtl": true, "autoClose": 3e3, "hideProgressBar": false, "newestOnTop": true, "closeOnClick": true, "pauseOnFocusLoss": true, "draggable": true, "pauseOnHover": true, "theme": "light", "client:only": "react", "client:component-hydration": "only", "client:component-path": "react-toastify", "client:component-export": "ToastContainer" })} ` }), unescapeHTML(schema)) })}`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/products/[slug].astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/products/[slug].astro";
const $$url = "/products/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    getStaticPaths,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
