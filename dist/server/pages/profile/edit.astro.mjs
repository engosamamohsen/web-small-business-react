/* empty css                                           */
import { g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_CHtgl8NP.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { f as fetchHook } from '../../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../../renderers.mjs';

function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("app_token");
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchHook({ url: "v1/profile", token }).then((res) => {
      if (res.ok && res.data) {
        setValue("name", res.data.data?.name || "");
        setValue("phone", res.data.data?.phone || "");
      }
    });
  }, [token, setValue]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await fetchHook({ url: "v1/profile", init: { method: "PUT", body: JSON.stringify(data) }, token });
    if (response.ok) {
      toast.success("تم تحديث الملف الشخصي");
      window.location.href = "/profile";
    } else toast.error(response.error || "حدث خطأ");
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl rounded-lg bg-white p-6 shadow", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium", children: "الاسم" }),
      /* @__PURE__ */ jsx("input", { ...register("name"), className: "w-full rounded-lg border px-4 py-3" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium", children: "الهاتف" }),
      /* @__PURE__ */ jsx("input", { ...register("phone"), className: "w-full rounded-lg border px-4 py-3", dir: "ltr" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx("a", { href: "/profile", className: "flex-1 rounded-lg border py-3 text-center hover:bg-gray-50", children: "إلغاء" }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: isLoading, className: "flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 text-white disabled:opacity-50", children: [
        isLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
        "حفظ"
      ] })
    ] })
  ] }) });
}

const prerender = false;
const $$Edit = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="container mx-auto px-4"> <h1 class="mb-8 text-2xl font-bold text-[var(--second-font-color)]"> ${pageTitle} </h1> <!-- Edit Profile Component - React Island --> ${renderComponent($$result2, "EditProfile", EditProfile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Profile/EditProfile", "client:component-export": "default" })} </div> </main> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/profile/edit.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/profile/edit.astro";
const $$url = "/profile/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
