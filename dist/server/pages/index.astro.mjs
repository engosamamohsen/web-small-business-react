import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BA59mY36.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Dbf_rlpT.mjs';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { L as Link, I as Image, f as useMergeProps, P as PrimeReactContext, r as useHandleStyle, m as classNames, C as ComponentBase, M as useSearchParams, N as fetchHookClient, F as FaviconHandler, H as Header, a as Footer, p as packageJson } from '../chunks/package_DEA60gZM.mjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, FreeMode, Scrollbar } from 'swiper/modules';
/* empty css                                 */
import { s as styles$1, a as styles$2, b as styles$3 } from '../chunks/index.95d291e9_979YcroM.mjs';
import { b as buildProductPath, c as cn } from '../chunks/product-url_CFiTjzDR.mjs';
import * as React from 'react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Flame, PackageOpen } from 'lucide-react';
import Cookies from 'js-cookie';
import { f as fetchSettings } from '../chunks/fetchSettings_CHiU20By.mjs';
import { f as fetchHook } from '../chunks/fetch-hook_Bta3HEL4.mjs';
export { renderers } from '../renderers.mjs';

function HeroContent({ data }) {
  const linkLocation = data?.type === "product" ? data?.id ? buildProductPath(data) : `/products/${data?.slug}` : data?.type === "category" ? `/categories/${data?.id}` : data?.type === "external" ? data?.link || "" : "/";
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    Link,
    {
      href: linkLocation,
      "aria-label": `Navigate to ${data.title}`,
      className: `${styles$1.textContainer} relative z-[999] flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center`,
      children: [
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: `${styles$1.title} w-fit text-white`,
            children: data.title
          }
        ),
        /* @__PURE__ */ jsx("p", { className: `${styles$1.desc} text-white opacity-[0.8]`, children: data.desc })
      ]
    }
  ) });
}

function SwiperBanner({ response }) {
  const slides = response?.bannerData || [];
  const hasMultipleSlides = slides.length > 1;
  if (!slides.length) return null;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: styles$1.heroContainer,
      "aria-label": "Promotional banners",
      children: [
        /* @__PURE__ */ jsx(
          Swiper,
          {
            modules: [Pagination, Autoplay, Navigation],
            pagination: hasMultipleSlides ? {
              clickable: true
            } : false,
            autoplay: {
              delay: 5e7,
              disableOnInteraction: true
            },
            loop: hasMultipleSlides,
            navigation: hasMultipleSlides ? {
              nextEl: ".hero-next",
              prevEl: ".hero-prev"
            } : false,
            className: `heroSwiper ${styles$1.heroSwiper}`,
            children: slides.map((slide, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("div", { className: styles$1.slideContent, children: [
              /* @__PURE__ */ jsxs("div", { className: styles$1.imageContainer, children: [
                /* @__PURE__ */ jsx(
                  Image,
                  {
                    src: slide.image,
                    alt: slide.title ? `صورة إعلان ${slide.title}` : "صورة إعلانية",
                    fill: true,
                    sizes: "100vw",
                    priority: index === 0,
                    className: styles$1.image
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: styles$1.gradientOverlay })
              ] }),
              /* @__PURE__ */ jsx(HeroContent, { data: slide })
            ] }) }, slide.id ?? index))
          }
        ),
        hasMultipleSlides && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `${styles$1.navArrow} ${styles$1.navPrev} hero-next`,
              "aria-label": "Next banner",
              type: "button",
              children: /* @__PURE__ */ jsx("span", { className: styles$1.navIcon, "aria-hidden": "true", children: "›" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `${styles$1.navArrow} ${styles$1.navNext} hero-prev`,
              "aria-label": "Previous banner",
              type: "button",
              children: /* @__PURE__ */ jsx("span", { className: styles$1.navIcon, "aria-hidden": "true", children: "‹" })
            }
          )
        ] })
      ]
    }
  );
}

function Hero({ bannerData }) {
  if (bannerData?.length) {
    return /* @__PURE__ */ jsx(SwiperBanner, { response: { bannerData, isSuccess: true } });
  }
  return null;
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}

