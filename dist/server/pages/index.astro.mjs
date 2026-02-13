/* empty css                                        */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { u as useCartStore, $ as $$BaseLayout } from '../chunks/BaseLayout_DGf6_HP9.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as Pagination$1, Autoplay, Navigation } from 'swiper/modules';
/* empty css                                 */
/* empty css                                 */
import { useState } from 'react';
import { Flame, Loader2, ShoppingCart } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { f as fetchHook } from '../chunks/fetchSettings_BSzKgKzb.mjs';
import { c as cn } from '../chunks/utils_B05Dmz_H.mjs';
export { renderers } from '../renderers.mjs';

function HeroContent({ data }) {
  const linkLocation = data?.type === "product" ? `/products/${data?.id}` : data?.type === "category" ? `/?category=${data?.id}` : data?.type === "external" ? data?.link || "" : "/";
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: linkLocation,
      "aria-label": `Navigate to ${data.title}`,
      className: "absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-4 text-center",
      children: [
        data.title && /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl", children: data.title }),
        data.desc && /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-sm text-white opacity-90 drop-shadow md:text-base lg:text-lg", children: data.desc })
      ]
    }
  );
}
function Hero({ banners }) {
  if (!banners || banners.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("section", { className: "heroContainer relative w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Pagination$1, Autoplay],
        pagination: {
          clickable: true,
          dynamicBullets: true
        },
        autoplay: {
          delay: 5e3,
          disableOnInteraction: true
        },
        loop: banners.length > 1,
        className: "heroSwiper h-[300px] w-full md:h-[400px] lg:h-[500px]",
        children: banners.map((slide, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: slide.image,
                alt: slide.title || "Banner",
                className: "h-full w-full object-cover object-center",
                loading: index === 0 ? "eager" : "lazy"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--main-color)_80%,transparent)] to-transparent" })
          ] }),
          /* @__PURE__ */ jsx(HeroContent, { data: slide })
        ] }) }, slide.id))
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .heroSwiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .heroSwiper .swiper-pagination-bullet-active {
          background: var(--main-color);
          opacity: 1;
        }
      ` })
  ] });
}

function ProductCard({
  product,
  showAddToCart = true
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { incrementCartCount } = useCartStore();
  const discount = product.discount ? parseInt(product.discount) : 0;
  const hasDiscount = discount > 0;
  const isVariation = product.is_variation;
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = Cookies.get("app_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (isVariation) {
      window.location.href = `/products/${product.id}`;
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("product_id", product.id.toString());
      formData.append("quantity", "1");
      const response = await fetchHook({
        url: "v1/basket/add",
        init: {
          method: "POST",
          body: formData,
          headers: {}
        },
        token
      });
      if (response.ok) {
        toast.success("تم إضافة المنتج للسلة");
        incrementCartCount();
      } else {
        toast.error(response.error || "حدث خطأ");
      }
    } catch (error) {
      toast.error(error?.message || "حدث خطأ");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "group min-h-[350px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-fit", children: [
      /* @__PURE__ */ jsx("a", { href: `/products/${product.id}`, className: "relative block h-fit", children: product.main_image || product.gallery_images?.[0] || product.image ? /* @__PURE__ */ jsx(
        "img",
        {
          src: product.main_image || product.gallery_images?.[0] || product.image,
          alt: product.name || "",
          className: "h-auto w-full max-w-full object-center transition-all duration-200 group-hover:brightness-90",
          loading: "lazy"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "flex h-52 w-full items-center justify-center bg-gray-200", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "لا توجد صورة" }) }) }),
      hasDiscount && /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4", children: /* @__PURE__ */ jsx(Flame, { fill: "red", className: "h-8 w-8 text-transparent" }) }),
      showAddToCart && !isVariation && /* @__PURE__ */ jsx(
        "button",
        {
          "aria-label": "Add product to cart",
          disabled: isLoading,
          onClick: handleAddToCart,
          className: "absolute bottom-2 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 disabled:cursor-not-allowed",
          children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-[var(--main-color)]" }) : /* @__PURE__ */ jsx(ShoppingCart, { className: "h-6 w-6 text-[var(--main-color)]" })
        }
      ),
      product.is_available === false && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsx("span", { className: "rounded bg-gray-800 px-3 py-1 text-sm text-white", children: "غير متوفر" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-start gap-2 px-4 pb-6 pt-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "my-2 line-clamp-2 text-sm font-semibold sm:text-base", children: product.name }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: hasDiscount ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "ml-1 text-lg font-bold text-orange-500 sm:text-xl", children: [
          product.price_after,
          " ج.م"
        ] }),
        product.price_after !== product.price && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 line-through", children: [
          product.price,
          " ج.م"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-green-600", children: [
          product.discount,
          "%"
        ] })
      ] }) : /* @__PURE__ */ jsxs("span", { className: "ml-1 text-lg font-bold text-orange-500 sm:text-xl", children: [
        product.price,
        " ج.م"
      ] }) }) }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `/products/${product.id}`,
          className: "text-sm hover:text-[var(--second-color)] hover:underline",
          children: "عرض المزيد"
        }
      )
    ] })
  ] });
}

function OfferProducts({ products }) {
  if (!products || products.length === 0) {
    return /* @__PURE__ */ jsxs("section", { className: "container py-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-8 text-2xl font-bold", children: "العروض" }),
      /* @__PURE__ */ jsx("div", { className: "flex min-h-[200px] items-center justify-center rounded-lg bg-gray-100", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "لا توجد عروض حالياً" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "container py-10", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-8 text-2xl font-bold", children: "العروض" }),
    /* @__PURE__ */ jsx("div", { className: "offer-swiper-container", children: /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Navigation, Autoplay],
        navigation: true,
        autoplay: {
          delay: 3e3,
          disableOnInteraction: false
        },
        breakpoints: {
          320: {
            slidesPerView: 1.4,
            spaceBetween: 10
          },
          480: {
            slidesPerView: 2.4,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 3.4,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 4.5,
            spaceBetween: 26
          }
        },
        loop: products.length > 4,
        className: "offer-swiper min-h-[300px]",
        children: products.map((product) => /* @__PURE__ */ jsx(SwiperSlide, { className: "py-4", children: /* @__PURE__ */ jsx("div", { className: "group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg", children: /* @__PURE__ */ jsx(ProductCard, { product }) }) }, product.id))
      }
    ) }),
    /* @__PURE__ */ jsx("style", { children: `
        .offer-swiper .swiper-button-next,
        .offer-swiper .swiper-button-prev {
          color: var(--main-color);
          background: white;
          padding: 24px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .offer-swiper .swiper-button-next:after,
        .offer-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
      ` })
  ] });
}

function CategoryBox({
  category,
  onClick,
  isActive
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group flex cursor-pointer flex-col items-center",
      onClick,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "relative h-16 w-16 overflow-hidden rounded-full border-2 bg-white p-1 shadow-md transition-all duration-200",
              isActive ? "border-[var(--main-color)]" : "border-transparent"
            ),
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: category.icon || category.image,
                alt: category.name,
                className: "h-full w-full rounded-full object-cover transition-all duration-200 group-hover:brightness-90",
                loading: "lazy"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "mt-3 text-center text-[14px] font-semibold text-gray-700",
              isActive && "text-[var(--main-color)]"
            ),
            children: category.name
          }
        )
      ]
    }
  );
}
function scrollToProducts(elementId, top = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - top,
      behavior: "smooth"
    });
  }
}
function Categories({
  categories,
  selectedCategory
}) {
  const categoryList = Array.isArray(categories) ? categories : [];
  if (categoryList.length === 0) {
    return null;
  }
  const handleCategoryClick = (categoryId) => {
    const url = new URL(window.location.href);
    const categoryIdStr = String(categoryId);
    if (categoryIdStr === selectedCategory) {
      url.searchParams.delete("category");
      url.searchParams.delete("sub_category");
    } else {
      url.searchParams.delete("sub_category");
      url.searchParams.set("category", categoryIdStr);
      url.searchParams.set("page", "1");
    }
    window.location.href = url.toString();
    if (categoryIdStr !== selectedCategory) {
      setTimeout(() => scrollToProducts("products", 270), 100);
    }
  };
  const selectedCategoryData = categoryList.find(
    (c) => String(c.id) === selectedCategory
  );
  const hasSubcategories = selectedCategoryData?.subcategories && selectedCategoryData.subcategories.length > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-visible bg-gray-50", children: [
      /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("h2", { className: "pt-6 text-right text-2xl font-bold text-gray-800", children: "اكتشف الفئات" }) }),
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-[400] bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(
        Swiper,
        {
          modules: [Navigation, Autoplay],
          navigation: true,
          autoplay: selectedCategory ? false : {
            delay: 3e3,
            disableOnInteraction: true,
            pauseOnMouseEnter: true
          },
          breakpoints: {
            320: { slidesPerView: 3.4, spaceBetween: 10 },
            480: { slidesPerView: 4.4, spaceBetween: 10 },
            640: { slidesPerView: 5.4, spaceBetween: 15 },
            768: { slidesPerView: 8.5, spaceBetween: 20 },
            1024: { slidesPerView: 10.5, spaceBetween: 15 },
            1280: { slidesPerView: 14.5, spaceBetween: 15 }
          },
          loop: categoryList.length > 10,
          className: "categories-swiper min-h-fit py-4",
          children: categoryList.map((category) => /* @__PURE__ */ jsx(
            SwiperSlide,
            {
              className: "group cursor-pointer overflow-hidden py-4",
              children: /* @__PURE__ */ jsx(
                CategoryBox,
                {
                  isActive: selectedCategory === String(category.id),
                  category,
                  onClick: () => handleCategoryClick(category.id)
                }
              )
            },
            category.id
          ))
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container flex items-center justify-between py-8 max-md:flex-col max-md:justify-center max-md:gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-right text-2xl font-bold text-gray-800", children: selectedCategoryData ? selectedCategoryData.name : "المنتجات" }),
      hasSubcategories && /* @__PURE__ */ jsxs("div", { className: "flex max-w-full items-center justify-center gap-2 max-md:flex-col", children: [
        /* @__PURE__ */ jsx("bdi", { className: "mb-4 text-sm font-bold", children: "اختر الفئة الفرعية:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: selectedCategoryData.subcategories.map((sub) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const url = new URL(window.location.href);
              url.searchParams.set("sub_category", String(sub.id));
              url.searchParams.set("page", "1");
              window.location.href = url.toString();
            },
            className: "rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200",
            children: sub.name
          },
          sub.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .categories-swiper .swiper-button-next,
        .categories-swiper .swiper-button-prev {
          color: var(--main-color);
          background: white;
          padding: 20px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .categories-swiper .swiper-button-next:after,
        .categories-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }
      ` })
  ] });
}

