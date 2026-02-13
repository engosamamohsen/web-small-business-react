/* empty css                                           */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, k as Fragment$1, i as addAttribute, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { c as cartCountAtom, $ as $$BaseLayout } from '../../chunks/BaseLayout_DGf6_HP9.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Loader2, Plus, Minus } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
/* empty css                                    */
import { f as fetchHook, a as fetchSettings } from '../../chunks/fetchSettings_BSzKgKzb.mjs';
import { c as cn } from '../../chunks/utils_B05Dmz_H.mjs';
export { renderers } from '../../renderers.mjs';

const CURRENCY = "جنية";
function getDiscountedPrice(price, discount) {
  const discountedPrice = price - price * discount / 100;
  return parseFloat(discountedPrice.toFixed(2));
}
function ProductDetail({
  product,
  settings
}) {
  const token = Cookies.get("app_token");
  const [, setCartCount] = useAtom(cartCountAtom);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [rawSelectedVariations, setRawSelectedVariations] = useState({});
  const [count, setCount] = useState(1);
  const [productNote, setProductNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const basePrice = product?.price_after || product.price;
  const images = product?.gallery_images || product?.gallery || product?.images || [product?.logo || product?.image];
  useEffect(() => {
    if (product?.variations) {
      const initialVariations = {};
      product.variations.forEach((variation) => {
        if (variation.enable && variation.choices?.length > 0) {
          initialVariations[variation.id] = [];
        }
      });
      setRawSelectedVariations(initialVariations);
    }
  }, [product]);
  const currentPrice = useMemo(() => {
    let total = typeof basePrice === "number" ? basePrice : parseFloat(String(basePrice)) || 0;
    if (product?.variations) {
      Object.entries(rawSelectedVariations).forEach(
        ([variationId, choiceIds]) => {
          const variation = product.variations?.find(
            (v) => String(v.id) === String(variationId)
          );
          if (variation) {
            choiceIds.forEach((choiceId) => {
              const choice = variation.choices.find((c) => c.id === choiceId);
              if (choice) {
                const choicePrice = typeof choice.price === "number" ? choice.price : parseFloat(String(choice.price)) || 0;
                total += choicePrice;
              }
            });
          }
        }
      );
    }
    if (selectedSize?.price) {
      const sizePrice = typeof selectedSize.price === "number" ? selectedSize.price : parseFloat(String(selectedSize.price)) || 0;
      total = sizePrice + (total - basePrice);
    }
    return parseFloat(total.toFixed(2));
  }, [basePrice, rawSelectedVariations, selectedSize, product?.variations]);
  const selectedVariations = useMemo(() => {
    const formatted = Object.entries(
      rawSelectedVariations
    ).filter(([, choices]) => choices.length > 0).map(([variationId, choices]) => ({
      main_variation_id: variationId,
      choices
    }));
    return { variations: formatted };
  }, [rawSelectedVariations]);
  useEffect(() => {
    if (!product?.variations?.length) return;
    const requiredVariations = product.variations.filter((v) => v.is_required);
    const available = requiredVariations.every(
      (mainVariation) => selectedVariations.variations.some(
        (v) => v.main_variation_id === mainVariation.id
      )
    );
    setIsAvailable(available);
  }, [product?.variations, selectedVariations]);
  const handleRadioChange = (variationId, choiceId) => {
    setRawSelectedVariations((prev) => ({
      ...prev,
      [variationId]: [choiceId]
    }));
  };
  const handleCheckboxChange = (variationId, choiceId) => {
    setRawSelectedVariations((prev) => {
      const currentSelections = prev[variationId] || [];
      const newSelections = currentSelections.includes(choiceId) ? currentSelections.filter((id) => id !== choiceId) : [...currentSelections, choiceId];
      return { ...prev, [variationId]: newSelections };
    });
  };
  const isChoiceSelected = (variationId, choiceId) => {
    return rawSelectedVariations[variationId]?.includes(choiceId) || false;
  };
  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: "v1/basket",
        init: {
          method: "POST",
          body: JSON.stringify({
            product_id: product.id,
            count,
            current_color: selectedColor,
            current_size: selectedSize,
            product_note: productNote,
            variations: selectedVariations.variations
          })
        },
        token
      });
      if (response.ok) {
        toast.success("تمت الإضافة للسلة");
        setCartCount((prev) => prev + count);
        setProductNote("");
      } else {
        toast.error(response.error || "حدث خطأ");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };
  const discount = product.discount ? parseInt(product.discount, 10) : 0;
  return /* @__PURE__ */ jsxs("div", { className: "container flex min-h-screen flex-col items-center justify-center py-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 bg-gray-100 p-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Navigation],
          loop: true,
          navigation: true,
          className: "product-swiper !h-[608px] max-md:!h-80",
          children: images.map((img, idx) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx("div", { className: "relative aspect-square h-full w-full", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: img || "/placeholder-image.jpg",
              alt: product?.name || "Product image",
              className: "h-[608px] !w-full !max-w-full object-contain transition-all duration-200 group-hover:brightness-90 max-md:max-h-80"
            }
          ) }) }, idx))
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-4 text-2xl font-semibold", children: product.name }),
        /* @__PURE__ */ jsxs("h5", { className: "my-2 w-fit rounded-lg bg-white px-6 py-2", children: [
          "الفئة : ",
          /* @__PURE__ */ jsx("span", { children: product?.category?.name })
        ] }),
        discount > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 text-lg text-gray-500", children: /* @__PURE__ */ jsxs("bdi", { children: [
            /* @__PURE__ */ jsx("span", { children: "السعر قبل الخصم" }),
            " ",
            /* @__PURE__ */ jsx("span", { children: " : " }),
            /* @__PURE__ */ jsxs("span", { className: "line-through", children: [
              product.price,
              " ",
              CURRENCY
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("bdi", { className: "mb-2 text-xl font-bold text-gray-900", children: [
            /* @__PURE__ */ jsx("bdi", { children: "السعر بعد الخصم" }),
            " ",
            /* @__PURE__ */ jsx("span", { children: " : " }),
            /* @__PURE__ */ jsxs("span", { children: [
              getDiscountedPrice(currentPrice, discount),
              " ",
              CURRENCY
            ] })
          ] }),
          /* @__PURE__ */ jsxs("bdi", { className: "flex items-center text-lg font-semibold text-green-600", children: [
            /* @__PURE__ */ jsxs("div", { className: "ml-1", children: [
              /* @__PURE__ */ jsx("span", { children: "وفرْت " }),
              /* @__PURE__ */ jsx("span", { children: " : " })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "ml-1", children: [
              currentPrice - getDiscountedPrice(currentPrice, discount),
              " ",
              CURRENCY
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "ml-2 rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-600", children: [
              discount,
              "% خصم"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col items-start justify-start gap-1", children: /* @__PURE__ */ jsxs("bdi", { className: "mb-2 text-lg font-normal text-[var(--second-color)]", children: [
          /* @__PURE__ */ jsx("bdi", { children: "السعر" }),
          " ",
          /* @__PURE__ */ jsx("span", { children: " : " }),
          /* @__PURE__ */ jsxs("span", { children: [
            currentPrice,
            " ",
            CURRENCY
          ] })
        ] }) }),
        product?.description && /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-4",
            dangerouslySetInnerHTML: { __html: product.description }
          }
        ),
        product?.steps && product.steps.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-4 list-disc pr-4", children: product.steps.map((item, idx) => /* @__PURE__ */ jsx("li", { children: item }, idx)) }),
        product?.description_steps && product.description_steps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: "المواصفات الأساسية" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: product.description_steps.map((step, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "ml-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--main-color)]" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: step })
          ] }, index)) })
        ] }),
        product.variations && product.variations.length > 0 && /* @__PURE__ */ jsx(Fragment, { children: product.variations.map((variation) => /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: variation.name }),
            variation.is_required && /* @__PURE__ */ jsx("span", { className: "ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-600", children: "مطلوب" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3", children: variation.choices.map((choice) => /* @__PURE__ */ jsx("div", { className: "flex items-center", children: variation.is_required ? /* @__PURE__ */ jsxs(
            "label",
            {
              className: cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-md border p-3",
                isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: `variation-${variation.id}`,
                    value: choice.id,
                    checked: isChoiceSelected(
                      variation.id,
                      choice.id
                    ),
                    onChange: () => handleRadioChange(variation.id, choice.id),
                    className: "mr-2 h-4 w-4 accent-[var(--second-color)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: choice.name }),
                choice.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-600", children: [
                  "+",
                  choice.price,
                  " ",
                  CURRENCY
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxs(
            "label",
            {
              className: cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-md border p-3",
                isChoiceSelected(variation.id, choice.id) ? "border-[var(--second-color)] bg-orange-100" : "border-gray-300 bg-white"
              ),
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    name: `variation-${variation.id}`,
                    value: choice.id,
                    checked: isChoiceSelected(
                      variation.id,
                      choice.id
                    ),
                    onChange: () => handleCheckboxChange(variation.id, choice.id),
                    className: "mr-2 h-4 w-4 accent-[var(--second-color)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "flex-1", children: choice.name }),
                choice.price > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-600", children: [
                  "+",
                  choice.price,
                  " ",
                  CURRENCY
                ] })
              ]
            }
          ) }, choice.id)) })
        ] }, variation.id)) }),
        product.sizes && product.sizes.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-semibold", children: "الحجم" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: product.sizes.map((sizeOption) => /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": `Select size ${sizeOption.size}`,
              className: cn(
                "rounded-md border px-4 py-2",
                selectedSize?.id === sizeOption.id ? "border-[var(--main-color)] text-[var(--main-color)]" : "border-gray-300"
              ),
              onClick: () => setSelectedSize(sizeOption),
              children: /* @__PURE__ */ jsx("bdi", { children: sizeOption.size })
            },
            sizeOption.id
          )) })
        ] }),
        product.colors && product.colors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-lg font-semibold", children: "اللون" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: product.colors.map((colorOption) => /* @__PURE__ */ jsx(
            "button",
            {
              "aria-label": `Select color ${colorOption.color}`,
              className: cn(
                "rounded-md border px-4 py-2",
                selectedColor?.id === colorOption.id ? "border-[var(--main-color)] text-[var(--main-color)]" : "border-gray-300"
              ),
              onClick: () => setSelectedColor(colorOption),
              children: /* @__PURE__ */ jsx("bdi", { children: colorOption.color })
            },
            colorOption.id
          )) })
        ] }),
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
            "textarea",
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
        /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-col gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:z-50 max-md:flex-col-reverse max-md:bg-white max-md:px-8 max-md:py-6 max-md:pb-10 max-md:shadow-[0_0_10px_0_rgba(0,0,0,0.2)]", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleAddToCart,
              disabled: isLoading || !isAvailable,
              className: cn(
                "flex w-fit items-center justify-center gap-4 rounded-md bg-[var(--main-color)] px-6 py-4 text-white transition-colors hover:bg-gray-800 max-md:w-full",
                !isAvailable && "bg-gray-500"
              ),
              "aria-label": "Add product to cart",
              children: [
                isLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
                /* @__PURE__ */ jsx("span", { children: "أضف إلى السلة" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  currentPrice * count,
                  " ",
                  /* @__PURE__ */ jsx("span", { children: CURRENCY })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex w-40 items-center justify-between gap-1 rounded-lg border bg-white p-4 max-md:w-full", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 hover:text-[var(--second-color)]",
                onClick: () => setCount((prev) => prev + 1),
                children: /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold", children: count }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "p-2 hover:text-[var(--second-color)]",
                onClick: () => {
                  if (count > 1) setCount((prev) => Math.max(prev - 1, 0));
                },
                children: /* @__PURE__ */ jsx(Minus, { className: "h-5 w-5" })
              }
            )
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ProductSpecifications,
      {
        specifications: product.technicalInformation || product.technical_information
      }
    )
  ] });
}
function ProductSpecifications({
  specifications,
  className
}) {
  const [showAll, setShowAll] = useState(false);
  if (!specifications || specifications.length === 0) return null;
  const visibleSpecifications = showAll ? specifications : specifications.slice(0, 5);
  const hasMoreSpecifications = specifications.length > 5;
  return /* @__PURE__ */ jsxs("div", { className: cn("my-6 w-full", className), children: [
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
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$productId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$productId;
  const { product_id } = Astro2.params;
  const productRes = await fetchHook({
    url: `v1/product-details?product_id=${product_id}`
  });
  const product = productRes.ok ? productRes.data?.data || productRes.data : null;
  const settingsRes = await fetchSettings();
  const settings = settingsRes?.data;
  if (!product) {
    return Astro2.redirect("/404");
  }
  const productName = product.name || "Product";
  const productDescription = product.description?.replace(/<[^>]*>/g, "") || settings?.about_us || "";
  const productImage = product.logo || product.main_image || product.gallery_images?.[0] || product.image || settings?.logo || "";
  const productPrice = product.price_after || product.price || 0;
  const brandName = product.brand || settings?.name || "Store";
  product.category?.name || "";
  const siteUrl = settings?.website_url || Astro2.site?.toString() || "https://example.com";
  const canonicalUrl = `${siteUrl}/products/${product_id}`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${productName} | ${brandName}`, "description": productDescription.slice(0, 160), "image": productImage, "canonical": canonicalUrl }, { "default": async ($$result2) => renderTemplate`   ${maybeRenderHead()}<main> <!-- Product Detail - React Island for interactivity --> ${renderComponent($$result2, "ProductDetail", ProductDetail, { "client:load": true, "product": product, "settings": settings, "client:component-hydration": "load", "client:component-path": "@/components/Products/ProductDetail", "client:component-export": "default" })} </main> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', '<\/script>  <meta property="og:type" content="product"> <meta property="product:price:amount"', '> <meta property="product:price:currency" content="EGP"> ', ""])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    image: productImage,
    brand: {
      "@type": "Brand",
      name: brandName
    },
    offers: {
      "@type": "Offer",
      price: productPrice,
      priceCurrency: "EGP",
      availability: product.is_available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonicalUrl
    }
  })), addAttribute(String(productPrice), "content"), product.category_name && renderTemplate`<meta property="product:category"${addAttribute(product.category_name, "content")}>`) })}` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/products/[product_id].astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/products/[product_id].astro";
const $$url = "/products/[product_id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$productId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