var classes = {
  root: function root(_ref) {
    var props = _ref.props;
    return classNames('p-skeleton p-component', {
      'p-skeleton-circle': props.shape === 'circle',
      'p-skeleton-none': props.animation === 'none'
    });
  }
};
var styles = "\n@layer primereact {\n    .p-skeleton {\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-skeleton::after {\n        content: \"\";\n        animation: p-skeleton-animation 1.2s infinite;\n        height: 100%;\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        transform: translateX(-100%);\n        z-index: 1;\n    }\n    \n    .p-skeleton-circle {\n        border-radius: 50%;\n    }\n    \n    .p-skeleton-none::after {\n        animation: none;\n    }\n}\n\n@keyframes p-skeleton-animation {\n    from {\n        transform: translateX(-100%);\n    }\n    to {\n        transform: translateX(100%);\n    }\n}\n";
var inlineStyles = {
  root: {
    position: 'relative'
  }
};
var SkeletonBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Skeleton',
    shape: 'rectangle',
    size: null,
    width: '100%',
    height: '1rem',
    borderRadius: null,
    animation: 'wave',
    style: null,
    className: null
  },
  css: {
    classes: classes,
    inlineStyles: inlineStyles,
    styles: styles
  }
});

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Skeleton = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = SkeletonBase.getProps(inProps, context);
  var _SkeletonBase$setMeta = SkeletonBase.setMetaData({
      props: props
    }),
    ptm = _SkeletonBase$setMeta.ptm,
    cx = _SkeletonBase$setMeta.cx,
    sx = _SkeletonBase$setMeta.sx,
    isUnstyled = _SkeletonBase$setMeta.isUnstyled;
  useHandleStyle(SkeletonBase.css.styles, isUnstyled, {
    name: 'skeleton'
  });
  var elementRef = React.useRef(null);
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      getElement: function getElement() {
        return elementRef.current;
      }
    };
  });
  var style = props.size ? {
    width: props.size,
    height: props.size,
    borderRadius: props.borderRadius
  } : {
    width: props.width,
    height: props.height,
    borderRadius: props.borderRadius
  };
  var rootProps = mergeProps({
    ref: elementRef,
    className: classNames(props.className, cx('root')),
    style: _objectSpread(_objectSpread({}, style), sx('root')),
    'aria-hidden': true
  }, SkeletonBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement("div", rootProps);
}));
Skeleton.displayName = 'Skeleton';

