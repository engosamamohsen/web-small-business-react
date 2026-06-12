import { e as createAstro, f as createComponent } from '../../chunks/astro/server_BA59mY36.mjs';
import 'piccolore';
import 'clsx';
import { f as fetchHook } from '../../chunks/fetch-hook_Bta3HEL4.mjs';
import { b as buildProductPath } from '../../chunks/product-url_CFiTjzDR.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://*.cashierthru.com");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const lastSegment = slug.split("-").pop() ?? "";
  const id = /^\d+$/.test(lastSegment) ? lastSegment : slug.match(/^(\d+)/)?.[1] ?? null;
  if (!id) {
    return Astro2.redirect("/404");
  }
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
  return Astro2.redirect(buildProductPath({ ...productData, id }), 301);
}, "F:/react js projects/kamal/web-small-business-react/src/pages/products/[slug].astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/products/[slug].astro";
const $$url = "/products/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$slug,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
