/* empty css                                           */
import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DZHAztx_.mjs';
import 'kleur/colors';
import { $ as $$AuthLayout } from '../../chunks/AuthLayout_DkEnnsmn.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { f as fetchHook } from '../../chunks/fetchSettings_PP77heLr.mjs';
export { renderers } from '../../renderers.mjs';

function ForgotPasswordVerify({ email }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;
    const newCode = [...code];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 4) {
      toast.error("الرجاء إدخال رمز التحقق المكون من 4 أرقام");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchHook({
        url: `verify-otp?email=${encodeURIComponent(email)}&otp=${otpCode}`,
        init: { method: "POST" }
      });
      if (response.ok && response.data?.token) {
        Cookies.set("verify_token", response.data.token, {
          expires: 1,
          path: "/"
        });
        toast.success("تم التحقق من البريد الإلكتروني بنجاح!");
        window.location.href = `/forgot-password/${encodeURIComponent(email)}/reset`;
      } else {
        toast.error(response.error || "رمز التحقق غير صحيح");
      }
    } catch (error) {
      toast.error(error?.message || "حدث خطأ أثناء التحقق");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetchHook({
        url: "send-otp",
        init: {
          method: "POST",
          body: JSON.stringify({ email })
        }
      });
      if (response.ok) {
        toast.success("تم إعادة إرسال رمز التحقق");
      } else {
        toast.error(response.error || "حدث خطأ أثناء إعادة إرسال الرمز");
      }
    } catch (error) {
      toast.error(error?.message || "حدث خطأ");
    } finally {
      setIsResending(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsx("label", { className: "mb-3 block text-sm font-medium text-gray-700", children: "أدخل رمز التحقق" }),
      /* @__PURE__ */ jsx("div", { dir: "ltr", className: "flex justify-center gap-3", children: code.map((digit, index) => /* @__PURE__ */ jsx(
        "input",
        {
          id: `otp-${index}`,
          type: "text",
          inputMode: "numeric",
          maxLength: 1,
          value: digit,
          onChange: (e) => handleInputChange(index, e.target.value),
          onKeyDown: (e) => handleKeyDown(index, e),
          onPaste: handlePaste,
          className: "h-14 w-14 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold focus:border-[var(--main-color)] focus:outline-none",
          disabled: isLoading
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: isLoading || code.join("").length !== 4,
        className: "flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--main-color)] py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:bg-gray-300 disabled:opacity-50",
        children: [
          isLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }),
          isLoading ? "جاري التحقق..." : "تحقق"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleResendCode,
          disabled: isResending || isLoading,
          className: "font-medium text-[var(--main-color)] transition-colors hover:opacity-80 disabled:text-gray-400",
          children: isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/login",
          className: "font-medium text-gray-600 transition-colors hover:text-[var(--main-color)]",
          children: "العودة لتسجيل الدخول"
        }
      )
    ] })
  ] });
}

const $$Astro = createAstro("https://example.com");
const prerender = false;
const $$email = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$email;
  const { email } = Astro2.params;
  const decodedEmail = decodeURIComponent(email || "");
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full max-w-md"> <div class="boxFrom rounded-lg bg-white p-8 shadow-lg"> <div class="text-center"> <h1 class="mb-2 text-2xl font-bold text-[var(--second-font-color)]">
التحقق من البريد الإلكتروني
</h1> <p class="mb-6 text-sm text-gray-600">
تم إرسال رمز تحقق مكون من 4 أرقام إلى
<span class="block font-medium text-[var(--main-color)]">${decodedEmail}</span> </p> </div> <!-- Forgot Password Verify Form - React Island --> ${renderComponent($$result2, "ForgotPasswordVerify", ForgotPasswordVerify, { "client:load": true, "email": decodedEmail, "client:component-hydration": "load", "client:component-path": "@/components/Auth/ForgotPasswordVerify", "client:component-export": "default" })} <div class="mt-6 text-center text-sm text-gray-600"> <a href="/login" class="text-[var(--main-color)] hover:underline">
العودة لتسجيل الدخول
</a> </div> </div> </div> ` })}`;
}, "F:/react js projects/web-small-business-react/src/pages/forgot-password/[email].astro", void 0);

const $$file = "F:/react js projects/web-small-business-react/src/pages/forgot-password/[email].astro";
const $$url = "/forgot-password/[email]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$email,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
