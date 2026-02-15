import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, i as addAttribute } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_CxhoI3tg.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import Cookies from 'js-cookie';
import { b as useAsync, $ as $api, a as useRouter, I as Image, H as Header, F as Footer, p as packageJson } from '../../chunks/package_CyaH-9oZ.mjs';
import 'react-toastify';
import { P as PageLoader } from '../../chunks/PageLoader_6WRPkHu1.mjs';
import * as React from 'react';
import { u as useMergeProps, P as PrimeReactContext, a as useHandleStyle, O as ObjectUtils, c as classNames, C as ComponentBase, B as Button } from '../../chunks/button.esm_DKcfQX2F.mjs';
import { a as fetchSettings } from '../../chunks/fetchSettings_COq2Kj7n.mjs';
export { renderers } from '../../renderers.mjs';

const useProfileServices = () => {
  const router = useRouter();
  const { value, loading, error } = useAsync(async () => {
    return $api.post("/get-profile");
  }, []);
  const errorStatus = error?.status;
  if (errorStatus === 403) {
    Cookies.remove("app_token");
    router.push("/auth/login");
  }
  return { data: value?.data?.data, loading };
};

var classes = {
  root: 'p-card p-component',
  header: 'p-card-header',
  title: 'p-card-title',
  subTitle: 'p-card-subtitle',
  content: 'p-card-content',
  footer: 'p-card-footer',
  body: 'p-card-body'
};
var styles = "\n@layer primereact {\n    .p-card-header img {\n        width: 100%;\n    }\n}\n";
var CardBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Card',
    id: null,
    header: null,
    footer: null,
    title: null,
    subTitle: null,
    style: null,
    className: null,
    children: undefined
  },
  css: {
    classes: classes,
    styles: styles
  }
});

var Card = /*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = CardBase.getProps(inProps, context);
  var elementRef = React.useRef(ref);
  var _CardBase$setMetaData = CardBase.setMetaData({
      props: props
    }),
    ptm = _CardBase$setMetaData.ptm,
    cx = _CardBase$setMetaData.cx,
    isUnstyled = _CardBase$setMetaData.isUnstyled;
  useHandleStyle(CardBase.css.styles, isUnstyled, {
    name: 'card'
  });
  var createHeader = function createHeader() {
    var headerProps = mergeProps({
      className: cx('header')
    }, ptm('header'));
    if (props.header) {
      return /*#__PURE__*/React.createElement("div", headerProps, ObjectUtils.getJSXElement(props.header, props));
    }
    return null;
  };
  var createBody = function createBody() {
    var titleProps = mergeProps({
      className: cx('title')
    }, ptm('title'));
    var title = props.title && /*#__PURE__*/React.createElement("div", titleProps, ObjectUtils.getJSXElement(props.title, props));
    var subTitleProps = mergeProps({
      className: cx('subTitle')
    }, ptm('subTitle'));
    var subTitle = props.subTitle && /*#__PURE__*/React.createElement("div", subTitleProps, ObjectUtils.getJSXElement(props.subTitle, props));
    var contentProps = mergeProps({
      className: cx('content')
    }, ptm('content'));
    var children = props.children && /*#__PURE__*/React.createElement("div", contentProps, props.children);
    var footerProps = mergeProps({
      className: cx('footer')
    }, ptm('footer'));
    var footer = props.footer && /*#__PURE__*/React.createElement("div", footerProps, ObjectUtils.getJSXElement(props.footer, props));
    var bodyProps = mergeProps({
      className: cx('body')
    }, ptm('body'));
    return /*#__PURE__*/React.createElement("div", bodyProps, title, subTitle, children, footer);
  };
  React.useEffect(function () {
    ObjectUtils.combinedRefs(elementRef, ref);
  }, [elementRef, ref]);
  var rootProps = mergeProps({
    id: props.id,
    ref: elementRef,
    style: props.style,
    className: classNames(props.className, cx('root'))
  }, CardBase.getOtherProps(props), ptm('root'));
  var header = createHeader();
  var body = createBody();
  return /*#__PURE__*/React.createElement("div", rootProps, header, body);
});
Card.displayName = 'Card';

