/* empty css                                        */
import { g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Edit, User, Mail, Phone } from 'lucide-react';
import { f as fetchHook } from '../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../renderers.mjs';

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("app_token");
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchProfile();
  }, [token]);
  const fetchProfile = async () => {
    const response = await fetchHook({ url: "v1/profile", token });
    if (response.ok && response.data) setUser(response.data.data || response.data);
    setIsLoading(false);
  };
  if (isLoading) return /* @__PURE__ */ jsx("div", { className: "flex min-h-[300px] items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent" }) });
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl rounded-lg bg-white p-6 shadow", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[var(--second-font-color)]", children: "معلومات الحساب" }),
      /* @__PURE__ */ jsxs("a", { href: "/profile/edit", className: "flex items-center gap-1 text-[var(--main-color)] hover:underline", children: [
        /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }),
        " تعديل"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-gray-400" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "الاسم" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: user?.name || "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-gray-400" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "البريد" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: user?.email || "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-gray-400" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "الهاتف" }),
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: user?.phone || "-" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 border-t pt-6", children: /* @__PURE__ */ jsx("a", { href: "/order", className: "block w-full rounded-lg border border-[var(--main-color)] py-3 text-center font-medium text-[var(--main-color)] hover:bg-orange-50", children: "عرض طلباتي" }) })
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <h1 class="mb-8 text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> <!-- Profile Component - React Island --> ${renderComponent($$result2, "Profile", Profile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Profile/Profile", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/profile/index.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/profile/index.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