function getDiscountedPrice(price, discount) {
  return parseFloat((price - price * discount / 100).toFixed(2));
}
function fmt(n) {
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
}
function Product({ product, defaultImage }) {
  const rawDiscount = product?.discount ?? 0;
  const discountValue = typeof rawDiscount === "number" ? rawDiscount : parseFloat(String(rawDiscount)) || 0;
  const hasDiscount = discountValue > 0;
  const allImages = [
    product?.product_image,
    ...product?.gallery_images ?? [],
    defaultImage
  ].filter(Boolean);
  const images = allImages.length > 0 ? allImages : [""];
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 44) {
      delta > 0 ? setActiveIdx((i) => Math.max(i - 1, 0)) : setActiveIdx((i) => Math.min(i + 1, images.length - 1));
    }
    touchStartX.current = null;
  };
  const currentImage = images[activeIdx] || "";
  const categoryName = product?.category?.name;
  const productAlt = product?.name ? `صورة المنتج ${product.name}` : "صورة منتج";
  return /* @__PURE__ */ jsxs("article", { className: "group flex h-full flex-col rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: buildProductPath(product),
          "aria-label": `عرض تفاصيل ${product?.name ?? "المنتج"}`,
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative w-full overflow-hidden bg-gray-50",
              style: { aspectRatio: "4/3" },
              onTouchStart: handleTouchStart,
              onTouchEnd: handleTouchEnd,
              children: [
                !imgLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" }),
                currentImage ? /* @__PURE__ */ jsx(
                  Image,
                  {
                    src: currentImage,
                    alt: productAlt,
                    fill: true,
                    quality: 80,
                    loading: "lazy",
                    sizes: "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
                    className: [
                      "object-cover transition-opacity duration-300",
                      imgLoaded ? "opacity-100" : "opacity-0"
                    ].join(" "),
                    onLoad: () => setImgLoaded(true)
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-400", children: "لا توجد صورة" }) }),
                images.length > 1 && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden",
                    "aria-hidden": "true",
                    children: images.map((_, i) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: [
                          "block rounded-full transition-all duration-200",
                          i === activeIdx ? "w-4 h-[5px] bg-white shadow" : "w-[5px] h-[5px] bg-white/60"
                        ].join(" ")
                      },
                      i
                    ))
                  }
                )
              ]
            }
          )
        }
      ),
      hasDiscount && /* @__PURE__ */ jsxs("div", { className: "absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-sm ring-1 ring-orange-100/80", children: [
        /* @__PURE__ */ jsx(
          Flame,
          {
            fill: "orange",
            className: "h-3.5 w-3.5 text-transparent",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-orange-600", children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "خصم بنسبة " }),
          discountValue,
          "%"
        ] })
      ] })
    ] }),
    images.length > 1 && /* @__PURE__ */ jsx(
      "div",
      {
        className: "hidden md:flex gap-1.5 overflow-x-auto px-3 pt-2 pb-0.5",
        role: "tablist",
        "aria-label": "معرض صور المنتج",
        children: images.map((src, i) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": i === activeIdx,
            "aria-label": `الصورة ${i + 1}`,
            onClick: () => setActiveIdx(i),
            className: [
              "relative h-[38px] w-[52px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-[var(--main-color)]",
              i === activeIdx ? "ring-[var(--main-color)] opacity-100" : "ring-transparent opacity-50 hover:opacity-90 hover:ring-gray-300"
            ].join(" "),
            children: src && /* @__PURE__ */ jsx(
              Image,
              {
                src,
                alt: `المنتج ${product?.name ?? ""} — الصورة ${i + 1}`,
                fill: true,
                sizes: "52px",
                className: "object-cover",
                loading: "lazy"
              }
            )
          },
          i
        ))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col justify-between gap-2 px-4 pb-4 pt-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full space-y-1 text-right", children: [
        /* @__PURE__ */ jsx(Link, { href: buildProductPath(product), children: /* @__PURE__ */ jsx("h3", { className: "line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors hover:text-[var(--main-color)] sm:text-base", children: product.name }) }),
        categoryName && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium text-slate-400 sm:text-xs", children: categoryName })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full items-end justify-between", children: /* @__PURE__ */ jsx(PriceContent, { product }) })
    ] })
  ] });
}
function PriceContent({ product }) {
  const basePrice = Number(product?.price) || 0;
  const rawDiscount = product?.discount ?? 0;
  const discountValue = typeof rawDiscount === "number" ? rawDiscount : parseFloat(String(rawDiscount)) || 0;
  const hasDiscount = basePrice > 0 && discountValue > 0;
  const finalPrice = hasDiscount ? getDiscountedPrice(basePrice, discountValue) : basePrice;
  const saving = hasDiscount ? basePrice - finalPrice : 0;
  if (hasDiscount) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-0.5 text-right", dir: "rtl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-orange-500 sm:text-xl", children: [
          fmt(finalPrice),
          " ج.م"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 line-through sm:text-sm", children: [
          fmt(basePrice),
          " ج.م"
        ] })
      ] }),
      saving > 0 && /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700", children: [
        "وفرت ",
        fmt(saving),
        " ج.م"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "text-lg font-bold text-orange-500 sm:text-xl",
      dir: "rtl",
      children: [
        fmt(basePrice),
        " ج.م"
      ]
    }
  );
}

function SwiperOffer({ response }) {
  const products = response?.data?.data ?? [];
  const hasProducts = products.length > 0;
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
    Swiper,
    {
      modules: [Navigation, Autoplay],
      navigation: hasProducts && products.length > 1,
      autoplay: hasProducts ? {
        delay: 3e3,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false,
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10
        },
        480: {
          slidesPerView: 1.8,
          spaceBetween: 14
        },
        768: {
          slidesPerView: 2.6,
          spaceBetween: 18
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 22
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 24
        }
      },
      loop: hasProducts && products.length > 4,
      watchOverflow: true,
      className: `${styles$2["offer-swiper"]} min-h-[300px]`,
      children: hasProducts ? products.map((product) => /* @__PURE__ */ jsx(SwiperSlide, { className: styles$2.slide, children: /* @__PURE__ */ jsx("div", { className: styles$2.card, children: /* @__PURE__ */ jsx(Product, { product }) }) }, product.id)) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SwiperSlide, { className: styles$2.slide, children: /* @__PURE__ */ jsx("div", { className: styles$2.skeletonCard, children: /* @__PURE__ */ jsx(Skeleton, { width: "100%", height: "100%" }) }) }),
        /* @__PURE__ */ jsx(SwiperSlide, { className: styles$2.slide, children: /* @__PURE__ */ jsx("div", { className: styles$2.skeletonCard, children: /* @__PURE__ */ jsx(Skeleton, { width: "100%", height: "100%" }) }) })
      ] })
    }
  ) });
}