function Pagination({
  totalPages,
  currentPage
}) {
  const handlePageChange = (page) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    window.location.href = url.toString();
  };
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    const visible = [];
    if (currentPage <= 3) {
      visible.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      visible.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      visible.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return visible;
  };
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center justify-center gap-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handlePageChange(currentPage - 1),
        disabled: currentPage === 1,
        className: "rounded border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
        children: "السابق"
      }
    ),
    getVisiblePages().map(
      (page, index) => typeof page === "number" ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePageChange(page),
          className: `rounded border px-3 py-2 transition-colors ${page === currentPage ? "border-[var(--main-color)] bg-[var(--main-color)] text-white" : "border-gray-200 hover:bg-gray-100"}`,
          children: page
        },
        index
      ) : /* @__PURE__ */ jsx("span", { className: "px-2", children: "..." }, index)
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handlePageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        className: "rounded border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
        children: "التالي"
      }
    )
  ] });
}
function NotFoundProducts({ text = "منتجات" }) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center rounded-lg bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-6xl", children: "📦" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xl text-gray-500", children: [
      "لا توجد ",
      text
    ] })
  ] }) });
}
function Products({
  products,
  currentPage,
  totalPages,
  selectedCategory
}) {
  if (!products || products.length === 0) {
    return /* @__PURE__ */ jsx("section", { className: "py-10", id: "products", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsx(NotFoundProducts, {}),
      selectedCategory && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx("a", { href: "/", className: "text-[var(--main-color)] hover:underline", children: "عرض جميع المنتجات" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsx("section", { className: "py-10", id: "products", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-between max-sm:flex-col max-sm:justify-center max-sm:gap-4" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: products.map((product) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg",
        children: /* @__PURE__ */ jsx(ProductCard, { product })
      },
      product.id
    )) }),
    totalPages > 1 && /* @__PURE__ */ jsx(Pagination, { totalPages, currentPage })
  ] }) });
}

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const url = new URL(Astro2.request.url);
  const category = url.searchParams.get("category") || "";
  const subCategory = url.searchParams.get("sub_category") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";
  let productsUrl = `v1/product?page=${page}&limit=${limit}`;
  if (category) {
    productsUrl += `&category_id=${category}`;
  }
  if (subCategory) {
    productsUrl += `&sub_category_id=${subCategory}`;
  }
  const [bannersRes, categoriesRes, productsRes, offersRes] = await Promise.all([
    fetchHook({ url: "v1/banner" }),
    fetchHook({ url: "v1/categories" }),
    fetchHook({ url: productsUrl }),
    fetchHook({ url: "v1/product?offer=1&limit=8" })
  ]);
  console.log("bannersRes", bannersRes);
  const banners = bannersRes.ok ? bannersRes.data?.data || bannersRes.data || [] : [];
  const categories = categoriesRes.ok ? categoriesRes.data?.data || categoriesRes.data || [] : [];
  const products = productsRes.ok ? productsRes.data : { data: [], total: 0, last_page: 1 };
  const offerProducts = offersRes.ok ? offersRes.data?.data || offersRes.data || [] : [];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- Hero Banner - React Island for Swiper carousel --> ${renderComponent($$result2, "Hero", Hero, { "client:load": true, "banners": banners, "client:component-hydration": "load", "client:component-path": "@/components/Hero/Hero", "client:component-export": "default" })} <!-- Offer Products Section - React Island for interactivity --> ${renderComponent($$result2, "OfferProducts", OfferProducts, { "client:visible": true, "products": offerProducts, "client:component-hydration": "visible", "client:component-path": "@/components/OfferProducts/OfferProducts", "client:component-export": "default" })} <!-- Categories Section - React Island for filtering --> ${renderComponent($$result2, "Categories", Categories, { "client:visible": true, "categories": categories, "selectedCategory": category, "client:component-hydration": "visible", "client:component-path": "@/components/Categories/Categories", "client:component-export": "default" })} <!-- Products Grid - React Island for pagination and cart actions --> ${renderComponent($$result2, "Products", Products, { "client:visible": true, "products": products.data || products, "currentPage": parseInt(page), "totalPages": products.last_page || 1, "selectedCategory": category, "client:component-hydration": "visible", "client:component-path": "@/components/Products/Products", "client:component-export": "default" })} </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/index.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/index.astro";
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