function Profile() {
  const { data, loading } = useProfileServices();
  const router = useRouter();
  if (loading) {
    return /* @__PURE__ */ jsx(PageLoader, { text: "جاري تحميل الملف الشخصي" });
  }
  if (!data) {
    return /* @__PURE__ */ jsxs("div", { className: "p-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 text-lg font-bold", children: "لم يتم العثور على الملف الشخصي" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          label: "إنشاء ملف شخصي",
          icon: "pi pi-user-edit",
          onClick: () => router.push("/profile/edit"),
          className: "bg-[var(--main-color)] px-4 py-2 text-white"
        }
      )
    ] });
  }
  const header = /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "الملف الشخصي" }),
    /* @__PURE__ */ jsx(
      Button,
      {
        icon: "pi pi-pencil",
        onClick: () => router.push("/profile/edit"),
        className: "bg-[var(--main-color)] p-2 text-white",
        tooltip: "تعديل الملف الشخصي",
        tooltipOptions: { position: "bottom" }
      }
    )
  ] });
  return /* @__PURE__ */ jsx("div", { className: "p-4 md:p-6", children: /* @__PURE__ */ jsx(Card, { className: "mx-auto max-w-3xl shadow-md", header, dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: data.image_url ? /* @__PURE__ */ jsx("div", { className: "relative mx-auto h-[200px] w-[200px] overflow-hidden rounded-full", children: /* @__PURE__ */ jsx(
      Image,
      {
        src: data.image_url,
        alt: data.name || "صورة الملف الشخصي",
        width: 200,
        height: 200,
        className: "h-[200px] min-h-[200px] w-[200px] rounded-full border object-cover"
      }
    ) }) : /* @__PURE__ */ jsx("div", { className: "flex h-[200px] w-[200px] items-center justify-center rounded-full bg-gray-200 text-4xl text-gray-500", children: /* @__PURE__ */ jsx("i", { className: "pi pi-user" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "pi pi-user text-[var(--main-color)]" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "الاسم" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-lg", children: data.name || "--" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "pi pi-envelope text-[var(--main-color)]" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "البريد الإلكتروني" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-lg", children: data.email || "--" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gray-50 p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "pi pi-phone text-[var(--main-color)]" }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "رقم الهاتف" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-lg", children: data.phone || "--" })
      ] })
    ] })
  ] }) }) });
}

const $$Astro = createAstro("https://admin-emend.cashierthru.com");
const prerender = false;
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const token = Astro2.cookies.get("app_token")?.value;
  if (!token) {
    return Astro2.redirect("/auth/login");
  }
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
  const pageTitle = "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A - " + (settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631");
  const pageDescription = "\u0639\u0631\u0636 \u0648\u0625\u062F\u0627\u0631\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A \u0648\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628\u0627\u062A";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "UserProfile", Profile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Profile/Index", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
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
</span> </div> <span class="sr-only">تواصل معنا عبر الواتساب</span> </a>`} ${renderComponent($$result3, "Footer", Footer, { "settingsData": settingsData, "appVersion": appVersion, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Footer", "client:component-export": "default" })}  ${renderComponent($$result3, "ToastContainer", null, { "position": "bottom-right", "rtl": true, "autoClose": 3e3, "hideProgressBar": false, "newestOnTop": true, "closeOnClick": true, "pauseOnFocusLoss": true, "draggable": true, "pauseOnHover": true, "theme": "light", "client:only": "react", "client:component-hydration": "only", "client:component-path": "react-toastify", "client:component-export": "ToastContainer" })} ` })} ` })}`;
}, "F:/react js projects/kamal/web-small-business-react/src/pages/user/profile.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/user/profile.astro";
const $$url = "/user/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