function NotFoundProducts({ text = "منتجات" }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-72 w-full flex-col items-center justify-center gap-5 bg-slate-100 text-center", children: [
    /* @__PURE__ */ jsx(PackageOpen, { className: "h-16 w-16 text-gray-500" }),
    /* @__PURE__ */ jsxs("span", { className: "text-2xl font-semibold text-gray-500", children: [
      "عذراً، لم يتم العثور على ",
      /* @__PURE__ */ jsx("span", { children: text })
    ] })
  ] });
}

function OfferProducts({ offerProducts }) {
  const response = {
    ok: true,
    data: {
      data: offerProducts
    }
  };
  if (offerProducts?.length) {
    return /* @__PURE__ */ jsxs("div", { className: "container py-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-8 text-2xl font-bold", children: "العروض" }),
      /* @__PURE__ */ jsx(SwiperOffer, { response })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "container py-10", id: "products", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-8 text-2xl font-bold", children: "العروض" }),
    /* @__PURE__ */ jsx(NotFoundProducts, { text: "عروض" })
  ] });
}

function CategorySwiper({ categories }) {
  const searchParams = useSearchParams();
  const categoryCount = categories?.categoriesData?.length || 0;
  const enableLoop = categoryCount > 14;
  const onCategoryClick = (category) => {
    const sp = new URLSearchParams(window.location.search);
    const current = sp.get("category");
    const nextId = category.id?.toString() + "-" + category.slug.toString();
    if (nextId === current) {
      sp.delete("category");
      sp.delete("sub_category");
      sp.set("page", "1");
      window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
      return;
    }
    sp.delete("sub_category");
    sp.set("page", "1");
    sp.set("category", nextId);
    window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
    scrollToProducts({ elementId: "products", top: 270 });
  };
  return /* @__PURE__ */ jsx("div", { className: cn("relative", styles$3["fade-edges"]), children: /* @__PURE__ */ jsx("div", { className: "container py-2", children: /* @__PURE__ */ jsx(
    Swiper,
    {
      modules: [Navigation, Autoplay],
      navigation: true,
      autoplay: searchParams.get("category") ? false : {
        delay: 2800,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
      },
      onTouchStart: (swiper) => swiper.autoplay?.stop(),
      onClick: (swiper) => swiper.autoplay?.stop(),
      breakpoints: {
        320: { slidesPerView: 3.2, spaceBetween: 8 },
        420: { slidesPerView: 4.2, spaceBetween: 10 },
        640: { slidesPerView: 6.2, spaceBetween: 12 },
        768: { slidesPerView: 8.2, spaceBetween: 14 },
        1024: { slidesPerView: 10.2, spaceBetween: 14 },
        1280: { slidesPerView: 12.2, spaceBetween: 16 },
        1536: { slidesPerView: 14.2, spaceBetween: 18 }
      },
      loop: enableLoop,
      className: cn(styles$3["categories-swiper"], "min-h-fit"),
      children: categories?.categoriesData?.map((category) => {
        const isActive = searchParams.get("category") == category.id?.toString() + "-" + category.slug.toString();
        return /* @__PURE__ */ jsx(
          SwiperSlide,
          {
            className: "group py-3 max-md:py-2",
            children: /* @__PURE__ */ jsx(
              CategoryBox,
              {
                category,
                isActive,
                onClick: () => onCategoryClick(category)
              }
            )
          },
          category.id
        );
      })
    }
  ) }) });
}
function CategoryBox({
  category,
  onClick,
  isActive
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "flex w-full flex-col items-center gap-2 outline-none",
      "aria-pressed": isActive,
      "aria-label": `Category ${category.name}`,
      suppressHydrationWarning: true,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative grid place-items-center rounded-full bg-white transition-all duration-200",
              // size responsive
              "h-[68px] w-[68px] max-md:h-[56px] max-md:w-[56px]",
              // base ring + shadow
              "ring-1 ring-gray-200 shadow-sm",
              // hover
              "group-hover:-translate-y-0.5 group-hover:shadow-md",
              // active
              isActive && "ring-2 ring-[var(--main-color)] shadow-[0_6px_18px_rgba(0,0,0,0.15)] bg-orange-50/40"
            ),
            suppressHydrationWarning: true,
            children: /* @__PURE__ */ jsx("div", { className: "relative h-[85%] w-[85%] overflow-hidden rounded-full", children: /* @__PURE__ */ jsx(
              Image,
              {
                src: category.icon,
                alt: `أيقونة قسم ${category.name}`,
                fill: true,
                sizes: "80px",
                className: "object-cover transition duration-200 group-hover:brightness-95",
                priority: category.id === 1
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "max-w-[88px] text-center text-[13.5px] font-semibold leading-snug text-gray-800",
              "max-md:max-w-[72px] max-md:text-[12px]",
              isActive && "text-[var(--main-color)]"
            ),
            suppressHydrationWarning: true,
            children: category.name
          }
        )
      ]
    }
  );
}
const scrollToProducts = ({
  elementId,
  top = 0
}) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: elementPosition - top,
    behavior: "smooth"
  });
};

