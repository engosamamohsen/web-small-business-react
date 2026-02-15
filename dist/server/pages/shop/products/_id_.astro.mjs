import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead, i as addAttribute } from '../../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_CxhoI3tg.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import parse from 'html-react-parser';
import React__default, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
/* empty css                                       */
import { s as styles } from '../../../chunks/_id_.f4bd5aee_3zF7qthd.mjs';
import { B as Button } from '../../../chunks/button.esm_DKcfQX2F.mjs';
import { a as useCartHook } from '../../../chunks/cart_iTx8_aSU.mjs';
import Cookies from 'js-cookie';
import { c as cn, H as Header, F as Footer, p as packageJson } from '../../../chunks/package_CyaH-9oZ.mjs';
import { u as useUpdateEffect, I as InputTextarea } from '../../../chunks/inputtextarea.esm_0g3tNOt2.mjs';
import { toast } from 'react-toastify';
import { a as fetchSettings } from '../../../chunks/fetchSettings_COq2Kj7n.mjs';
import { f as fetchHook } from '../../../chunks/fetch-hook__RYspszQ.mjs';
export { renderers } from '../../../renderers.mjs';

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
  const discount = product.discount ? parseInt(product.discount, 10) : 0;
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

const CartActions = memo(({
  product,
  currentColor,
  currentSize,
  selectedVariations,
  productVariations,
  totalPrice
}) => {
  const [count, setCount] = useState(1);
  const [productNote, setProductNote] = useState("");
  const token = Cookies.get("app_token");
  const [isAvailable, setIsAvailable] = useState(true);
  const { loading, addToCart } = useCartHook();
  const discount = product.discount ? parseInt(product.discount, 10) : 0;
  const handleAddToCart = useCallback(async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const { variations } = selectedVariations;
      await addToCart({
        ...product,
        count,
        currentColor,
        currentSize,
        product_note: productNote,
        // Include product note from state
        variations
        // Include variations
      });
      setProductNote("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل إضافة المنتج إلى السلة"
      );
    }
  }, [token, selectedVariations, addToCart, product, count, currentColor, currentSize, productNote]);
  useUpdateEffect(() => {
    if (!productVariations.length) return;
    const requiredVariations = productVariations.filter(
      (variation) => variation.is_required
    );
    const isAvailable2 = requiredVariations.every((main_variation) => {
      return selectedVariations.variations.some(
        (variation) => variation.main_variation_id == main_variation.id
      );
    });
    setIsAvailable(isAvailable2);
  }, [productVariations, selectedVariations]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mt-6 w-full", children: [
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
          className: "w-full rounded-md border border-gray-300 p-2 focus:border-[var(--main-color)] focus:outline-none",
          placeholder: "اكتب أي ملاحظات خاصة بالمنتج هنا..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:flex-col-reverse max-md:bg-white max-md:px-8 max-md:py-6 max-md:pb-10 max-md:shadow-[0_0_10px_0_rgba(0,0,0,0.2)]", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          loading,
          disabled: loading || !isAvailable,
          onClick: handleAddToCart,
          loadingIcon: "pi pi-spin pi-spinner absolute",
          className: cn(
            "flex w-fit items-center justify-center gap-4 rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-md:w-full",
            !isAvailable && "bg-gray-500"
          ),
          "aria-label": "Add product to cart",
          children: [
            /* @__PURE__ */ jsx("span", { children: "أضف إلى السلة" }),
            /* @__PURE__ */ jsxs("span", { children: [
              discount > 0 ? getDiscountedPrice(product?.price, discount) : totalPrice * count,
              " ",
              /* @__PURE__ */ jsx("span", { children: "جنية" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex w-40 items-center justify-between gap-1 rounded-lg border bg-white p-4 max-md:w-full", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: "pi pi-plus",
            className: "p-button-text mx-0 !shadow-none !outline-none hover:text-[var(--second-color)]",
            onClick: () => setCount((prev) => prev + 1)
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold", children: count }),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: "pi pi-minus",
            className: "p-button-text mx-0 !shadow-none !outline-none hover:text-[var(--second-color)]",
            onClick: () => {
              if (count > 1) {
                setCount((prev) => Math.max(prev - 1, 0));
              }
            }
          }
        )
      ] })
    ] })
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

function DetailPage({ product }) {
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
  return /* @__PURE__ */ jsxs("div", { className: "container flex min-h-screen flex-col items-center justify-center py-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 bg-gray-100 p-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ProductGallery, { product }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-4 text-2xl font-semibold", children: product.name }),
        /* @__PURE__ */ jsxs("h5", { className: "my-2 w-fit rounded-lg bg-white px-6 py-2", children: [
          /* @__PURE__ */ jsx(Fragment, { children: "الفئة : " }),
          " ",
          /* @__PURE__ */ jsx("span", { children: product?.category?.name })
        ] }),
        /* @__PURE__ */ jsx(PriceDisplay, { product, currentPrice: product?.price || 0 }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: parsedDescription }),
        product?.steps?.length && /* @__PURE__ */ jsx("ul", { className: "mt-4 list-disc", children: product?.steps?.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) }),
        product?.description_steps && product.description_steps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: "المواصفات الأساسية" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: product.description_steps.map((step, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "ml-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: step })
          ] }, index)) })
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
            selectedVariations: formattedVariations
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-between", children: product.technicalInformation && product.technicalInformation.length > 0 && /* @__PURE__ */ jsx(
      ProductSpecifications,
      {
        specifications: product.technicalInformation,
        className: "w-full flex-1"
      }
    ) })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://admin-emend.cashierthru.com");
async function getStaticPaths() {
  return [];
}
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
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
      url: `${Astro2.url.origin}/products/${id}`,
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
}, "F:/react js projects/kamal/web-small-business-react/src/pages/shop/products/[id].astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/shop/products/[id].astro";
const $$url = "/shop/products/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    getStaticPaths,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
