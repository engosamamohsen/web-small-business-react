/* empty css                                              */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$AuthLayout } from '../../../chunks/AuthLayout_DkEnnsmn.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { EyeOff, Eye, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { f as fetchHook } from '../../../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../../../renderers.mjs';

const resetPasswordSchema = z.object({
  new_password: z.string().min(8, { message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" }),
  new_password_confirmation: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" })
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "كلمات المرور غير متطابقة",
  path: ["new_password_confirmation"]
});
function ResetPasswordForm({ email }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      new_password_confirmation: ""
    }
  });
  const onSubmit = async (data) => {
    const verifyToken = Cookies.get("verify_token");
    if (!verifyToken) {
      toast.error("انتهت صلاحية الجلسة. يرجى إعادة التحقق من البريد الإلكتروني");
      window.location.href = "/forgot-password";
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: "reset-password",
        init: {
          method: "POST",
          body: JSON.stringify({
            new_password: data.new_password,
            new_password_confirmation: data.new_password_confirmation,
            token: verifyToken
          })
        }
      });
      if (response.ok || response.status === 200) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        Cookies.remove("verify_token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(response.error || "حدث خطأ أثناء تغيير كلمة المرور");
      }
    } catch (error) {
      toast.error(error?.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", dir: "rtl", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "new_password",
            className: "mb-1 block text-sm font-medium text-gray-700",
            children: "كلمة المرور الجديدة"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "new_password",
              type: showPassword ? "text" : "password",
              ...register("new_password"),
              className: "w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-[var(--main-color)] focus:outline-none",
              dir: "ltr",
              disabled: isLoading
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
              children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 20 }) : /* @__PURE__ */ jsx(Eye, { size: 20 })
            }
          )
        ] }),
        errors.new_password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.new_password.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "new_password_confirmation",
            className: "mb-1 block text-sm font-medium text-gray-700",
            children: "تأكيد كلمة المرور"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "new_password_confirmation",
              type: showConfirmPassword ? "text" : "password",
              ...register("new_password_confirmation"),
              className: "w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-[var(--main-color)] focus:outline-none",
              dir: "ltr",
              disabled: isLoading
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
              children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 20 }) : /* @__PURE__ */ jsx(Eye, { size: 20 })
            }
          )
        ] }),
        errors.new_password_confirmation && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.new_password_confirmation.message })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: isLoading,
        className: "flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50",
        children: [
          isLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
          isLoading ? "جاري إعادة تعيين كلمة المرور..." : "إعادة تعيين كلمة المرور"
        ]
      }
    )
  ] });
}

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$Reset = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reset;
  const { email } = Astro2.params;
  const decodedEmail = decodeURIComponent(email || "");
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full max-w-md"> <div class="boxFrom rounded-lg bg-white p-8 shadow-lg"> <div class="text-center"> <h1 class="mb-2 text-2xl font-bold text-[var(--second-font-color)]">
إعادة تعيين كلمة المرور
</h1> <p class="mb-6 text-sm text-gray-600">
يمكنك الآن إعادة تعيين كلمة المرور لـ
<span class="block font-medium text-[var(--main-color)]">${decodedEmail}</span> </p> </div> <!-- Reset Password Form - React Island --> ${renderComponent($$result2, "ResetPasswordForm", ResetPasswordForm, { "client:load": true, "email": decodedEmail, "client:component-hydration": "load", "client:component-path": "@/components/Auth/ResetPasswordForm", "client:component-export": "default" })} <div class="mt-6 text-center text-sm text-gray-600"> <a href="/login" class="text-[var(--main-color)] hover:underline">
العودة لتسجيل الدخول
</a> </div> </div> </div> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/forgot-password/[email]/reset.astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/forgot-password/[email]/reset.astro";
const $$url = "/forgot-password/[email]/reset";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reset,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