const SubCategories = ({ categories }) => {
  const searchParams = useSearchParams();
  const onSubCategoryClick = (category) => {
    console.log("onSubCategoryClick", category.name);
    const sp = new URLSearchParams(window.location.search);
    const current = sp.get("sub_category");
    const nextId = category.id?.toString() + "-" + category.slug.toString();
    sp.set("page", "1");
    if (nextId === current) {
      sp.delete("sub_category");
      window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
      return;
    }
    sp.set("sub_category", nextId);
    window.history.pushState({}, "", `${window.location.pathname}?${sp}`);
    scrollToProducts({ elementId: "products", top: 270 });
  };
  if (!categories?.length) return null;
  return /* @__PURE__ */ jsx("div", { className: "w-full sm:w-fit sm:max-w-[440px]", children: /* @__PURE__ */ jsx("div", { className: " bg-white/80  max-md:w-full", children: /* @__PURE__ */ jsx(
    Swiper,
    {
      slidesPerView: "auto",
      spaceBetween: 8,
      freeMode: true,
      modules: [FreeMode, Scrollbar],
      scrollbar: { hide: false, draggable: true },
      className: cn(styles$3["subcategories-swiper"], "!pb-3"),
      children: categories.map((item) => {
        const isActive = searchParams.get("sub_category") == item.id?.toString() + "-" + item.slug?.toString();
        return /* @__PURE__ */ jsx(SwiperSlide, { className: "!w-auto", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onSubCategoryClick(item),
            className: cn(
              "px-3 py-1.5 text-sm font-semibold transition-all",
              "rounded-full border bg-gray-100 text-gray-700",
              "hover:bg-gray-200 hover:text-gray-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--main-color)]",
              isActive && "border-[var(--main-color)] bg-[var(--main-color)] text-white shadow-sm"
            ),
            children: /* @__PURE__ */ jsx("span", { className: "block max-w-[150px] truncate text-ellipsis text-center", children: item.name })
          }
        ) }, item.id);
      })
    }
  ) }) });
};

function Categories({
  categoriesData,
  isSuccess
}) {
  const searchParams = useSearchParams();
  const selectedCategory = useMemo(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam) return null;
    const categoryId = categoryParam.match(/^(\d+)/)?.[1];
    if (!categoryId) return null;
    return categoriesData?.find((cat) => cat.id?.toString() === categoryId) ?? null;
  }, [searchParams, categoriesData]);
  const subcategories = selectedCategory?.subcategories ?? [];
  if (!isSuccess) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-visible bg-gradient-to-b from-gray-50 to-white", children: [
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("h2", { className: "pt-8 text-right text-2xl font-extrabold tracking-tight text-gray-900 max-md:pt-6 max-md:text-xl", children: "اكتشف الفئات" }) }),
      /* @__PURE__ */ jsx(CategorySwiper, { categories: { categoriesData, isSuccess } })
    ] }),
    subcategories.length > 0 && /* @__PURE__ */ jsx("section", { className: "container flex items-center justify-between py-8 max-md:flex-col max-md:items-center max-md:gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex max-w-full items-center gap-3 max-md:w-full max-md:justify-center", children: [
      /* @__PURE__ */ jsx("bdi", { className: "text-sm font-bold text-gray-700 max-md:text-xs", children: "اختر الفئة الفرعية :" }),
      /* @__PURE__ */ jsx(SubCategories, { categories: subcategories })
    ] }) })
  ] });
}

function extractId(param) {
  if (!param) return void 0;
  const match = param.match(/^(\d+)/);
  return match ? match[1] : param;
}
function useProductsFilter(initialProducts, initialPagination, forcedCategory, forcedSubCategory) {
  const searchParams = useSearchParams();
  const categoryParam = extractId(searchParams.get("category") || void 0);
  const subCategoryParam = extractId(searchParams.get("sub_category") || void 0);
  const rawCategory = searchParams.get("category") || void 0;
  const rawSubCategory = searchParams.get("sub_category") || void 0;
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [products, setProducts] = useState(initialProducts || null);
  const [pagination, setPagination] = useState(initialPagination || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (isFirstLoad && initialProducts) {
      setIsFirstLoad(false);
      return;
    }
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `v1/product${categoryParam ? `?category_id=${categoryParam}` : ""}${subCategoryParam ? `&sub_category_id=${subCategoryParam}` : ""}${subCategoryParam || categoryParam ? `&` : "?"}page=${currentPage}&limit=${limit}`;
        const response = await fetchHookClient({
          url,
          method: "GET"
        });
        if (response.ok && response.data?.data) {
          setProducts(response.data.data);
          setPagination(response.data.pagination || { last_page: 1 });
        } else {
          setError(response.error || "Failed to fetch products");
          setProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setProducts([]);
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    };
    fetchProducts();
  }, [rawCategory, rawSubCategory, currentPage, limit]);
  const isEmpty = !isLoading && !error && products !== null && products.length === 0 && !isFirstLoad;
  return {
    products,
    pagination,
    isLoading,
    error,
    isSuccess: products !== null && !error,
    isEmpty
  };
}

function ProductsGrid({ products, defaultImage }) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4", children: products?.map((product) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg",
      children: /* @__PURE__ */ jsx(Product, { product, defaultImage })
    },
    product.id
  )) });
}
function ProductsSection({
  products,
  defaultImage
}) {
  const { products: filteredProducts, isLoading, isEmpty } = useProductsFilter(
    products?.data,
    products?.pagination
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-between sm:mb-8", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 sm:text-2xl", children: "أحدث المنتجات" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-solid border-[var(--main-color)] border-t-transparent" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-500", children: "جاري تحميل المنتجات..." })
      ] })
    ] });
  }
  if (isEmpty) {
    return /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-between sm:mb-8", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 sm:text-2xl", children: "أحدث المنتجات" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-700", children: "لا يوجد منتجات" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "جرب اختيار فئة أخرى" })
      ] })
    ] });
  }
  const hasProducts = filteredProducts && filteredProducts.length > 0;
  return /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-between sm:mb-8", children: /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 sm:text-2xl", children: "أحدث المنتجات" }) }),
    hasProducts ? /* @__PURE__ */ jsx(ProductsGrid, { products: filteredProducts, defaultImage }) : /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-500", children: "لا توجد منتجات" })
  ] });
}

function SettingsCookieSync({ settings }) {
  useEffect(() => {
    if (settings) {
      if (settings.vat) Cookies.set("vat", settings.vat);
      if (settings.tax) Cookies.set("tax", settings.tax.toString());
      if (settings.service) Cookies.set("service", settings.service.toString());
      Cookies.set("app_settings", JSON.stringify(settings), { expires: 7 });
    }
  }, [settings]);
  return null;
}

function WhatsAppButton({ phone }) {
  if (!phone) return null;
  let digits = phone.replace(/^\+/, "");
  if (digits.startsWith("0")) {
    digits = "20" + digits.slice(1);
  }
  digits = digits.replace(/\D/g, "");
  if (!digits.startsWith("20")) {
    digits = "20" + digits;
  }
  const link = `https://wa.me/${digits}`;
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: link,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:bottom-8 sm:left-8",
      "aria-label": "Contact on WhatsApp",
      children: /* @__PURE__ */ jsx("i", { className: "pi pi-whatsapp text-2xl" })
    }
  );
}

const $$Astro = createAstro("https://*.cashierthru.com");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const token = Astro2.cookies.get("app_token")?.value;
  const searchParams = Astro2.url.searchParams;
  const categoryParam = searchParams.get("category") || void 0;
  const subCategoryParam = searchParams.get("sub_category") || void 0;
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const extractId = (param) => param?.match(/^(\d+)/)?.[1];
  const categoryId = extractId(categoryParam);
  const subCategoryId = extractId(subCategoryParam);
  const [settingsResult, homeResult] = await Promise.allSettled([
    fetchSettings(token),
    fetchHook({ url: "v1/home", init: {}, token })
  ]);
  const settingsResponse = settingsResult?.status === "fulfilled" ? settingsResult.value : null;
  const settingsData = settingsResponse?.data ?? null;
  const isLogin = settingsResponse?.ok ? Boolean(settingsResponse?.is_login) : false;
  const appVersion = packageJson.version;
  const homeResponse = homeResult?.status === "fulfilled" ? homeResult.value : null;
  const homeData = homeResponse?.ok ? homeResponse?.data?.data : null;
  const bannerData = homeData?.banners ?? [];
  const showBanner = bannerData.length > 0;
  const offerProducts = homeData?.popular_products ?? [];
  const showOffers = offerProducts.length > 0;
  const categoriesData = homeData?.categories ?? [];
  const showCategories = categoriesData.length > 0;
  const targetFilterCategory = (() => {
    if (!categoryId) {
      return { isFilterCategory: false, isSubCategory: false };
    }
    const cat = categoriesData?.find(
      (item) => item.id?.toString() === categoryId
    );
    return {
      ...cat || {},
      isFilterCategory: true,
      isSubCategory: (cat?.subcategories?.length || 0) > 0
    };
  })();
  let productsData = [];
  let productsPagination = { last_page: 1 };
  let showProducts = false;
  try {
    const productsUrl = `v1/product${categoryId ? `?category_id=${categoryId}` : ""}${subCategoryId ? `&sub_category_id=${subCategoryId}` : ""}${subCategoryId || categoryId ? `&` : "?"}page=${currentPage}&limit=${limit}`;
    const productsResponse = await fetchHook({
      url: productsUrl,
      init: {}
    });
    if (productsResponse?.ok && productsResponse?.data?.data) {
      productsData = productsResponse.data.data;
      productsPagination = productsResponse.data.pagination || {
        last_page: 1
      };
      showProducts = true;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  const pageTitle = settingsData?.name || "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629 - \u0645\u0646\u0635\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644";
  const pageDescription = settingsData?.about_us || "\u0645\u0646\u0635\u0629 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0635\u063A\u064A\u0631\u0629";
  const pageKeywords = settingsData?.keywords || [
    "\u0623\u0639\u0645\u0627\u0644 \u0635\u063A\u064A\u0631\u0629",
    "\u0645\u062A\u062C\u0631 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
    "\u062A\u062C\u0627\u0631\u0629 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "image": settingsData?.logo, "favicon": settingsData?.logo }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result2, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })} ${renderComponent($$result2, "FaviconHandler", FaviconHandler, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/FaviconHandler", "client:component-export": "default" })} ${renderComponent($$result2, "Header", Header, { "currentPath": Astro2.url.pathname, "initialIsLoggedIn": isLogin, "settingsData": settingsData || void 0, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })} ${maybeRenderHead()}<main class="min-h-screen"> ${showBanner && renderTemplate`${renderComponent($$result2, "Hero", Hero, { "bannerData": bannerData, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Hero/Hero", "client:component-export": "default" })}`} ${showOffers && renderTemplate`${renderComponent($$result2, "OfferProducts", OfferProducts, { "offerProducts": offerProducts, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/OfferProducts/Index", "client:component-export": "default" })}`} ${showCategories && renderTemplate`${renderComponent($$result2, "Categories", Categories, { "categoriesData": categoriesData, "isSuccess": true, "targetFilterCategory": targetFilterCategory, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/Categories/Categories", "client:component-export": "default" })}`} <section class="py-10" id="products"> ${renderComponent($$result2, "ProductsSection", ProductsSection, { "products": showProducts ? {
    data: productsData,
    isSuccess: true,
    pagination: productsPagination
  } : { isSuccess: false }, "defaultImage": settingsData?.product_default_image, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/Product/ProductsSection", "client:component-export": "default" })} </section> </main> ${renderComponent($$result2, "WhatsAppButton", WhatsAppButton, { "phone": settingsData?.whatsapp_phone, "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@/components/common/WhatsAppButton", "client:component-export": "default" })} ${renderComponent($$result2, "SettingsCookieSync", SettingsCookieSync, { "settings": settingsData, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/common/SettingsCookieSync", "client:component-export": "default" })} ${renderComponent($$result2, "Footer", Footer, { "settingsData": settingsData, "appVersion": appVersion, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/layouts/Footer", "client:component-export": "default" })} ` })}`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/index.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
