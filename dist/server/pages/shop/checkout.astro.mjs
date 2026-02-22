import { f as createAstro, g as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, i as addAttribute } from '../../chunks/astro/server_RokZUlch.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_C9OKOB99.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useState } from 'react';
import { $ as $api, d as useAsync, c as cn, e as IconBase, f as useMergeProps, P as PrimeReactContext, g as usePrevious, h as useStyle, i as useResizeListener, j as useEventListener, k as DomHandler, l as useUpdateEffect$1, O as ObjectUtils, m as classNames, C as ComponentBase, S as SpinnerIcon, n as IconUtils, o as useDebounce, q as PrimeReact, r as useHandleStyle, t as useOverlayListener, v as useMountEffect, w as useUnmountEffect, Z as ZIndexUtils, T as Tooltip, x as FilterService, y as localeOption, z as TimesIcon, A as Portal, E as CSSTransition, R as Ripple, G as OverlayService, D as Dialog, B as Button, J as InputText, L as Link, I as Image, u as useRouter, H as Header, F as Footer, p as packageJson } from '../../chunks/package_CJwS4JJH.mjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { t as transformSelectData } from '../../chunks/global_CwaxDU9D.mjs';
import { u as useAsyncRetry } from '../../chunks/useAsyncRetry_RBGU_9EX.mjs';
import { u as useUpdateEffect, I as InputTextarea } from '../../chunks/inputtextarea.esm_vZbFMe2d.mjs';
import { z } from 'zod';
import { S as Styles } from '../../chunks/checkout.68f73e18_D1efFPgj.mjs';
import { CircleX } from 'lucide-react';
import { a as useCartServices } from '../../chunks/cart_BD2bV6iC.mjs';
import { P as PageLoader } from '../../chunks/PageLoader_B7d3o92E.mjs';
import { a as fetchSettings } from '../../chunks/fetchSettings_Ldq5l7Md.mjs';
export { renderers } from '../../renderers.mjs';

const useGovernorate = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const { data } = await $api.get(`v1/city`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "id",
      valueKey: "name"
    });
    return transformData;
  }, []);
  return {
    loading,
    value,
    retry
  };
};
const useCities = (governorateId) => {
  const { value, loading } = useAsync(async () => {
    if (!governorateId) {
      return [];
    }
    const { data } = await $api.get(`v1/city/${governorateId}/cities`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "city_id",
      valueKey: "name"
    });
    return transformData;
  }, [governorateId]);
  return {
    loading,
    value
  };
};
const useGetAddress = () => {
  const { value, loading, retry } = useAsyncRetry(async () => {
    const { data } = await $api.get(`v1/customer-addresses/view`);
    return data?.data;
  }, []);
  return {
    loading,
    value,
    retry
  };
};
const useBranchesWithCity = (cityId) => {
  const { value, loading } = useAsync(async () => {
    if (!cityId) {
      return [];
    }
    const { data } = await $api.get(`/v1/branches/by-city/${cityId}`);
    const transformData = transformSelectData({
      data: data.data,
      idKey: "id",
      valueKey: "address"
    });
    return transformData;
  }, [cityId]);
  return {
    loading,
    value
  };
};
const useAddress = () => {
  const [loading, setLoading] = useState(false);
  const createAddress = async (inputs) => {
    try {
      setLoading(true);
      const data = await $api.post(
        `/v1/customer-address`,
        transformCreateAddressInputs({ ...inputs })
      );
      toast.success(`تمت إضافة العنوان الخاص بك`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return data;
    } catch (err) {
      toast.error(
        `  فشل اضافة العنوان الخاص بك : ${err?.response?.data?.message}`,
        {
          position: "top-right",
          autoClose: 2e3,
          rtl: true
        }
      );
      return err?.response;
    } finally {
      setLoading(false);
    }
  };
  return {
    createAddress,
    loading
  };
};
const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const createOrder = async (inputs) => {
    try {
      setLoading(true);
      const data = await $api.post(`v1/basket/buy`, {
        address_id: inputs.address?.id,
        shipping: inputs.shippingFees ?? 0,
        notes: inputs.desc,
        branch_id: inputs.branch_id?.value ?? null
      });
      toast.success(`تمت إضافة الطلب بنجاح`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return data;
    } catch (err) {
      toast.error(`  فشل اضافة الطلب : ${err?.response?.data?.message}`, {
        position: "top-right",
        autoClose: 2e3,
        rtl: true
      });
      return err?.response;
    } finally {
      setLoading(false);
    }
  };
  return {
    createOrder,
    loading
  };
};
const transformCreateAddressInputs = (inputs) => {
  return {
    name: inputs?.name,
    phone: inputs?.phone,
    email: inputs?.email,
    address: inputs?.address,
    area_id: inputs?.governorate?.value,
    city_id: inputs?.city?.value,
    shipping: 0,
    street: inputs?.street,
    special_sign: inputs?.special_Sign,
    floor: inputs?.floor,
    building: inputs?.building,
    flat: inputs?.flat,
    branch_id: inputs?.branch_id?.value
  };
};

const formSchema = z.object({
  desc: z.string().optional(),
  address: z.any({
    required_error: "يرجى اختيار عنوان"
  }).refine(
    (val) => val?.id !== "" && val?.id !== null && val?.id !== void 0,
    {
      message: "يرجى اختيار عنوان"
    }
  ),
  branch_id: z.any().optional()
});
const formSchemaDefaultValues = {
  desc: "",
  address: "",
  branch_id: ""
};

function AddressList({
  addresses,
  selectedAddressId,
  onSelectAddress
}) {
  useUpdateEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      onSelectAddress(addresses[0]);
    }
  }, [addresses, selectedAddressId]);
  if (!addresses || addresses.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "mb-4 space-y-3 rounded-lg border border-gray-200 px-4 py-6", children: /* @__PURE__ */ jsx("div", { className: "max-h-[300px] space-y-2 overflow-y-auto", children: addresses.map((address) => /* @__PURE__ */ jsx(
    "div",
    {
      onClick: () => onSelectAddress(address),
      className: cn(
        "cursor-pointer rounded-md border p-3 transition hover:border-orange-400",
        selectedAddressId === address.id ? "border-2 border-orange-500 bg-orange-50" : "border-gray-200"
      ),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
            address.city_name,
            ", ",
            address.area_name,
            ",",
            address.branch_name
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "شارع: ",
            address.street,
            ", عمارة: ",
            address.building,
            ", طابق:",
            address.floor,
            ", شقة: ",
            address.flat
          ] }),
          address.special_sign && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "علامة مميزة: ",
            address.special_sign
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            "هاتف: ",
            address.phone
          ] })
        ] }),
        selectedAddressId === address.id && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 text-orange-500", children: /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-6 w-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 13l4 4L19 7"
              }
            )
          }
        ) })
      ] })
    },
    address.id
  )) }) });
}

function _extends$5() {
  _extends$5 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$5.apply(this, arguments);
}

var ChevronDownIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$5({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }));
}));
ChevronDownIcon.displayName = 'ChevronDownIcon';

function _extends$4() {
  _extends$4 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$4.apply(this, arguments);
}

var ChevronUpIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    d: "M12.2097 10.4113C12.1057 10.4118 12.0027 10.3915 11.9067 10.3516C11.8107 10.3118 11.7237 10.2532 11.6506 10.1792L6.93602 5.46461L2.22139 10.1476C2.07272 10.244 1.89599 10.2877 1.71953 10.2717C1.54307 10.2556 1.3771 10.1808 1.24822 10.0593C1.11933 9.93766 1.035 9.77633 1.00874 9.6011C0.982477 9.42587 1.0158 9.2469 1.10338 9.09287L6.37701 3.81923C6.52533 3.6711 6.72639 3.58789 6.93602 3.58789C7.14565 3.58789 7.3467 3.6711 7.49502 3.81923L12.7687 9.09287C12.9168 9.24119 13 9.44225 13 9.65187C13 9.8615 12.9168 10.0626 12.7687 10.2109C12.616 10.3487 12.4151 10.4207 12.2097 10.4113Z",
    fill: "currentColor"
  }));
}));
ChevronUpIcon.displayName = 'ChevronUpIcon';

function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}

var SearchIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }));
}));
SearchIcon.displayName = 'SearchIcon';

function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}

function _typeof$1(o) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof$1(o);
}

function _toPrimitive$1(input, hint) {
  if (_typeof$1(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof$1(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey$1(arg) {
  var key = _toPrimitive$1(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}

function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit$1(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$2(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}

function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
}

var styles$1 = "\n.p-virtualscroller {\n    position: relative;\n    overflow: auto;\n    contain: strict;\n    transform: translateZ(0);\n    will-change: scroll-position;\n    outline: 0 none;\n}\n\n.p-virtualscroller-content {\n    position: absolute;\n    top: 0;\n    left: 0;\n    /*contain: content;*/\n    min-height: 100%;\n    min-width: 100%;\n    will-change: transform;\n}\n\n.p-virtualscroller-spacer {\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 1px;\n    width: 1px;\n    transform-origin: 0 0;\n    pointer-events: none;\n}\n\n.p-virtualscroller-loader {\n    position: sticky;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-virtualscroller-loader.p-component-overlay {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-virtualscroller-loading-icon {\n    font-size: 2rem;\n}\n\n.p-virtualscroller-horizontal > .p-virtualscroller-content {\n    display: flex;\n}\n\n/* Inline */\n.p-virtualscroller-inline .p-virtualscroller-content {\n    position: static;\n}\n";
var VirtualScrollerBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'VirtualScroller',
    __parentMetadata: null,
    id: null,
    style: null,
    className: null,
    tabIndex: 0,
    items: null,
    itemSize: 0,
    scrollHeight: null,
    scrollWidth: null,
    orientation: 'vertical',
    step: 0,
    numToleratedItems: null,
    delay: 0,
    resizeDelay: 10,
    appendOnly: false,
    inline: false,
    lazy: false,
    disabled: false,
    loaderDisabled: false,
    loadingIcon: null,
    columns: null,
    loading: undefined,
    autoSize: false,
    showSpacer: true,
    showLoader: false,
    loadingTemplate: null,
    loaderIconTemplate: null,
    itemTemplate: null,
    contentTemplate: null,
    onScroll: null,
    onScrollIndexChange: null,
    onLazyLoad: null,
    children: undefined
  },
  css: {
    styles: styles$1
  }
});

function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var VirtualScroller = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = VirtualScrollerBase.getProps(inProps, context);
  var prevProps = usePrevious(inProps) || {};
  var vertical = props.orientation === 'vertical';
  var horizontal = props.orientation === 'horizontal';
  var both = props.orientation === 'both';
  var _React$useState = React.useState(both ? {
      rows: 0,
      cols: 0
    } : 0),
    _React$useState2 = _slicedToArray$1(_React$useState, 2),
    firstState = _React$useState2[0],
    setFirstState = _React$useState2[1];
  var _React$useState3 = React.useState(both ? {
      rows: 0,
      cols: 0
    } : 0),
    _React$useState4 = _slicedToArray$1(_React$useState3, 2),
    lastState = _React$useState4[0],
    setLastState = _React$useState4[1];
  var _React$useState5 = React.useState(0),
    _React$useState6 = _slicedToArray$1(_React$useState5, 2),
    pageState = _React$useState6[0],
    setPageState = _React$useState6[1];
  var _React$useState7 = React.useState(both ? {
      rows: 0,
      cols: 0
    } : 0),
    _React$useState8 = _slicedToArray$1(_React$useState7, 2),
    numItemsInViewportState = _React$useState8[0],
    setNumItemsInViewportState = _React$useState8[1];
  var _React$useState9 = React.useState(props.numToleratedItems),
    _React$useState10 = _slicedToArray$1(_React$useState9, 2),
    numToleratedItemsState = _React$useState10[0],
    setNumToleratedItemsState = _React$useState10[1];
  var _React$useState11 = React.useState(props.loading || false),
    _React$useState12 = _slicedToArray$1(_React$useState11, 2),
    loadingState = _React$useState12[0],
    setLoadingState = _React$useState12[1];
  var _React$useState13 = React.useState([]),
    _React$useState14 = _slicedToArray$1(_React$useState13, 2),
    loaderArrState = _React$useState14[0],
    setLoaderArrState = _React$useState14[1];
  var _VirtualScrollerBase$ = VirtualScrollerBase.setMetaData({
      props: props,
      state: {
        first: firstState,
        last: lastState,
        page: pageState,
        numItemsInViewport: numItemsInViewportState,
        numToleratedItems: numToleratedItemsState,
        loading: loadingState,
        loaderArr: loaderArrState
      }
    }),
    ptm = _VirtualScrollerBase$.ptm;
  useStyle(VirtualScrollerBase.css.styles, {
    name: 'virtualscroller'
  });
  var elementRef = React.useRef(null);
  var _contentRef = React.useRef(null);
  var _spacerRef = React.useRef(null);
  var _stickyRef = React.useRef(null);
  var lastScrollPos = React.useRef(both ? {
    top: 0,
    left: 0
  } : 0);
  var scrollTimeout = React.useRef(null);
  var resizeTimeout = React.useRef(null);
  var contentStyle = React.useRef({});
  var spacerStyle = React.useRef({});
  var defaultWidth = React.useRef(null);
  var defaultHeight = React.useRef(null);
  var defaultContentWidth = React.useRef(null);
  var defaultContentHeight = React.useRef(null);
  var isItemRangeChanged = React.useRef(false);
  var lazyLoadState = React.useRef(null);
  var viewInitialized = React.useRef(false);
  var _useResizeListener = useResizeListener({
      listener: function listener(event) {
        return onResize();
      },
      when: !props.disabled
    }),
    _useResizeListener2 = _slicedToArray$1(_useResizeListener, 1),
    bindWindowResizeListener = _useResizeListener2[0];
  var _useEventListener = useEventListener({
      target: 'window',
      type: 'orientationchange',
      listener: function listener(event) {
        return onResize();
      },
      when: !props.disabled
    }),
    _useEventListener2 = _slicedToArray$1(_useEventListener, 1),
    bindOrientationChangeListener = _useEventListener2[0];
  var getElementRef = function getElementRef() {
    return elementRef;
  };
  var getPageByFirst = function getPageByFirst(first) {
    return Math.floor((first + numToleratedItemsState * 4) / (props.step || 1));
  };
  var setContentElement = function setContentElement(element) {
    _contentRef.current = element || _contentRef.current || DomHandler.findSingle(elementRef.current, '.p-virtualscroller-content');
  };
  var isPageChanged = function isPageChanged(first) {
    return props.step ? pageState !== getPageByFirst(first) : true;
  };
  var scrollTo = function scrollTo(options) {
    lastScrollPos.current = both ? {
      top: 0,
      left: 0
    } : 0;
    elementRef.current && elementRef.current.scrollTo(options);
  };
  var scrollToIndex = function scrollToIndex(index) {
    var behavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
    var _calculateNumItems = calculateNumItems(),
      numToleratedItems = _calculateNumItems.numToleratedItems;
    var contentPos = getContentPosition();
    var calculateFirst = function calculateFirst() {
      var _index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var _numT = arguments.length > 1 ? arguments[1] : undefined;
      return _index <= _numT ? 0 : _index;
    };
    var calculateCoord = function calculateCoord(_first, _size, _cpos) {
      return _first * _size + _cpos;
    };
    var scrollToItem = function scrollToItem() {
      var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return scrollTo({
        left: left,
        top: top,
        behavior: behavior
      });
    };
    var newFirst = both ? {
      rows: 0,
      cols: 0
    } : 0;
    var isRangeChanged = false;
    if (both) {
      newFirst = {
        rows: calculateFirst(index[0], numToleratedItems[0]),
        cols: calculateFirst(index[1], numToleratedItems[1])
      };
      scrollToItem(calculateCoord(newFirst.cols, props.itemSize[1], contentPos.left), calculateCoord(newFirst.rows, props.itemSize[0], contentPos.top));
      isRangeChanged = firstState.rows !== newFirst.rows || firstState.cols !== newFirst.cols;
    } else {
      newFirst = calculateFirst(index, numToleratedItems);
      horizontal ? scrollToItem(calculateCoord(newFirst, props.itemSize, contentPos.left), 0) : scrollToItem(0, calculateCoord(newFirst, props.itemSize, contentPos.top));
      isRangeChanged = firstState !== newFirst;
    }
    isItemRangeChanged.current = isRangeChanged;
    setFirstState(newFirst);
  };
  var scrollInView = function scrollInView(index, to) {
    var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'auto';
    if (to) {
      var _getRenderedRange = getRenderedRange(),
        first = _getRenderedRange.first,
        viewport = _getRenderedRange.viewport;
      var scrollToItem = function scrollToItem() {
        var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        return scrollTo({
          left: left,
          top: top,
          behavior: behavior
        });
      };
      var isToStart = to === 'to-start';
      var isToEnd = to === 'to-end';
      if (isToStart) {
        if (both) {
          if (viewport.first.rows - first.rows > index[0]) {
            scrollToItem(viewport.first.cols * props.itemSize[1], (viewport.first.rows - 1) * props.itemSize[0]);
          } else if (viewport.first.cols - first.cols > index[1]) {
            scrollToItem((viewport.first.cols - 1) * props.itemSize[1], viewport.first.rows * props.itemSize[0]);
          }
        } else if (viewport.first - first > index) {
          var pos = (viewport.first - 1) * props.itemSize;
          horizontal ? scrollToItem(pos, 0) : scrollToItem(0, pos);
        }
      } else if (isToEnd) {
        if (both) {
          if (viewport.last.rows - first.rows <= index[0] + 1) {
            scrollToItem(viewport.first.cols * props.itemSize[1], (viewport.first.rows + 1) * props.itemSize[0]);
          } else if (viewport.last.cols - first.cols <= index[1] + 1) {
            scrollToItem((viewport.first.cols + 1) * props.itemSize[1], viewport.first.rows * props.itemSize[0]);
          }
        } else if (viewport.last - first <= index + 1) {
          var _pos2 = (viewport.first + 1) * props.itemSize;
          horizontal ? scrollToItem(_pos2, 0) : scrollToItem(0, _pos2);
        }
      }
    } else {
      scrollToIndex(index, behavior);
    }
  };
  var getRows = function getRows() {
    return loadingState ? props.loaderDisabled ? loaderArrState : [] : loadedItems();
  };
  var getColumns = function getColumns() {
    if (props.columns && both || horizontal) {
      return loadingState && props.loaderDisabled ? both ? loaderArrState[0] : loaderArrState : props.columns.slice(both ? firstState.cols : firstState, both ? lastState.cols : lastState);
    }
    return props.columns;
  };
  var getRenderedRange = function getRenderedRange() {
    var calculateFirstInViewport = function calculateFirstInViewport(_pos, _size) {
      return Math.floor(_pos / (_size || _pos));
    };
    var firstInViewport = firstState;
    var lastInViewport = 0;
    if (elementRef.current) {
      var _elementRef$current = elementRef.current,
        scrollTop = _elementRef$current.scrollTop,
        scrollLeft = _elementRef$current.scrollLeft;
      if (both) {
        firstInViewport = {
          rows: calculateFirstInViewport(scrollTop, props.itemSize[0]),
          cols: calculateFirstInViewport(scrollLeft, props.itemSize[1])
        };
        lastInViewport = {
          rows: firstInViewport.rows + numItemsInViewportState.rows,
          cols: firstInViewport.cols + numItemsInViewportState.cols
        };
      } else {
        var scrollPos = horizontal ? scrollLeft : scrollTop;
        firstInViewport = calculateFirstInViewport(scrollPos, props.itemSize);
        lastInViewport = firstInViewport + numItemsInViewportState;
      }
    }
    return {
      first: firstState,
      last: lastState,
      viewport: {
        first: firstInViewport,
        last: lastInViewport
      }
    };
  };
  var calculateNumItems = function calculateNumItems() {
    var contentPos = getContentPosition();
    var contentWidth = elementRef.current ? elementRef.current.offsetWidth - contentPos.left : 0;
    var contentHeight = elementRef.current ? elementRef.current.offsetHeight - contentPos.top : 0;
    var calculateNumItemsInViewport = function calculateNumItemsInViewport(_contentSize, _itemSize) {
      return Math.ceil(_contentSize / (_itemSize || _contentSize));
    };
    var calculateNumToleratedItems = function calculateNumToleratedItems(_numItems) {
      return Math.ceil(_numItems / 2);
    };
    var numItemsInViewport = both ? {
      rows: calculateNumItemsInViewport(contentHeight, props.itemSize[0]),
      cols: calculateNumItemsInViewport(contentWidth, props.itemSize[1])
    } : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, props.itemSize);
    var numToleratedItems = numToleratedItemsState || (both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
    return {
      numItemsInViewport: numItemsInViewport,
      numToleratedItems: numToleratedItems
    };
  };
  var calculateOptions = function calculateOptions() {
    var _calculateNumItems2 = calculateNumItems(),
      numItemsInViewport = _calculateNumItems2.numItemsInViewport,
      numToleratedItems = _calculateNumItems2.numToleratedItems;
    var calculateLast = function calculateLast(_first, _num, _numT) {
      var _isCols = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
    };
    var last = both ? {
      rows: calculateLast(firstState.rows, numItemsInViewport.rows, numToleratedItems[0]),
      cols: calculateLast(firstState.cols, numItemsInViewport.cols, numToleratedItems[1], true)
    } : calculateLast(firstState, numItemsInViewport, numToleratedItems);
    setNumItemsInViewportState(numItemsInViewport);
    setNumToleratedItemsState(numToleratedItems);
    setLastState(last);
    if (props.showLoader) {
      setLoaderArrState(both ? Array.from({
        length: numItemsInViewport.rows
      }).map(function () {
        return Array.from({
          length: numItemsInViewport.cols
        });
      }) : Array.from({
        length: numItemsInViewport
      }));
    }
    if (props.lazy) {
      Promise.resolve().then(function () {
        lazyLoadState.current = {
          first: props.step ? both ? {
            rows: 0,
            cols: firstState.cols
          } : 0 : firstState,
          last: Math.min(props.step ? props.step : last, (props.items || []).length)
        };
        props.onLazyLoad && props.onLazyLoad(lazyLoadState.current);
      });
    }
  };
  var calculateAutoSize = function calculateAutoSize(loading) {
    if (props.autoSize && !loading) {
      Promise.resolve().then(function () {
        if (_contentRef.current) {
          _contentRef.current.style.minHeight = _contentRef.current.style.minWidth = 'auto';
          _contentRef.current.style.position = 'relative';
          elementRef.current.style.contain = 'none';

          /*const [contentWidth, contentHeight] = [DomHandler.getWidth(contentRef.current), DomHandler.getHeight(contentRef.current)];
           contentWidth !== defaultContentWidth.current && (elementRef.current.style.width = '');
          contentHeight !== defaultContentHeight.current && (elementRef.current.style.height = '');*/

          var _ref = [DomHandler.getWidth(elementRef.current), DomHandler.getHeight(elementRef.current)],
            width = _ref[0],
            height = _ref[1];
          (both || horizontal) && (elementRef.current.style.width = (width < defaultWidth.current ? width : props.scrollWidth || defaultWidth.current) + 'px');
          (both || vertical) && (elementRef.current.style.height = (height < defaultHeight.current ? height : props.scrollHeight || defaultHeight.current) + 'px');
          _contentRef.current.style.minHeight = _contentRef.current.style.minWidth = '';
          _contentRef.current.style.position = '';
          elementRef.current.style.contain = '';
        }
      });
    }
  };
  var getLast = function getLast() {
    var _ref2;
    var last = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var isCols = arguments.length > 1 ? arguments[1] : undefined;
    return props.items ? Math.min(isCols ? ((_ref2 = props.columns || props.items[0]) === null || _ref2 === void 0 ? void 0 : _ref2.length) || 0 : (props.items || []).length, last) : 0;
  };
  var getContentPosition = function getContentPosition() {
    if (_contentRef.current) {
      var style = getComputedStyle(_contentRef.current);
      var left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
      var right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
      var top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
      var bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
      return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        x: left + right,
        y: top + bottom
      };
    }
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      x: 0,
      y: 0
    };
  };
  var setSize = function setSize() {
    if (elementRef.current) {
      var parentElement = elementRef.current.parentElement;
      var width = props.scrollWidth || "".concat(elementRef.current.offsetWidth || parentElement.offsetWidth, "px");
      var height = props.scrollHeight || "".concat(elementRef.current.offsetHeight || parentElement.offsetHeight, "px");
      var setProp = function setProp(_name, _value) {
        return elementRef.current.style[_name] = _value;
      };
      if (both || horizontal) {
        setProp('height', height);
        setProp('width', width);
      } else {
        setProp('height', height);
      }
    }
  };
  var setSpacerSize = function setSpacerSize() {
    var items = props.items;
    if (items) {
      var contentPos = getContentPosition();
      var setProp = function setProp(_name, _value, _size) {
        var _cpos = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        return spacerStyle.current = _objectSpread$3(_objectSpread$3({}, spacerStyle.current), _defineProperty$1({}, "".concat(_name), (_value || []).length * _size + _cpos + 'px'));
      };
      if (both) {
        setProp('height', items, props.itemSize[0], contentPos.y);
        setProp('width', props.columns || items[1], props.itemSize[1], contentPos.x);
      } else {
        horizontal ? setProp('width', props.columns || items, props.itemSize, contentPos.x) : setProp('height', items, props.itemSize, contentPos.y);
      }
    }
  };
  var setContentPosition = function setContentPosition(pos) {
    if (_contentRef.current && !props.appendOnly) {
      var first = pos ? pos.first : firstState;
      var calculateTranslateVal = function calculateTranslateVal(_first, _size) {
        return _first * _size;
      };
      var setTransform = function setTransform() {
        var _x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var _y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        _stickyRef.current && (_stickyRef.current.style.top = "-".concat(_y, "px"));
        contentStyle.current = _objectSpread$3(_objectSpread$3({}, contentStyle.current), {
          transform: "translate3d(".concat(_x, "px, ").concat(_y, "px, 0)")
        });
      };
      if (both) {
        setTransform(calculateTranslateVal(first.cols, props.itemSize[1]), calculateTranslateVal(first.rows, props.itemSize[0]));
      } else {
        var translateVal = calculateTranslateVal(first, props.itemSize);
        horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
      }
    }
  };
  var onScrollPositionChange = function onScrollPositionChange(event) {
    var target = event.target;
    var contentPos = getContentPosition();
    var calculateScrollPos = function calculateScrollPos(_pos, _cpos) {
      return _pos ? _pos > _cpos ? _pos - _cpos : _pos : 0;
    };
    var calculateCurrentIndex = function calculateCurrentIndex(_pos, _size) {
      return Math.floor(_pos / (_size || _pos));
    };
    var calculateTriggerIndex = function calculateTriggerIndex(_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
      return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
    };
    var calculateFirst = function calculateFirst(_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) {
      if (_currentIndex <= _numT) {
        return 0;
      }
      return Math.max(0, _isScrollDownOrRight ? _currentIndex < _triggerIndex ? _first : _currentIndex - _numT : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
    };
    var calculateLast = function calculateLast(_currentIndex, _first, _last, _num, _numT, _isCols) {
      var lastValue = _first + _num + 2 * _numT;
      if (_currentIndex >= _numT) {
        lastValue = lastValue + (_numT + 1);
      }
      return getLast(lastValue, _isCols);
    };
    var scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
    var scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
    var newFirst = both ? {
      rows: 0,
      cols: 0
    } : 0;
    var newLast = lastState;
    var isRangeChanged = false;
    var newScrollPos = lastScrollPos.current;
    if (both) {
      var isScrollDown = lastScrollPos.current.top <= scrollTop;
      var isScrollRight = lastScrollPos.current.left <= scrollLeft;
      if (!props.appendOnly || props.appendOnly && (isScrollDown || isScrollRight)) {
        var currentIndex = {
          rows: calculateCurrentIndex(scrollTop, props.itemSize[0]),
          cols: calculateCurrentIndex(scrollLeft, props.itemSize[1])
        };
        var triggerIndex = {
          rows: calculateTriggerIndex(currentIndex.rows, firstState.rows, lastState.rows, numItemsInViewportState.rows, numToleratedItemsState[0], isScrollDown),
          cols: calculateTriggerIndex(currentIndex.cols, firstState.cols, lastState.cols, numItemsInViewportState.cols, numToleratedItemsState[1], isScrollRight)
        };
        newFirst = {
          rows: calculateFirst(currentIndex.rows, triggerIndex.rows, firstState.rows, lastState.rows, numItemsInViewportState.rows, numToleratedItemsState[0], isScrollDown),
          cols: calculateFirst(currentIndex.cols, triggerIndex.cols, firstState.cols, lastState.cols, numItemsInViewportState.cols, numToleratedItemsState[1], isScrollRight)
        };
        newLast = {
          rows: calculateLast(currentIndex.rows, newFirst.rows, lastState.rows, numItemsInViewportState.rows, numToleratedItemsState[0]),
          cols: calculateLast(currentIndex.cols, newFirst.cols, lastState.cols, numItemsInViewportState.cols, numToleratedItemsState[1], true)
        };
        isRangeChanged = newFirst.rows !== firstState.rows || newLast.rows !== lastState.rows || newFirst.cols !== firstState.cols || newLast.cols !== lastState.cols || isItemRangeChanged.current;
        newScrollPos = {
          top: scrollTop,
          left: scrollLeft
        };
      }
    } else {
      var scrollPos = horizontal ? scrollLeft : scrollTop;
      var isScrollDownOrRight = lastScrollPos.current <= scrollPos;
      if (!props.appendOnly || props.appendOnly && isScrollDownOrRight) {
        var _currentIndex2 = calculateCurrentIndex(scrollPos, props.itemSize);
        var _triggerIndex2 = calculateTriggerIndex(_currentIndex2, firstState, lastState, numItemsInViewportState, numToleratedItemsState, isScrollDownOrRight);
        newFirst = calculateFirst(_currentIndex2, _triggerIndex2, firstState, lastState, numItemsInViewportState, numToleratedItemsState, isScrollDownOrRight);
        newLast = calculateLast(_currentIndex2, newFirst, lastState, numItemsInViewportState, numToleratedItemsState);
        isRangeChanged = newFirst !== firstState || newLast !== lastState || isItemRangeChanged.current;
        newScrollPos = scrollPos;
      }
    }
    return {
      first: newFirst,
      last: newLast,
      isRangeChanged: isRangeChanged,
      scrollPos: newScrollPos
    };
  };
  var onScrollChange = function onScrollChange(event) {
    var _onScrollPositionChan = onScrollPositionChange(event),
      first = _onScrollPositionChan.first,
      last = _onScrollPositionChan.last,
      isRangeChanged = _onScrollPositionChan.isRangeChanged,
      scrollPos = _onScrollPositionChan.scrollPos;
    if (isRangeChanged) {
      var newState = {
        first: first,
        last: last
      };
      setContentPosition(newState);
      setFirstState(first);
      setLastState(last);
      lastScrollPos.current = scrollPos;
      props.onScrollIndexChange && props.onScrollIndexChange(newState);
      if (props.lazy && isPageChanged(first)) {
        var newLazyLoadState = {
          first: props.step ? Math.min(getPageByFirst(first) * props.step, (props.items || []).length - props.step) : first,
          last: Math.min(props.step ? (getPageByFirst(first) + 1) * props.step : last, (props.items || []).length)
        };
        var isLazyStateChanged = !lazyLoadState.current || lazyLoadState.current.first !== newLazyLoadState.first || lazyLoadState.current.last !== newLazyLoadState.last;
        isLazyStateChanged && props.onLazyLoad && props.onLazyLoad(newLazyLoadState);
        lazyLoadState.current = newLazyLoadState;
      }
    }
  };
  var _onScroll = function onScroll(event) {
    props.onScroll && props.onScroll(event);
    if (props.delay) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (isPageChanged(firstState)) {
        if (!loadingState && props.showLoader) {
          var _onScrollPositionChan2 = onScrollPositionChange(event),
            isRangeChanged = _onScrollPositionChan2.isRangeChanged;
          var changed = isRangeChanged || (props.step ? isPageChanged(firstState) : false);
          changed && setLoadingState(true);
        }
        scrollTimeout.current = setTimeout(function () {
          onScrollChange(event);
          if (loadingState && props.showLoader && (!props.lazy || props.loading === undefined)) {
            setLoadingState(false);
            setPageState(getPageByFirst(firstState));
          }
        }, props.delay);
      }
    } else {
      onScrollChange(event);
    }
  };
  var onResize = function onResize() {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }
    resizeTimeout.current = setTimeout(function () {
      if (elementRef.current) {
        var _ref3 = [DomHandler.getWidth(elementRef.current), DomHandler.getHeight(elementRef.current)],
          width = _ref3[0],
          height = _ref3[1];
        var isDiffWidth = width !== defaultWidth.current,
          isDiffHeight = height !== defaultHeight.current;
        var reinit = both ? isDiffWidth || isDiffHeight : horizontal ? isDiffWidth : vertical ? isDiffHeight : false;
        if (reinit) {
          setNumToleratedItemsState(props.numToleratedItems);
          defaultWidth.current = width;
          defaultHeight.current = height;
          defaultContentWidth.current = DomHandler.getWidth(_contentRef.current);
          defaultContentHeight.current = DomHandler.getHeight(_contentRef.current);
        }
      }
    }, props.resizeDelay);
  };
  var getOptions = function getOptions(renderedIndex) {
    var count = (props.items || []).length;
    var index = both ? firstState.rows + renderedIndex : firstState + renderedIndex;
    return {
      index: index,
      count: count,
      first: index === 0,
      last: index === count - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
      props: props
    };
  };
  var loaderOptions = function loaderOptions(index, extOptions) {
    var count = loaderArrState.length || 0;
    return _objectSpread$3({
      index: index,
      count: count,
      first: index === 0,
      last: index === count - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
      props: props
    }, extOptions);
  };
  var loadedItems = function loadedItems() {
    var items = props.items;
    if (items && !loadingState) {
      if (both) {
        return items.slice(props.appendOnly ? 0 : firstState.rows, lastState.rows).map(function (item) {
          return props.columns ? item : item.slice(props.appendOnly ? 0 : firstState.cols, lastState.cols);
        });
      } else if (horizontal && props.columns) {
        return items;
      }
      return items.slice(props.appendOnly ? 0 : firstState, lastState);
    }
    return [];
  };
  var viewInit = function viewInit() {
    if (elementRef.current && DomHandler.isVisible(elementRef.current)) {
      setContentElement(_contentRef.current);
      init();
      bindWindowResizeListener();
      bindOrientationChangeListener();
      defaultWidth.current = DomHandler.getWidth(elementRef.current);
      defaultHeight.current = DomHandler.getHeight(elementRef.current);
      defaultContentWidth.current = DomHandler.getWidth(_contentRef.current);
      defaultContentHeight.current = DomHandler.getHeight(_contentRef.current);
    }
  };
  var init = function init() {
    if (!props.disabled && DomHandler.isVisible(elementRef.current)) {
      setSize();
      calculateOptions();
      setSpacerSize();
    }
  };
  var isVisible = function isVisible() {
    if (DomHandler.isVisible(elementRef.current)) {
      var rect = elementRef.current.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
    return false;
  };
  React.useEffect(function () {
    if (!viewInitialized.current && isVisible()) {
      viewInit();
      viewInitialized.current = true;
    }
  });
  useUpdateEffect$1(function () {
    init();
  }, [props.itemSize, props.scrollHeight, props.scrollWidth]);
  useUpdateEffect$1(function () {
    if (props.numToleratedItems !== numToleratedItemsState) {
      setNumToleratedItemsState(props.numToleratedItems);
    }
  }, [props.numToleratedItems]);
  useUpdateEffect$1(function () {
    if (props.numToleratedItems === numToleratedItemsState) {
      init(); // reinit after resizing
    }
  }, [numToleratedItemsState]);
  useUpdateEffect$1(function () {
    // Check if the previous/current rows array exists
    var prevRowsExist = prevProps.items !== undefined && prevProps.items !== null;
    var currentRowsExist = props.items !== undefined && props.items !== null;

    // Get the length of the previous/current rows array, or 0 if it doesn't exist
    var prevRowsLength = prevRowsExist ? prevProps.items.length : 0;
    var currentRowsLength = currentRowsExist ? props.items.length : 0;

    // Check if the length of the rows arrays has changed
    var valuesChanged = prevRowsLength !== currentRowsLength;

    // If both is true, we also need to check the lengths of the first element (assuming it's a matrix)
    if (both && !valuesChanged) {
      // Get the length of the columns or 0
      var prevColumnsLength = prevRowsExist && prevProps.items.length > 0 ? prevProps.items[0].length : 0;
      var currentColumnsLength = currentRowsExist && props.items.length > 0 ? props.items[0].length : 0;

      // Check if the length of the columns has changed
      valuesChanged = prevColumnsLength !== currentColumnsLength;
    }

    // If the previous items array doesn't exist or if any values have changed, call the init function
    if (!prevRowsExist || valuesChanged) {
      init();
    }
    var loading = loadingState;
    if (props.lazy && prevProps.loading !== props.loading && props.loading !== loadingState) {
      setLoadingState(props.loading);
      loading = props.loading;
    }
    calculateAutoSize(loading);
  });
  useUpdateEffect$1(function () {
    lastScrollPos.current = both ? {
      top: 0,
      left: 0
    } : 0;
  }, [props.orientation]);
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      getElementRef: getElementRef,
      scrollTo: scrollTo,
      scrollToIndex: scrollToIndex,
      scrollInView: scrollInView,
      getRenderedRange: getRenderedRange
    };
  });
  var createLoaderItem = function createLoaderItem(index) {
    var extOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = loaderOptions(index, extOptions);
    var content = ObjectUtils.getJSXElement(props.loadingTemplate, options);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, content);
  };
  var createLoader = function createLoader() {
    var iconClassName = 'p-virtualscroller-loading-icon';
    var loadingIconProps = mergeProps({
      className: iconClassName
    }, ptm('loadingIcon'));
    var icon = props.loadingIcon || /*#__PURE__*/React.createElement(SpinnerIcon, _extends$2({}, loadingIconProps, {
      spin: true
    }));
    var loadingIcon = IconUtils.getJSXIcon(icon, _objectSpread$3({}, loadingIconProps), {
      props: props
    });
    if (!props.loaderDisabled && props.showLoader && loadingState) {
      var _className = classNames('p-virtualscroller-loader', {
        'p-component-overlay': !props.loadingTemplate
      });
      var _content = loadingIcon;
      if (props.loadingTemplate) {
        _content = loaderArrState.map(function (_, index) {
          return createLoaderItem(index, both && {
            numCols: numItemsInViewportState.cols
          });
        });
      } else if (props.loaderIconTemplate) {
        var defaultContentOptions = {
          iconClassName: iconClassName,
          element: _content,
          props: props
        };
        _content = ObjectUtils.getJSXElement(props.loaderIconTemplate, defaultContentOptions);
      }
      var loaderProps = mergeProps({
        className: _className
      }, ptm('loader'));
      return /*#__PURE__*/React.createElement("div", loaderProps, _content);
    }
    return null;
  };
  var createSpacer = function createSpacer() {
    if (props.showSpacer) {
      var spacerProps = mergeProps({
        ref: _spacerRef,
        style: spacerStyle.current,
        className: 'p-virtualscroller-spacer'
      }, ptm('spacer'));
      return /*#__PURE__*/React.createElement("div", spacerProps);
    }
    return null;
  };
  var createItem = function createItem(item, index) {
    var options = getOptions(index);
    var content = ObjectUtils.getJSXElement(props.itemTemplate, item, options);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: options.index
    }, content);
  };
  var createItems = function createItems() {
    var items = loadedItems();
    return items.map(createItem);
  };
  var createContent = function createContent() {
    var items = createItems();
    var className = classNames('p-virtualscroller-content', {
      'p-virtualscroller-loading': loadingState
    });
    var contentProps = mergeProps({
      ref: _contentRef,
      style: contentStyle.current,
      className: className
    }, ptm('content'));
    var content = /*#__PURE__*/React.createElement("div", contentProps, items);
    if (props.contentTemplate) {
      var defaultOptions = {
        style: contentStyle.current,
        className: className,
        spacerStyle: spacerStyle.current,
        contentRef: function contentRef(el) {
          return _contentRef.current = ObjectUtils.getRefElement(el);
        },
        spacerRef: function spacerRef(el) {
          return _spacerRef.current = ObjectUtils.getRefElement(el);
        },
        stickyRef: function stickyRef(el) {
          return _stickyRef.current = ObjectUtils.getRefElement(el);
        },
        items: loadedItems(),
        getItemOptions: function getItemOptions(index) {
          return getOptions(index);
        },
        children: items,
        element: content,
        props: props,
        loading: loadingState,
        getLoaderOptions: function getLoaderOptions(index, ext) {
          return loaderOptions(index, ext);
        },
        loadingTemplate: props.loadingTemplate,
        itemSize: props.itemSize,
        rows: getRows(),
        columns: getColumns(),
        vertical: vertical,
        horizontal: horizontal,
        both: both
      };
      return ObjectUtils.getJSXElement(props.contentTemplate, defaultOptions);
    }
    return content;
  };
  if (props.disabled) {
    var _content2 = ObjectUtils.getJSXElement(props.contentTemplate, {
      items: props.items,
      rows: props.items,
      columns: props.columns
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, props.children, _content2);
  }
  var className = classNames('p-virtualscroller', {
    'p-virtualscroller-inline': props.inline,
    'p-virtualscroller-both p-both-scroll': both,
    'p-virtualscroller-horizontal p-horizontal-scroll': horizontal
  }, props.className);
  var loader = createLoader();
  var content = createContent();
  var spacer = createSpacer();
  var rootProps = mergeProps({
    ref: elementRef,
    className: className,
    tabIndex: props.tabIndex,
    style: props.style,
    onScroll: function onScroll(e) {
      return _onScroll(e);
    }
  }, VirtualScrollerBase.getOtherProps(props), ptm('root'));
  return /*#__PURE__*/React.createElement("div", rootProps, content, spacer, loader);
}));
VirtualScroller.displayName = 'VirtualScroller';

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}

var CheckIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }));
}));
CheckIcon.displayName = 'CheckIcon';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}

function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var classes = {
  root: function root(_ref) {
    var props = _ref.props,
      focusedState = _ref.focusedState,
      overlayVisibleState = _ref.overlayVisibleState,
      context = _ref.context;
    return classNames('p-dropdown p-component p-inputwrapper', {
      'p-disabled': props.disabled,
      'p-invalid': props.invalid,
      'p-focus': focusedState,
      'p-variant-filled': props.variant ? props.variant === 'filled' : context && context.inputStyle === 'filled',
      'p-dropdown-clearable': props.showClear && !props.disabled,
      'p-inputwrapper-filled': props.value !== undefined,
      'p-inputwrapper-focus': focusedState || overlayVisibleState
    });
  },
  input: function input(_ref2) {
    var props = _ref2.props,
      label = _ref2.label;
    return props.editable ? 'p-dropdown-label p-inputtext' : classNames('p-dropdown-label p-inputtext', {
      'p-placeholder': label === null && props.placeholder,
      'p-dropdown-label-empty': label === null && !props.placeholder
    });
  },
  trigger: 'p-dropdown-trigger',
  emptyMessage: 'p-dropdown-empty-message',
  itemGroup: function itemGroup(_ref3) {
    var optionGroupLabel = _ref3.optionGroupLabel;
    return classNames('p-dropdown-item-group', {
      'p-dropdown-item-empty': !optionGroupLabel || optionGroupLabel.length === 0
    });
  },
  itemGroupLabel: 'p-dropdown-item-group-label',
  dropdownIcon: 'p-dropdown-trigger-icon p-clickable',
  loadingIcon: 'p-dropdown-trigger-icon p-clickable',
  clearIcon: 'p-dropdown-clear-icon p-clickable',
  filterIcon: 'p-dropdown-filter-icon',
  filterClearIcon: 'p-dropdown-filter-clear-icon',
  filterContainer: function filterContainer(_ref4) {
    var clearIcon = _ref4.clearIcon;
    return classNames('p-dropdown-filter-container', {
      'p-dropdown-clearable-filter': !!clearIcon
    });
  },
  filterInput: function filterInput(_ref5) {
    var props = _ref5.props,
      context = _ref5.context;
    return classNames('p-dropdown-filter p-inputtext p-component', {
      'p-variant-filled': props.variant ? props.variant === 'filled' : context && context.inputStyle === 'filled'
    });
  },
  list: function list(_ref6) {
    var virtualScrollerOptions = _ref6.virtualScrollerOptions;
    return virtualScrollerOptions ? 'p-dropdown-items' : 'p-dropdown-items';
  },
  panel: function panel(_ref7) {
    var context = _ref7.context;
    return classNames('p-dropdown-panel p-component', {
      'p-input-filled': context && context.inputStyle === 'filled' || PrimeReact.inputStyle === 'filled',
      'p-ripple-disabled': context && context.ripple === false || PrimeReact.ripple === false
    });
  },
  item: function item(_ref8) {
    var selected = _ref8.selected,
      disabled = _ref8.disabled,
      label = _ref8.label,
      index = _ref8.index,
      focusedOptionIndex = _ref8.focusedOptionIndex,
      highlightOnSelect = _ref8.highlightOnSelect;
    return classNames('p-dropdown-item', {
      'p-highlight': selected && highlightOnSelect,
      'p-disabled': disabled,
      'p-focus': index === focusedOptionIndex,
      'p-dropdown-item-empty': !label || label.length === 0
    });
  },
  itemLabel: 'p-dropdown-item-label',
  checkIcon: 'p-dropdown-check-icon',
  blankIcon: 'p-dropdown-blank-icon',
  wrapper: 'p-dropdown-items-wrapper',
  header: 'p-dropdown-header',
  footer: 'p-dropdown-footer',
  transition: 'p-connected-overlay'
};
var styles = "\n@layer primereact {\n    .p-dropdown {\n        display: inline-flex;\n        cursor: pointer;\n        position: relative;\n        user-select: none;\n    }\n    \n    .p-dropdown-trigger {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        flex-shrink: 0;\n    }\n    \n    .p-dropdown-label {\n        display: block;\n        white-space: nowrap;\n        overflow: hidden;\n        flex: 1 1 auto;\n        width: 1%;\n        text-overflow: ellipsis;\n        cursor: pointer;\n    }\n    \n    .p-dropdown-label-empty {\n        overflow: hidden;\n        visibility: hidden;\n    }\n    \n    input.p-dropdown-label  {\n        cursor: default;\n    }\n    \n    .p-dropdown .p-dropdown-panel {\n        min-width: 100%;\n    }\n    \n    .p-dropdown-panel {\n        position: absolute;\n        top: 0;\n        left: 0;\n    }\n    \n    .p-dropdown-items-wrapper {\n        overflow: auto;\n    }\n    \n    .p-dropdown-item {\n        cursor: pointer;\n        font-weight: normal;\n        white-space: nowrap;\n        position: relative;\n        overflow: hidden;\n    }\n    \n    .p-dropdown-items {\n        margin: 0;\n        padding: 0;\n        list-style-type: none;\n    }\n    \n    .p-dropdown-filter {\n        width: 100%;\n    }\n    \n    .p-dropdown-filter-container {\n        position: relative;\n    }\n    \n    .p-dropdown-clear-icon,\n    .p-dropdown-filter-icon,\n    .p-dropdown-filter-clear-icon {\n        position: absolute;\n        top: 50%;\n        margin-top: -.5rem;\n        right: 2rem;\n    }\n    \n    .p-fluid .p-dropdown {\n        display: flex;\n    }\n    \n    .p-fluid .p-dropdown .p-dropdown-label {\n        width: 1%;\n    }\n}\n";
var inlineStyles = {
  wrapper: function wrapper(_ref9) {
    var props = _ref9.props;
    return {
      maxHeight: props.scrollHeight || 'auto'
    };
  },
  panel: function panel(_ref10) {
    var props = _ref10.props;
    return _objectSpread$2({}, props.panelStyle);
  }
};
var DropdownBase = ComponentBase.extend({
  defaultProps: {
    __TYPE: 'Dropdown',
    __parentMetadata: null,
    appendTo: null,
    ariaLabel: null,
    ariaLabelledBy: null,
    autoFocus: false,
    autoOptionFocus: false,
    checkmark: false,
    children: undefined,
    className: null,
    clearIcon: null,
    collapseIcon: null,
    dataKey: null,
    disabled: false,
    dropdownIcon: null,
    editable: false,
    emptyFilterMessage: null,
    emptyMessage: null,
    filter: false,
    filterBy: null,
    filterClearIcon: null,
    filterDelay: 300,
    filterIcon: null,
    filterInputAutoFocus: false,
    filterLocale: undefined,
    filterMatchMode: 'contains',
    filterPlaceholder: null,
    filterTemplate: null,
    focusInputRef: null,
    focusOnHover: true,
    highlightOnSelect: true,
    id: null,
    inputId: null,
    inputRef: null,
    invalid: false,
    itemTemplate: null,
    loading: false,
    loadingIcon: null,
    maxLength: null,
    name: null,
    onBlur: null,
    onChange: null,
    onContextMenu: null,
    onFilter: null,
    onFocus: null,
    onHide: null,
    onMouseDown: null,
    onShow: null,
    optionDisabled: null,
    optionGroupChildren: 'items',
    optionGroupLabel: null,
    optionGroupTemplate: null,
    optionLabel: null,
    options: null,
    optionValue: null,
    panelClassName: null,
    panelFooterTemplate: null,
    panelStyle: null,
    placeholder: null,
    required: false,
    resetFilterOnHide: false,
    scrollHeight: '200px',
    selectOnFocus: false,
    showClear: false,
    showFilterClear: false,
    showOnFocus: false,
    style: null,
    tabIndex: null,
    tooltip: null,
    tooltipOptions: null,
    transitionOptions: null,
    useOptionAsValue: false,
    value: null,
    valueTemplate: null,
    variant: null,
    virtualScrollerOptions: null
  },
  css: {
    classes: classes,
    styles: styles,
    inlineStyles: inlineStyles
  }
});

var BlankIcon = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var pti = IconBase.getPTI(inProps);
  return /*#__PURE__*/React.createElement("svg", _extends({
    ref: ref,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, pti), /*#__PURE__*/React.createElement("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    fillOpacity: "0"
  }));
}));
BlankIcon.displayName = 'BlankIcon';

var DropdownItem = /*#__PURE__*/React.memo(function (props) {
  var mergeProps = useMergeProps();
  var ptm = props.ptm,
    cx = props.cx,
    selected = props.selected,
    disabled = props.disabled,
    option = props.option,
    label = props.label,
    index = props.index,
    focusedOptionIndex = props.focusedOptionIndex,
    ariaSetSize = props.ariaSetSize,
    checkmark = props.checkmark,
    highlightOnSelect = props.highlightOnSelect,
    onInputKeyDown = props.onInputKeyDown;
  var getPTOptions = function getPTOptions(key) {
    return ptm(key, {
      context: {
        selected: selected,
        disabled: disabled,
        focused: index === focusedOptionIndex
      }
    });
  };
  var _onClick = function onClick(event, i) {
    if (props.onClick) {
      props.onClick({
        originalEvent: event,
        option: option
      });
    }
  };
  var content = props.template ? ObjectUtils.getJSXElement(props.template, props.option) : props.label;
  var itemProps = mergeProps({
    id: "dropdownItem_".concat(index),
    role: 'option',
    className: classNames(option.className, cx('item', {
      selected: selected,
      disabled: disabled,
      label: label,
      index: index,
      focusedOptionIndex: focusedOptionIndex,
      highlightOnSelect: highlightOnSelect
    })),
    style: props.style,
    tabIndex: 0,
    onClick: function onClick(e) {
      return _onClick(e);
    },
    onKeyDown: function onKeyDown(e) {
      return onInputKeyDown(e);
    },
    onMouseMove: function onMouseMove(e) {
      return props === null || props === void 0 ? void 0 : props.onMouseMove(e, index);
    },
    'aria-setsize': ariaSetSize,
    'aria-posinset': index + 1,
    'aria-label': label,
    'aria-selected': selected,
    'data-p-highlight': selected,
    'data-p-focused': focusedOptionIndex === index,
    'data-p-disabled': disabled
  }, getPTOptions('item'));
  var itemGroupLabelProps = mergeProps({
    className: cx('itemLabel')
  }, getPTOptions('itemLabel'));
  var iconRenderer = function iconRenderer() {
    if (selected) {
      var checkIconProps = mergeProps({
        className: cx('checkIcon')
      }, getPTOptions('checkIcon'));
      return /*#__PURE__*/React.createElement(CheckIcon, checkIconProps);
    }
    var blankIconProps = mergeProps({
      className: cx('blankIcon')
    }, getPTOptions('blankIcon'));
    return /*#__PURE__*/React.createElement(BlankIcon, blankIconProps);
  };
  return /*#__PURE__*/React.createElement("li", _extends({
    key: props.label
  }, itemProps), checkmark && iconRenderer(), /*#__PURE__*/React.createElement("span", itemGroupLabelProps, content), /*#__PURE__*/React.createElement(Ripple, null));
});
DropdownItem.displayName = 'DropdownItem';

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var DropdownPanel = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (props, ref) {
  var mergeProps = useMergeProps();
  var ptm = props.ptm,
    cx = props.cx,
    sx = props.sx;
  var context = React.useContext(PrimeReactContext);
  var filterInputRef = React.useRef(null);
  var isEmptyFilter = !(props.visibleOptions && props.visibleOptions.length) && props.hasFilter;
  var ariaSetSize = props.visibleOptions ? props.visibleOptions.length : 0;
  var filterOptions = {
    filter: function filter(e) {
      return onFilterInputChange(e);
    },
    reset: function reset() {
      return props.resetFilter();
    }
  };
  var getPTOptions = function getPTOptions(key, options) {
    return ptm(key, _objectSpread$1({
      hostName: props.hostName
    }, options));
  };
  var onEnter = function onEnter() {
    props.onEnter(function () {
      if (props.virtualScrollerRef.current) {
        var selectedIndex = props.getSelectedOptionIndex();
        if (selectedIndex !== -1) {
          setTimeout(function () {
            return props.virtualScrollerRef.current.scrollToIndex(selectedIndex);
          }, 0);
        }
      }
    });
  };
  var onEntered = function onEntered() {
    props.onEntered(function () {
      if (props.filter && props.filterInputAutoFocus) {
        DomHandler.focus(filterInputRef.current, false);
      }
    });
  };
  var onFilterInputChange = function onFilterInputChange(event) {
    props.onFilterInputChange && props.onFilterInputChange(event);
  };
  var createFooter = function createFooter() {
    if (props.panelFooterTemplate) {
      var content = ObjectUtils.getJSXElement(props.panelFooterTemplate, props, props.onOverlayHide);
      var footerProps = mergeProps({
        className: cx('footer')
      }, getPTOptions('footer'));
      return /*#__PURE__*/React.createElement("div", footerProps, content);
    }
    return null;
  };
  var changeFocusedItemOnHover = function changeFocusedItemOnHover(event, index) {
    if (props.focusOnHover) {
      var _props$changeFocusedO;
      props === null || props === void 0 || (_props$changeFocusedO = props.changeFocusedOptionIndex) === null || _props$changeFocusedO === void 0 || _props$changeFocusedO.call(props, event, index);
    }
  };
  var createEmptyMessage = function createEmptyMessage(emptyMessage, isFilter) {
    var message = ObjectUtils.getJSXElement(emptyMessage, props) || localeOption(isFilter ? 'emptyFilterMessage' : 'emptyMessage');
    var emptyMessageProps = mergeProps({
      className: cx('emptyMessage')
    }, getPTOptions('emptyMessage'));
    return /*#__PURE__*/React.createElement("li", emptyMessageProps, message);
  };
  var createItem = function createItem(option, index) {
    var scrollerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var style = {
      height: scrollerOptions.props ? scrollerOptions.props.itemSize : undefined
    };
    style = _objectSpread$1(_objectSpread$1({}, style), option.style);
    if (option.group && props.optionGroupLabel) {
      var optionGroupLabel = props.optionGroupLabel;
      var groupContent = props.optionGroupTemplate ? ObjectUtils.getJSXElement(props.optionGroupTemplate, option, index) : props.getOptionGroupLabel(option);
      var key = index + '_' + props.getOptionGroupRenderKey(option);
      var itemGroupProps = mergeProps({
        className: cx('itemGroup', {
          optionGroupLabel: optionGroupLabel
        }),
        style: style,
        'data-p-highlight': props.selected
      }, getPTOptions('itemGroup'));
      var itemGroupLabelProps = mergeProps({
        className: cx('itemGroupLabel')
      }, getPTOptions('itemGroupLabel'));
      return /*#__PURE__*/React.createElement("li", _extends({
        key: key
      }, itemGroupProps), /*#__PURE__*/React.createElement("span", itemGroupLabelProps, groupContent));
    }
    var optionKey = props.getOptionRenderKey(option) + '_' + index;
    var optionLabel = props.getOptionLabel(option);
    var disabled = props.isOptionDisabled(option);
    return /*#__PURE__*/React.createElement(DropdownItem, {
      key: optionKey,
      label: optionLabel,
      index: index,
      focusedOptionIndex: props.focusedOptionIndex,
      option: option,
      ariaSetSize: ariaSetSize,
      onInputKeyDown: props.onInputKeyDown,
      style: style,
      template: props.itemTemplate,
      selected: props.isSelected(option),
      highlightOnSelect: props.highlightOnSelect,
      disabled: disabled,
      onClick: props.onOptionClick,
      onMouseMove: changeFocusedItemOnHover,
      ptm: ptm,
      cx: cx,
      checkmark: props.checkmark
    });
  };
  var createItems = function createItems() {
    if (ObjectUtils.isNotEmpty(props.visibleOptions)) {
      return props.visibleOptions.map(createItem);
    } else if (props.hasFilter) {
      return createEmptyMessage(props.emptyFilterMessage, true);
    }
    return createEmptyMessage(props.emptyMessage);
  };
  var createFilterClearIcon = function createFilterClearIcon() {
    if (props.showFilterClear && props.filterValue) {
      var ariaLabel = localeOption('clear');
      var clearIconProps = mergeProps({
        className: cx('filterClearIcon'),
        'aria-label': ariaLabel,
        onClick: function onClick() {
          return props.onFilterClearIconClick(function () {
            return DomHandler.focus(filterInputRef.current);
          });
        }
      }, getPTOptions('filterClearIcon'));
      var icon = props.filterClearIcon || /*#__PURE__*/React.createElement(TimesIcon, clearIconProps);
      var filterClearIcon = IconUtils.getJSXIcon(icon, _objectSpread$1({}, clearIconProps), {
        props: props
      });
      return filterClearIcon;
    }
    return null;
  };
  var createFilter = function createFilter() {
    if (props.filter) {
      var clearIcon = createFilterClearIcon();
      var filterIconProps = mergeProps({
        className: cx('filterIcon')
      }, getPTOptions('filterIcon'));
      var icon = props.filterIcon || /*#__PURE__*/React.createElement(SearchIcon, filterIconProps);
      var filterIcon = IconUtils.getJSXIcon(icon, _objectSpread$1({}, filterIconProps), {
        props: props
      });
      var filterContainerProps = mergeProps({
        className: cx('filterContainer', {
          clearIcon: clearIcon
        })
      }, getPTOptions('filterContainer'));
      var filterInputProps = mergeProps({
        ref: filterInputRef,
        type: 'text',
        autoComplete: 'off',
        className: cx('filterInput', {
          context: context
        }),
        placeholder: props.filterPlaceholder,
        onKeyDown: props.onFilterInputKeyDown,
        onChange: function onChange(e) {
          return onFilterInputChange(e);
        },
        value: props.filterValue
      }, getPTOptions('filterInput'));
      var content = /*#__PURE__*/React.createElement("div", filterContainerProps, /*#__PURE__*/React.createElement("input", filterInputProps), clearIcon, filterIcon);
      if (props.filterTemplate) {
        var defaultContentOptions = {
          className: classNames('p-dropdown-filter-container', {
            'p-dropdown-clearable-filter': !!clearIcon
          }),
          element: content,
          filterOptions: filterOptions,
          filterInputKeyDown: props.onFilterInputKeyDown,
          filterInputChange: onFilterInputChange,
          filterIconClassName: 'p-dropdown-filter-icon',
          clearIcon: clearIcon,
          props: props
        };
        content = ObjectUtils.getJSXElement(props.filterTemplate, defaultContentOptions);
      }
      var headerProps = mergeProps({
        className: cx('header')
      }, getPTOptions('header'));
      return /*#__PURE__*/React.createElement("div", headerProps, content);
    }
    return null;
  };
  var createContent = function createContent() {
    if (props.virtualScrollerOptions) {
      var virtualScrollerProps = _objectSpread$1(_objectSpread$1({}, props.virtualScrollerOptions), {
        style: _objectSpread$1(_objectSpread$1({}, props.virtualScrollerOptions.style), {
          height: props.scrollHeight
        }),
        className: classNames('p-dropdown-items-wrapper', props.virtualScrollerOptions.className),
        items: props.visibleOptions,
        autoSize: true,
        onLazyLoad: function onLazyLoad(event) {
          return props.virtualScrollerOptions.onLazyLoad(_objectSpread$1(_objectSpread$1({}, event), {
            filter: props.filterValue
          }));
        },
        itemTemplate: function itemTemplate(item, options) {
          return item && createItem(item, options.index, options);
        },
        contentTemplate: function contentTemplate(options) {
          var emptyMessage = props.hasFilter ? props.emptyFilterMessage : props.emptyMessage;
          var content = isEmptyFilter ? createEmptyMessage(emptyMessage) : options.children;
          var listProps = mergeProps({
            ref: options.contentRef,
            style: options.style,
            className: classNames(options.className, cx('list', {
              virtualScrollerProps: props.virtualScrollerOptions
            })),
            role: 'listbox'
          }, getPTOptions('list'));
          return /*#__PURE__*/React.createElement("ul", listProps, content);
        }
      });
      return /*#__PURE__*/React.createElement(VirtualScroller, _extends({
        ref: props.virtualScrollerRef
      }, virtualScrollerProps, {
        pt: ptm('virtualScroller')
      }));
    }
    var items = createItems();
    var wrapperProps = mergeProps({
      className: cx('wrapper'),
      style: sx('wrapper')
    }, getPTOptions('wrapper'));
    var listProps = mergeProps({
      className: cx('list'),
      role: 'listbox'
    }, getPTOptions('list'));
    return /*#__PURE__*/React.createElement("div", wrapperProps, /*#__PURE__*/React.createElement("ul", listProps, items));
  };
  var createElement = function createElement() {
    var filter = createFilter();
    var content = createContent();
    var footer = createFooter();
    var panelProps = mergeProps({
      className: classNames(props.panelClassName, cx('panel', {
        context: context
      })),
      style: sx('panel'),
      onClick: props.onClick
    }, getPTOptions('panel'));
    var transitionProps = mergeProps({
      classNames: cx('transition'),
      "in": props["in"],
      timeout: {
        enter: 120,
        exit: 100
      },
      options: props.transitionOptions,
      unmountOnExit: true,
      onEnter: onEnter,
      onEntered: onEntered,
      onExit: props.onExit,
      onExited: props.onExited
    }, getPTOptions('transition'));
    return /*#__PURE__*/React.createElement(CSSTransition, _extends({
      nodeRef: ref
    }, transitionProps), /*#__PURE__*/React.createElement("div", _extends({
      ref: ref
    }, panelProps), props.firstFocusableElement, filter, content, footer, props.lastFocusableElement));
  };
  var element = createElement();
  return /*#__PURE__*/React.createElement(Portal, {
    element: element,
    appendTo: props.appendTo
  });
}));
DropdownPanel.displayName = 'DropdownPanel';

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var Dropdown = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (inProps, ref) {
  var mergeProps = useMergeProps();
  var context = React.useContext(PrimeReactContext);
  var props = DropdownBase.getProps(inProps, context);
  var _useDebounce = useDebounce('', props.filterDelay || 0),
    _useDebounce2 = _slicedToArray(_useDebounce, 3),
    filterValue = _useDebounce2[0],
    filterState = _useDebounce2[1],
    setFilterState = _useDebounce2[2];
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    focusedState = _React$useState2[0],
    setFocusedState = _React$useState2[1];
  var _React$useState3 = React.useState(-1),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    focusedOptionIndex = _React$useState4[0],
    setFocusedOptionIndex = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    overlayVisibleState = _React$useState6[0],
    setOverlayVisibleState = _React$useState6[1];
  var clickedRef = React.useRef(false);
  var elementRef = React.useRef(null);
  var overlayRef = React.useRef(null);
  var firstHiddenFocusableElementOnOverlay = React.useRef(null);
  var lastHiddenFocusableElementOnOverlay = React.useRef(null);
  var inputRef = React.useRef(props.inputRef);
  var focusInputRef = React.useRef(props.focusInputRef);
  var virtualScrollerRef = React.useRef(null);
  var searchTimeout = React.useRef(null);
  var searchValue = React.useRef(null);
  var isLazy = props.virtualScrollerOptions && props.virtualScrollerOptions.lazy;
  var hasFilter = ObjectUtils.isNotEmpty(filterState);
  var appendTo = props.appendTo || context && context.appendTo || PrimeReact.appendTo;
  var _DropdownBase$setMeta = DropdownBase.setMetaData(_objectSpread(_objectSpread({
      props: props
    }, props.__parentMetadata), {}, {
      state: {
        filter: filterState,
        focused: focusedState,
        overlayVisible: overlayVisibleState
      }
    })),
    ptm = _DropdownBase$setMeta.ptm,
    cx = _DropdownBase$setMeta.cx,
    sx = _DropdownBase$setMeta.sx,
    isUnstyled = _DropdownBase$setMeta.isUnstyled;
  useHandleStyle(DropdownBase.css.styles, isUnstyled, {
    name: 'dropdown'
  });
  var _useOverlayListener = useOverlayListener({
      target: elementRef,
      overlay: overlayRef,
      listener: function listener(event, _ref) {
        var type = _ref.type,
          valid = _ref.valid;
        if (valid) {
          type === 'outside' ? !isClearClicked(event) && hide() : hide();
        }
      },
      when: overlayVisibleState
    }),
    _useOverlayListener2 = _slicedToArray(_useOverlayListener, 2),
    bindOverlayListener = _useOverlayListener2[0],
    unbindOverlayListener = _useOverlayListener2[1];
  var flatOptions = function flatOptions(options) {
    return (options || []).reduce(function (result, option, index) {
      result.push(_objectSpread(_objectSpread({}, option), {}, {
        group: true,
        index: index
      }));
      var optionGroupChildren = getOptionGroupChildren(option);
      optionGroupChildren && optionGroupChildren.forEach(function (o) {
        return result.push(o);
      });
      return result;
    }, []);
  };
  var getVisibleOptions = function getVisibleOptions() {
    var options = props.optionGroupLabel ? flatOptions(props.options) : props.options;
    if (hasFilter && !isLazy) {
      var _filterValue = filterState.trim().toLocaleLowerCase(props.filterLocale);
      var searchFields = props.filterBy ? props.filterBy.split(',') : [props.optionLabel || 'label'];
      if (props.optionGroupLabel) {
        var filteredGroups = [];
        var _iterator = _createForOfIteratorHelper(props.options),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var optgroup = _step.value;
            var filteredSubOptions = FilterService.filter(getOptionGroupChildren(optgroup), searchFields, _filterValue, props.filterMatchMode, props.filterLocale);
            if (filteredSubOptions && filteredSubOptions.length) {
              filteredGroups.push(_objectSpread(_objectSpread({}, optgroup), _defineProperty({}, "".concat(props.optionGroupChildren), filteredSubOptions)));
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        return flatOptions(filteredGroups);
      }
      return FilterService.filter(options, searchFields, _filterValue, props.filterMatchMode, props.filterLocale);
    }
    return options;
  };
  var onFirstHiddenFocus = function onFirstHiddenFocus(event) {
    var focusableEl = event.relatedTarget === focusInputRef.current ? DomHandler.getFirstFocusableElement(overlayRef.current, ':not([data-p-hidden-focusable="true"])') : focusInputRef.current;
    DomHandler.focus(focusableEl);
  };
  var onLastHiddenFocus = function onLastHiddenFocus(event) {
    var focusableEl = event.relatedTarget === focusInputRef.current ? DomHandler.getLastFocusableElement(overlayRef.current, ':not([data-p-hidden-focusable="true"])') : focusInputRef.current;
    DomHandler.focus(focusableEl);
  };
  var isClearClicked = function isClearClicked(event) {
    return DomHandler.isAttributeEquals(event.target, 'data-pc-section', 'clearicon') || DomHandler.isAttributeEquals(event.target.parentElement || event.target, 'data-pc-section', 'filterclearicon');
  };
  var _onClick = function onClick(event) {
    if (props.disabled || props.loading) {
      return;
    }
    props.onClick && props.onClick(event);

    // do not continue if the user defined click wants to prevent it
    if (event.defaultPrevented) {
      return;
    }
    if (isClearClicked(event) || event.target.tagName === 'INPUT') {
      return;
    } else if (!overlayRef.current || !(overlayRef.current && overlayRef.current.contains(event.target))) {
      DomHandler.focus(focusInputRef.current);
      overlayVisibleState ? hide() : show();
    }
    event.preventDefault();
    clickedRef.current = true;
  };
  var onInputFocus = function onInputFocus(event) {
    if (props.showOnFocus && !overlayVisibleState) {
      show();
    }
    setFocusedState(true);
    props.onFocus && props.onFocus(event);
  };
  var onInputBlur = function onInputBlur(event) {
    setFocusedState(false);
    if (props.onBlur) {
      setTimeout(function () {
        var currentValue = inputRef.current ? inputRef.current.value : undefined;
        props.onBlur({
          originalEvent: event.originalEvent,
          value: currentValue,
          stopPropagation: function stopPropagation() {
            event.originalEvent.stopPropagation();
          },
          preventDefault: function preventDefault() {
            event.originalEvent.preventDefault();
          },
          target: {
            name: props.name,
            id: props.id,
            value: currentValue
          }
        });
      }, 200);
    }
  };
  var onOptionSelect = function onOptionSelect(event, option) {
    var isHide = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    selectItem({
      originalEvent: event,
      option: option
    });
    isHide && hide();
  };
  var onPanelClick = function onPanelClick(event) {
    OverlayService.emit('overlay-click', {
      originalEvent: event,
      target: elementRef.current
    });
  };
  var onInputKeyDown = function onInputKeyDown(event) {
    if (props.disabled) {
      event.preventDefault();
      return;
    }
    var code = DomHandler.isAndroid() ? event.key : event.code;
    switch (code) {
      case 'ArrowDown':
        onArrowDownKey(event);
        break;
      case 'ArrowUp':
        onArrowUpKey(event);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        onArrowLeftKey(event, props.editable);
        break;
      case 'Home':
        onHomeKey(event);
        break;
      case 'End':
        onEndKey(event);
        break;
      case 'PageDown':
        onPageDownKey(event);
        break;
      case 'PageUp':
        onPageUpKey(event);
        break;
      case 'Space':
        onSpaceKey(event, props.editable);
        break;
      case 'NumpadEnter':
      case 'Enter':
        onEnterKey(event);
        break;
      case 'Escape':
        onEscapeKey(event);
        break;
      case 'Tab':
        onTabKey(event);
        break;
      case 'Backspace':
        onBackspaceKey(event, props.editable);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        //NOOP
        break;
      default:
        var metaKey = event.metaKey || event.ctrlKey || event.altKey;

        // Only handle printable characters when no meta keys are pressed
        if (!metaKey && ObjectUtils.isPrintableCharacter(event.key)) {
          !overlayVisibleState && !props.editable && show();
          !props.editable && searchOptions(event, event.key);
        }
        break;
    }
    clickedRef.current = false;
  };
  var onFilterInputKeyDown = function onFilterInputKeyDown(event) {
    switch (event.code) {
      case 'ArrowDown':
        onArrowDownKey(event);
        break;
      case 'ArrowUp':
        onArrowUpKey(event);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        onArrowLeftKey(event, true);
        break;
      case 'Escape':
      case 'Enter':
      case 'NumpadEnter':
        onEnterKey(event);
        event.preventDefault();
        break;
    }
  };
  var hasFocusableElements = function hasFocusableElements() {
    return DomHandler.getFocusableElements(overlayRef.current, ':not([data-p-hidden-focusable="true"])').length > 0;
  };
  var isOptionMatched = function isOptionMatched(option) {
    var _getOptionLabel;
    return isValidOption(option) && ((_getOptionLabel = getOptionLabel(option)) === null || _getOptionLabel === void 0 ? void 0 : _getOptionLabel.toLocaleLowerCase(props.filterLocale).startsWith(searchValue.current.toLocaleLowerCase(props.filterLocale)));
  };
  var isValidOption = function isValidOption(option) {
    return ObjectUtils.isNotEmpty(option) && !(isOptionDisabled(option) || isOptionGroup(option));
  };
  var hasSelectedOption = function hasSelectedOption() {
    return ObjectUtils.isNotEmpty(props.value);
  };
  var isValidSelectedOption = function isValidSelectedOption(option) {
    return isValidOption(option) && isSelected(option);
  };
  var findSelectedOptionIndex = function findSelectedOptionIndex() {
    return hasSelectedOption ? visibleOptions.findIndex(function (option) {
      return isValidSelectedOption(option);
    }) : -1;
  };
  var findFirstFocusedOptionIndex = function findFirstFocusedOptionIndex() {
    var selectedIndex = findSelectedOptionIndex();
    return selectedIndex < 0 ? findFirstOptionIndex() : selectedIndex;
  };
  var searchOptions = function searchOptions(event, _char) {
    searchValue.current = (searchValue.current || '') + _char;
    var optionIndex = -1;
    var matched = false;
    if (ObjectUtils.isNotEmpty(searchValue.current)) {
      if (focusedOptionIndex !== -1) {
        optionIndex = visibleOptions.slice(focusedOptionIndex).findIndex(function (option) {
          return isOptionMatched(option);
        });
        optionIndex = optionIndex === -1 ? visibleOptions.slice(0, focusedOptionIndex).findIndex(function (option) {
          return isOptionMatched(option);
        }) : optionIndex + focusedOptionIndex;
      } else {
        optionIndex = visibleOptions.findIndex(function (option) {
          return isOptionMatched(option);
        });
      }
      if (optionIndex !== -1) {
        matched = true;
      }
      if (optionIndex === -1 && focusedOptionIndex === -1) {
        optionIndex = findFirstFocusedOptionIndex();
      }
      if (optionIndex !== -1) {
        changeFocusedOptionIndex(event, optionIndex);
      }
    }
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(function () {
      searchValue.current = '';
      searchTimeout.current = null;
    }, 500);
    return matched;
  };
  var findLastFocusedOptionIndex = function findLastFocusedOptionIndex() {
    var selectedIndex = findSelectedOptionIndex();
    return selectedIndex < 0 ? findLastOptionIndex() : selectedIndex;
  };
  var findFirstOptionIndex = function findFirstOptionIndex() {
    return visibleOptions.findIndex(function (option) {
      return isValidOption(option);
    });
  };
  var findLastOptionIndex = function findLastOptionIndex() {
    return ObjectUtils.findLastIndex(visibleOptions, function (option) {
      return isValidOption(option);
    });
  };
  var findNextOptionIndex = function findNextOptionIndex(index) {
    var matchedOptionIndex = index < visibleOptions.length - 1 ? visibleOptions.slice(index + 1).findIndex(function (option) {
      return isValidOption(option);
    }) : -1;
    return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
  };
  var findPrevOptionIndex = function findPrevOptionIndex(index) {
    var matchedOptionIndex = index > 0 ? ObjectUtils.findLastIndex(visibleOptions.slice(0, index), function (option) {
      return isValidOption(option);
    }) : -1;
    return matchedOptionIndex > -1 ? matchedOptionIndex : index;
  };
  var changeFocusedOptionIndex = function changeFocusedOptionIndex(event, index) {
    if (focusedOptionIndex !== index) {
      setFocusedOptionIndex(index);
      focusOnItem(index);
      if (props.selectOnFocus) {
        onOptionSelect(event, visibleOptions[index], false);
      }
    }
  };
  var focusOnItem = function focusOnItem(index) {
    var focusedItem = DomHandler.findSingle(overlayRef.current, "li[id=\"dropdownItem_".concat(index, "\"]"));
    focusedItem && focusedItem.focus();
  };
  var onArrowDownKey = function onArrowDownKey(event) {
    if (!overlayVisibleState) {
      show();
      props.editable && changeFocusedOptionIndex(event, findSelectedOptionIndex());
    } else {
      var optionIndex = focusedOptionIndex !== -1 ? findNextOptionIndex(focusedOptionIndex) : clickedRef.current ? findFirstOptionIndex() : findFirstFocusedOptionIndex();
      changeFocusedOptionIndex(event, optionIndex);
    }
    event.preventDefault();
  };
  var onArrowUpKey = function onArrowUpKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (event.altKey && !pressedInInputText) {
      if (focusedOptionIndex !== -1) {
        onOptionSelect(event, visibleOptions[focusedOptionIndex]);
      }
      state.overlayVisible && hide();
      event.preventDefault();
    } else {
      var optionIndex = focusedOptionIndex !== -1 ? findPrevOptionIndex(focusedOptionIndex) : clickedRef.current ? findLastOptionIndex() : findLastFocusedOptionIndex();
      changeFocusedOptionIndex(event, optionIndex);
      !overlayVisibleState && show();
      event.preventDefault();
    }
  };
  var onArrowLeftKey = function onArrowLeftKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    pressedInInputText && setFocusedOptionIndex(-1);
  };
  var onHomeKey = function onHomeKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (pressedInInputText) {
      event.currentTarget.setSelectionRange(0, 0);
      setFocusedOptionIndex(-1);
    } else {
      changeFocusedOptionIndex(event, findFirstOptionIndex());
      !overlayVisibleState && show();
    }
    event.preventDefault();
  };
  var onEndKey = function onEndKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (pressedInInputText) {
      var target = event.currentTarget;
      var len = target.value.length;
      target.setSelectionRange(len, len);
      setFocusedOptionIndex(-1);
    } else {
      changeFocusedOptionIndex(event, findLastOptionIndex());
      !overlayVisibleState && show();
    }
    event.preventDefault();
  };
  var onPageUpKey = function onPageUpKey(event) {
    event.preventDefault();
  };
  var onPageDownKey = function onPageDownKey(event) {
    event.preventDefault();
  };
  var onSpaceKey = function onSpaceKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    !pressedInInputText && onEnterKey(event);
  };
  var onEnterKey = function onEnterKey(event) {
    if (!overlayVisibleState) {
      setFocusedOptionIndex(-1);
      onArrowDownKey(event);
    } else {
      if (focusedOptionIndex !== -1) {
        onOptionSelect(event, visibleOptions[focusedOptionIndex]);
      }
      hide();
    }
    event.preventDefault();
  };
  var onEscapeKey = function onEscapeKey(event) {
    overlayVisibleState && hide();
    event.preventDefault();
  };
  var onTabKey = function onTabKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!pressedInInputText) {
      if (overlayVisibleState && !hasFocusableElements()) {
        DomHandler.focus(firstHiddenFocusableElementOnOverlay.current);
        event.preventDefault();
      } else {
        if (focusedOptionIndex !== -1) {
          onOptionSelect(event, visibleOptions[focusedOptionIndex]);
        }
        overlayVisibleState && hide();
      }
    }
  };
  var onBackspaceKey = function onBackspaceKey(event) {
    var pressedInInputText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (event && pressedInInputText) {
      !overlayVisibleState && show();
    }
  };
  var findInArray = function findInArray(visibleOptions, searchText) {
    if (!searchText || !(visibleOptions !== null && visibleOptions !== void 0 && visibleOptions.length)) return -1;
    var normalizedSearch = searchText.toLocaleLowerCase();
    var exactMatch = visibleOptions.findIndex(function (item) {
      return getOptionLabel(item).toLocaleLowerCase() === normalizedSearch;
    });
    if (exactMatch !== -1) return exactMatch;
    return visibleOptions.findIndex(function (item) {
      return getOptionLabel(item).toLocaleLowerCase().startsWith(normalizedSearch);
    });
  };
  var onEditableInputChange = function onEditableInputChange(event) {
    !overlayVisibleState && show();
    var searchIndex = null;
    if (event.target.value && visibleOptions) {
      searchIndex = findInArray(visibleOptions, event.target.value);
    }
    setFocusedOptionIndex(searchIndex);
    if (props.onChange) {
      props.onChange({
        originalEvent: event.originalEvent,
        value: event.target.value,
        stopPropagation: function stopPropagation() {
          event.originalEvent.stopPropagation();
        },
        preventDefault: function preventDefault() {
          event.originalEvent.preventDefault();
        },
        target: {
          name: props.name,
          id: props.id,
          value: event.target.value
        }
      });
    }
  };
  var onEditableInputFocus = function onEditableInputFocus(event) {
    setFocusedState(true);
    hide();
    props.onFocus && props.onFocus(event);
  };
  var onOptionClick = function onOptionClick(event) {
    var option = event.option;
    if (!option.disabled) {
      selectItem(event);
      DomHandler.focus(focusInputRef.current);
    }
    hide();
  };
  var onFilterInputChange = function onFilterInputChange(event) {
    var filter = event.target.value;
    setFilterState(filter);
    if (props.onFilter) {
      props.onFilter({
        originalEvent: event,
        filter: filter
      });
    }
  };
  var onFilterClearIconClick = function onFilterClearIconClick(callback) {
    resetFilter(callback);
  };
  var resetFilter = function resetFilter(callback) {
    setFilterState('');
    props.onFilter && props.onFilter({
      filter: ''
    });
    callback && callback();
  };
  var clear = function clear(event) {
    if (props.onChange) {
      props.onChange({
        originalEvent: event,
        value: undefined,
        stopPropagation: function stopPropagation() {
          event === null || event === void 0 || event.stopPropagation();
        },
        preventDefault: function preventDefault() {
          event === null || event === void 0 || event.preventDefault();
        },
        target: {
          name: props.name,
          id: props.id,
          value: undefined
        }
      });
    }
    if (props.filter) {
      resetFilter();
    }
    updateEditableLabel();
    setFocusedOptionIndex(-1);
  };
  var selectItem = function selectItem(event) {
    if (selectedOption !== event.option) {
      updateEditableLabel(event.option);
      setFocusedOptionIndex(-1);
      var optionValue = getOptionValue(event.option);
      var selectedOptionIndex = findOptionIndexInList(event.option, visibleOptions);
      if (props.onChange) {
        props.onChange({
          originalEvent: event.originalEvent,
          value: optionValue,
          stopPropagation: function stopPropagation() {
            event.originalEvent.stopPropagation();
          },
          preventDefault: function preventDefault() {
            event.originalEvent.preventDefault();
          },
          target: {
            name: props.name,
            id: props.id,
            value: optionValue
          }
        });
      }
      changeFocusedOptionIndex(event.originalEvent, selectedOptionIndex);
    }
  };
  var getSelectedOptionIndex = function getSelectedOptionIndex(options) {
    options = options || visibleOptions;
    if (options) {
      if (props.optionGroupLabel) {
        for (var i = 0; i < options.length; i++) {
          var selectedOptionIndex = findOptionIndexInList(props.value, getOptionGroupChildren(options[i]));
          if (selectedOptionIndex !== -1) {
            return {
              group: i,
              option: selectedOptionIndex
            };
          }
        }
      } else {
        return findOptionIndexInList(props.value, options);
      }
    }
    return -1;
  };
  var equalityKey = function equalityKey() {
    return props.optionValue ? null : props.dataKey;
  };
  var findOptionIndexInList = function findOptionIndexInList(value, list) {
    var key = equalityKey();
    return list.findIndex(function (item) {
      return ObjectUtils.equals(value, getOptionValue(item), key);
    });
  };
  var isSelected = function isSelected(option) {
    return ObjectUtils.equals(props.value, getOptionValue(option), equalityKey());
  };
  var show = function show() {
    setFocusedOptionIndex(focusedOptionIndex !== -1 ? focusedOptionIndex : props.autoOptionFocus ? findFirstFocusedOptionIndex() : props.editable ? -1 : findSelectedOptionIndex());
    setOverlayVisibleState(true);
  };
  var hide = function hide() {
    setOverlayVisibleState(false);
    clickedRef.current = false;
  };
  var onFocus = function onFocus() {
    if (props.editable && !overlayVisibleState && clickedRef.current === false) {
      DomHandler.focus(inputRef.current);
    }
  };
  var onOverlayEnter = function onOverlayEnter(callback) {
    ZIndexUtils.set('overlay', overlayRef.current, context && context.autoZIndex || PrimeReact.autoZIndex, context && context.zIndex.overlay || PrimeReact.zIndex.overlay);
    DomHandler.addStyles(overlayRef.current, {
      position: 'absolute',
      top: '0',
      left: '0'
    });
    alignOverlay();
    callback && callback();
  };
  var onOverlayEntered = function onOverlayEntered(callback) {
    callback && callback();
    bindOverlayListener();
    props.onShow && props.onShow();
  };
  var onOverlayExit = function onOverlayExit() {
    unbindOverlayListener();
  };
  var onOverlayExited = function onOverlayExited() {
    if (props.filter && props.resetFilterOnHide) {
      resetFilter();
    }
    ZIndexUtils.clear(overlayRef.current);
    props.onHide && props.onHide();
  };
  var alignOverlay = function alignOverlay() {
    DomHandler.alignOverlay(overlayRef.current, inputRef.current.parentElement, props.appendTo || context && context.appendTo || PrimeReact.appendTo);
  };
  var scrollInView = function scrollInView() {
    var focusedItem = DomHandler.findSingle(overlayRef.current, 'li[data-p-focused="true"]');
    if (focusedItem && focusedItem.scrollIntoView) {
      focusedItem.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    } else {
      var highlightItem = DomHandler.findSingle(overlayRef.current, 'li[data-p-highlight="true"]');
      if (highlightItem && highlightItem.scrollIntoView) {
        highlightItem.scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  };
  var updateEditableLabel = function updateEditableLabel(option) {
    if (inputRef.current) {
      inputRef.current.value = option ? getOptionLabel(option) : props.value || '';

      // #1413 NVDA screenreader
      if (focusInputRef.current) {
        focusInputRef.current.value = inputRef.current.value;
      }
    }
  };
  var getOptionLabel = function getOptionLabel(option) {
    if (ObjectUtils.isScalar(option)) {
      return "".concat(option);
    }
    var optionLabel = props.optionLabel ? ObjectUtils.resolveFieldData(option, props.optionLabel) : option['label'];
    return "".concat(optionLabel);
  };
  var getOptionValue = function getOptionValue(option) {
    if (props.useOptionAsValue) {
      return option;
    }
    var optionValue = props.optionValue ? ObjectUtils.resolveFieldData(option, props.optionValue) : option ? option['value'] : ObjectUtils.resolveFieldData(option, 'value');
    return props.optionValue || ObjectUtils.isNotEmpty(optionValue) ? optionValue : option;
  };
  var getOptionRenderKey = function getOptionRenderKey(option) {
    return props.dataKey ? ObjectUtils.resolveFieldData(option, props.dataKey) : getOptionLabel(option);
  };
  var isOptionGroup = function isOptionGroup(option) {
    return props.optionGroupLabel && option.group;
  };
  var isOptionDisabled = function isOptionDisabled(option) {
    if (props.optionDisabled) {
      return ObjectUtils.isFunction(props.optionDisabled) ? props.optionDisabled(option) : ObjectUtils.resolveFieldData(option, props.optionDisabled);
    }
    return option && option.disabled !== undefined ? option.disabled : false;
  };
  var getOptionGroupRenderKey = function getOptionGroupRenderKey(optionGroup) {
    return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupLabel);
  };
  var getOptionGroupLabel = function getOptionGroupLabel(optionGroup) {
    return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupLabel);
  };
  var getOptionGroupChildren = function getOptionGroupChildren(optionGroup) {
    return ObjectUtils.resolveFieldData(optionGroup, props.optionGroupChildren);
  };
  var updateInputField = function updateInputField() {
    if (props.editable && inputRef.current) {
      var label = selectedOption ? getOptionLabel(selectedOption) : null;
      var value = label || props.value || '';
      inputRef.current.value = value;

      // #1413 NVDA screenreader
      if (focusInputRef.current) {
        focusInputRef.current.value = value;
      }
    }
  };
  var getSelectedOption = function getSelectedOption() {
    var index = getSelectedOptionIndex(props.options);
    return index !== -1 ? props.optionGroupLabel ? getOptionGroupChildren(props.options[index.group])[index.option] : props.options[index] : null;
  };
  React.useImperativeHandle(ref, function () {
    return {
      props: props,
      show: show,
      hide: hide,
      clear: clear,
      focus: function focus() {
        return DomHandler.focus(focusInputRef.current);
      },
      getElement: function getElement() {
        return elementRef.current;
      },
      getOverlay: function getOverlay() {
        return overlayRef.current;
      },
      getInput: function getInput() {
        return inputRef.current;
      },
      getFocusInput: function getFocusInput() {
        return focusInputRef.current;
      },
      getVirtualScroller: function getVirtualScroller() {
        return virtualScrollerRef.current;
      }
    };
  });
  React.useEffect(function () {
    ObjectUtils.combinedRefs(inputRef, props.inputRef);
    ObjectUtils.combinedRefs(focusInputRef, props.focusInputRef);
  }, [inputRef, props.inputRef, focusInputRef, props.focusInputRef]);
  useMountEffect(function () {
    if (props.autoFocus) {
      DomHandler.focus(focusInputRef.current, props.autoFocus);
    }
    alignOverlay();
  });
  useUpdateEffect$1(function () {
    if (overlayVisibleState && (props.value || focusedOptionIndex >= 0)) {
      scrollInView();
    }
  }, [overlayVisibleState, props.value, focusedOptionIndex]);
  useUpdateEffect$1(function () {
    if (overlayVisibleState && filterState && props.filter) {
      alignOverlay();
    }
  }, [overlayVisibleState, filterState, props.filter]);
  useUpdateEffect$1(function () {
    virtualScrollerRef.current && virtualScrollerRef.current.scrollInView(0);
  }, [filterState]);
  useUpdateEffect$1(function () {
    if (filterState && (!props.options || props.options.length === 0)) {
      setFilterState('');
    }
    updateInputField();
    if (inputRef.current) {
      inputRef.current.selectedIndex = 1;
    }
  });
  useUnmountEffect(function () {
    ZIndexUtils.clear(overlayRef.current);
  });
  var createHiddenSelect = function createHiddenSelect() {
    var option = {
      value: '',
      label: props.placeholder
    };
    if (selectedOption) {
      var optionValue = getOptionValue(selectedOption);
      option = {
        value: _typeof(optionValue) === 'object' ? props.options.findIndex(function (o) {
          return o === optionValue;
        }) : optionValue,
        label: getOptionLabel(selectedOption)
      };
    }
    var hiddenSelectedMessageProps = mergeProps({
      className: 'p-hidden-accessible p-dropdown-hidden-select'
    }, ptm('hiddenSelectedMessage'));
    var selectProps = mergeProps({
      ref: inputRef,
      required: props.required,
      defaultValue: option.value,
      name: props.name,
      tabIndex: -1
    }, ptm('select'));
    var optionProps = mergeProps({
      value: option.value
    }, ptm('option'));
    return /*#__PURE__*/React.createElement("div", hiddenSelectedMessageProps, /*#__PURE__*/React.createElement("select", selectProps, /*#__PURE__*/React.createElement("option", optionProps, option.label)));
  };
  var createKeyboardHelper = function createKeyboardHelper() {
    var value = ObjectUtils.isNotEmpty(selectedOption) ? getOptionLabel(selectedOption) : null;
    if (props.editable) {
      value = value || props.value || '';
    }
    var hiddenSelectedMessageProps = mergeProps({
      className: 'p-hidden-accessible'
    }, ptm('hiddenSelectedMessage'));
    var inputProps = mergeProps(_objectSpread({
      ref: focusInputRef,
      id: props.inputId,
      defaultValue: value,
      type: 'text',
      readOnly: true,
      'aria-haspopup': 'listbox',
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      onKeyDown: onInputKeyDown,
      disabled: props.disabled,
      tabIndex: !props.disabled ? props.tabIndex || 0 : -1
    }, ariaProps), ptm('input'));
    return /*#__PURE__*/React.createElement("div", hiddenSelectedMessageProps, /*#__PURE__*/React.createElement("input", inputProps));
  };
  var createLabel = function createLabel() {
    var label = ObjectUtils.isNotEmpty(selectedOption) ? getOptionLabel(selectedOption) : null;
    if (props.editable) {
      var value = label || props.value || '';
      var _inputProps = mergeProps(_objectSpread({
        ref: inputRef,
        type: 'text',
        defaultValue: value,
        className: cx('input', {
          label: label
        }),
        disabled: props.disabled,
        placeholder: props.placeholder,
        maxLength: props.maxLength,
        onInput: onEditableInputChange,
        onFocus: onEditableInputFocus,
        onKeyDown: onInputKeyDown,
        onBlur: onInputBlur,
        tabIndex: !props.disabled ? props.tabIndex || 0 : -1,
        'aria-haspopup': 'listbox'
      }, ariaProps), ptm('input'));
      return /*#__PURE__*/React.createElement("input", _inputProps);
    }
    var content = props.valueTemplate ? ObjectUtils.getJSXElement(props.valueTemplate, selectedOption, props) : label || props.placeholder || props.emptyMessage || /*#__PURE__*/React.createElement(React.Fragment, null, "\xA0");
    var inputProps = mergeProps({
      ref: inputRef,
      className: cx('input', {
        label: label
      }),
      tabIndex: '-1'
    }, ptm('input'));
    return /*#__PURE__*/React.createElement("span", inputProps, content);
  };
  var onClearIconKeyDown = function onClearIconKeyDown(event) {
    if (event.key === 'Enter' || event.code === 'Space') {
      clear(event);
      event.preventDefault();
    }
  };
  var createClearIcon = function createClearIcon() {
    if (props.value != null && props.showClear && !props.disabled && !ObjectUtils.isEmpty(props.options)) {
      var clearIconProps = mergeProps({
        className: cx('clearIcon'),
        onPointerUp: clear,
        tabIndex: props.tabIndex || '0',
        onKeyDown: onClearIconKeyDown,
        'aria-label': localeOption('clear')
      }, ptm('clearIcon'));
      var icon = props.clearIcon || /*#__PURE__*/React.createElement(TimesIcon, clearIconProps);
      return IconUtils.getJSXIcon(icon, _objectSpread({}, clearIconProps), {
        props: props
      });
    }
    return null;
  };
  var createLoadingIcon = function createLoadingIcon() {
    var loadingIconProps = mergeProps({
      className: cx('loadingIcon'),
      'data-pr-overlay-visible': overlayVisibleState
    }, ptm('loadingIcon'));
    var icon = props.loadingIcon || /*#__PURE__*/React.createElement(SpinnerIcon, {
      spin: true
    });
    var loadingIcon = IconUtils.getJSXIcon(icon, _objectSpread({}, loadingIconProps), {
      props: props
    });
    var ariaLabel = props.placeholder || props.ariaLabel;
    var loadingButtonProps = mergeProps({
      className: cx('trigger'),
      role: 'button',
      'aria-haspopup': 'listbox',
      'aria-expanded': overlayVisibleState,
      'aria-label': ariaLabel
    }, ptm('trigger'));
    return /*#__PURE__*/React.createElement("div", loadingButtonProps, loadingIcon);
  };
  var createDropdownIcon = function createDropdownIcon() {
    var dropdownIconProps = mergeProps({
      className: cx('dropdownIcon'),
      'data-pr-overlay-visible': overlayVisibleState
    }, ptm('dropdownIcon'));
    var icon = !overlayVisibleState ? props.dropdownIcon || /*#__PURE__*/React.createElement(ChevronDownIcon, dropdownIconProps) : props.collapseIcon || /*#__PURE__*/React.createElement(ChevronUpIcon, dropdownIconProps);
    var dropdownIcon = IconUtils.getJSXIcon(icon, _objectSpread({}, dropdownIconProps), {
      props: props
    });
    var ariaLabel = props.placeholder || props.ariaLabel;
    var triggerProps = mergeProps({
      className: cx('trigger'),
      role: 'button',
      'aria-haspopup': 'listbox',
      'aria-expanded': overlayVisibleState,
      'aria-label': ariaLabel
    }, ptm('trigger'));
    return /*#__PURE__*/React.createElement("div", triggerProps, dropdownIcon);
  };
  var visibleOptions = getVisibleOptions();
  var selectedOption = getSelectedOption();
  var hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
  var otherProps = DropdownBase.getOtherProps(props);
  var ariaProps = ObjectUtils.reduceKeys(otherProps, DomHandler.ARIA_PROPS);
  var hiddenSelect = createHiddenSelect();
  var keyboardHelper = createKeyboardHelper();
  var labelElement = createLabel();
  var dropdownIcon = props.loading ? createLoadingIcon() : createDropdownIcon();
  var clearIcon = createClearIcon();
  var rootProps = mergeProps({
    id: props.id,
    ref: elementRef,
    className: classNames(props.className, cx('root', {
      context: context,
      focusedState: focusedState,
      overlayVisibleState: overlayVisibleState
    })),
    style: props.style,
    onClick: function onClick(e) {
      return _onClick(e);
    },
    onMouseDown: props.onMouseDown,
    onContextMenu: props.onContextMenu,
    onFocus: onFocus,
    'data-p-disabled': props.disabled,
    'data-p-focus': focusedState,
    'aria-activedescendant': focusedState ? "dropdownItem_".concat(focusedOptionIndex) : undefined
  }, otherProps, ptm('root'));
  var firstHiddenFocusableElementProps = mergeProps({
    ref: firstHiddenFocusableElementOnOverlay,
    role: 'presentation',
    className: 'p-hidden-accessible p-hidden-focusable',
    tabIndex: '0',
    onFocus: onFirstHiddenFocus,
    'data-p-hidden-accessible': true,
    'data-p-hidden-focusable': true
  }, ptm('hiddenFirstFocusableEl'));
  var lastHiddenFocusableElementProps = mergeProps({
    ref: lastHiddenFocusableElementOnOverlay,
    role: 'presentation',
    className: 'p-hidden-accessible p-hidden-focusable',
    tabIndex: '0',
    onFocus: onLastHiddenFocus,
    'data-p-hidden-accessible': true,
    'data-p-hidden-focusable': true
  }, ptm('hiddenLastFocusableEl'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", rootProps, keyboardHelper, hiddenSelect, labelElement, clearIcon, dropdownIcon, /*#__PURE__*/React.createElement(DropdownPanel, _extends({
    hostName: "Dropdown",
    ref: overlayRef,
    visibleOptions: visibleOptions,
    virtualScrollerRef: virtualScrollerRef
  }, props, {
    appendTo: appendTo,
    cx: cx,
    filterValue: filterValue,
    focusedOptionIndex: focusedOptionIndex,
    getOptionGroupChildren: getOptionGroupChildren,
    getOptionGroupLabel: getOptionGroupLabel,
    getOptionGroupRenderKey: getOptionGroupRenderKey,
    getOptionLabel: getOptionLabel,
    getOptionRenderKey: getOptionRenderKey,
    getSelectedOptionIndex: getSelectedOptionIndex,
    hasFilter: hasFilter,
    "in": overlayVisibleState,
    isOptionDisabled: isOptionDisabled,
    isSelected: isSelected,
    onClick: onPanelClick,
    onEnter: onOverlayEnter,
    onEntered: onOverlayEntered,
    onExit: onOverlayExit,
    onExited: onOverlayExited,
    onFilterClearIconClick: onFilterClearIconClick,
    onFilterInputChange: onFilterInputChange,
    onFilterInputKeyDown: onFilterInputKeyDown,
    onOptionClick: onOptionClick,
    onInputKeyDown: onInputKeyDown,
    ptm: ptm,
    resetFilter: resetFilter,
    changeFocusedOptionIndex: changeFocusedOptionIndex,
    firstFocusableElement: /*#__PURE__*/React.createElement("span", firstHiddenFocusableElementProps),
    lastFocusableElement: /*#__PURE__*/React.createElement("span", lastHiddenFocusableElementProps),
    sx: sx
  }))), hasTooltip && /*#__PURE__*/React.createElement(Tooltip, _extends({
    target: elementRef,
    content: props.tooltip,
    pt: ptm('tooltip')
  }, props.tooltipOptions)));
}));
Dropdown.displayName = 'Dropdown';

function SelectInput({
  className,
  placeholder,
  options,
  name,
  setValue,
  value,
  setError,
  loading = false,
  disabled = false,
  optionLabel = "name"
}) {
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      name,
      loading,
      value: value.value,
      onChange: (e) => {
        const targetValue = options.filter((op) => op.value == e.target.value);
        if (targetValue.length) {
          setError(name, { type: "required" });
        }
        setValue(name, { ...targetValue[0] });
      },
      disabled,
      options,
      optionLabel,
      virtualScrollerOptions: { itemSize: 38 },
      placeholder,
      className: cn(Styles.selectInput, className),
      showClear: true
    }
  );
}

const addressFormSchema = z.object({
  governorate: z.any({
    required_error: "يرجى اختيار المحافظة"
  }).refine(
    (val) => val?.value !== "" && val?.value !== null && val?.value !== void 0,
    {
      message: "يرجى اختيار المحافظة"
    }
  ),
  city: z.any({
    required_error: "يرجى اختيار المدينة"
  }).refine(
    (val) => val?.value !== "" && val?.value !== null && val?.value !== void 0,
    {
      message: "يرجى اختيار المدينة"
    }
  ),
  branch_id: z.any({
    required_error: "يرجى اختيار الفرع"
  }).refine(
    (val) => val?.value !== "" && val?.value !== null && val?.value !== void 0,
    {
      message: "يرجى اختيار الفرع"
    }
  ),
  name: z.string({
    required_error: "يرجى إدخال الاسم"
  }).min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  email: z.string({
    required_error: "يرجى إدخال البريد الإلكتروني"
  }).email("البريد الإلكتروني غير صحيح"),
  phone: z.string({
    required_error: "يرجى إدخال رقم الهاتف"
  }).length(11, "رقم الهاتف يجب أن يتكون من 11 رقم بالضبط").refine(
    (val) => /^\d+$/.test(val),
    "رقم الهاتف يجب أن يحتوي على أرقام فقط"
  ),
  address: z.string({
    required_error: "يرجى إدخال العنوان"
  }).min(5, "العنوان يجب أن يحتوي على 5 أحرف على الأقل"),
  special_Sign: z.string({
    required_error: "يرجى إدخال علامة خاصة"
  }).min(2, "اسم علامة خاصة يجب أن يحتوي على حرفين على الأقل").optional(),
  street: z.string({
    required_error: "يرجى إدخال اسم الشارع"
  }).min(2, "اسم الشارع يجب أن يحتوي على حرفين على الأقل"),
  building: z.string({
    required_error: "يرجى إدخال رقم المبنى"
  }),
  floor: z.string({
    required_error: "يرجى إدخال رقم الدور"
  }).refine(
    (val) => /^\d+$/.test(val),
    "رقم الدور يجب أن يتكون من رقم على الأقل"
  ),
  flat: z.string({
    required_error: "يرجى إدخال رقم الشقة"
  }).refine(
    (val) => /^\d+$/.test(val),
    "رقم الشقة يجب أن يتكون من رقم على الأقل"
  )
});
const AddressFormSchemaDefaultValues = {
  city: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  building: "",
  street: "",
  special_Sign: "",
  floor: "",
  flat: "",
  governorate: ""
};

function DialogAddressForm({
  showDialog,
  setShowDialog,
  retryAddress
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    setError,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: AddressFormSchemaDefaultValues,
    resolver: zodResolver(addressFormSchema)
  });
  const { loading: governoratesLoading, value: governorates } = useGovernorate();
  const { loading: citiesLoading, value: cities } = useCities(
    watch("governorate")?.value || ""
  );
  const { loading: branchesLoading, value: branches } = useBranchesWithCity(
    watch("city")?.value || ""
  );
  useUpdateEffect(() => {
    if (watch("governorate")?.length == 0) {
      setValue("city", "");
    }
  }, [watch("governorate")]);
  const { createAddress, loading } = useAddress();
  const onSubmit = async (inputs) => {
    const data = await createAddress(inputs);
    if (data?.status === 201) {
      setShowDialog(false);
      retryAddress();
    }
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Dialog,
    {
      visible: showDialog,
      modal: true,
      className: "mx-4 flex w-full items-center justify-center shadow-none",
      onHide: () => {
        if (!showDialog) return;
        setShowDialog(false);
      },
      content: ({ hide }) => /* @__PURE__ */ jsx("div", { className: "h-full w-fit overflow-y-auto rounded-md max-md:max-h-[700px] max-sm:max-h-[550px]", children: /* @__PURE__ */ jsxs("div", { className: "relative flex h-fit min-h-[880px] w-full max-w-[550px] flex-col items-center justify-start gap-2 overflow-y-auto rounded-md bg-[var(--main-background)] p-6 py-10 max-sm:min-h-[880px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute top-1 flex w-full items-center justify-between gap-2 px-4 text-[var(--second-font-color)]", children: [
          /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-1", children: /* @__PURE__ */ jsx("h4", { className: "text-[15px] font-semibold text-[var(--main-color)]", children: "اضف العنوان الخاص بيك" }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              icon: /* @__PURE__ */ jsx(CircleX, {}),
              rounded: true,
              text: true,
              onClick: (e) => hide(e),
              className: "w-fit text-[var(--second-font-color)] !shadow-none !outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col items-center justify-start gap-4", children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: handleSubmit(onSubmit),
            className: "w-full space-y-4",
            children: [
              /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "الاسم" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "text",
                        required: true,
                        placeholder: "ادخل الاسم",
                        ...register("name"),
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                      }
                    ),
                    errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "رقم الهاتف (واتساب)" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "tel",
                        required: true,
                        placeholder: "ادخل رقم الهاتف",
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        ...register("phone")
                      }
                    ),
                    errors.phone && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phone.message })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "البريد الإلكتروني" }),
                  /* @__PURE__ */ jsx(
                    InputText,
                    {
                      type: "email",
                      required: true,
                      placeholder: "ادخل البريد الالكتروني",
                      className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                      ...register("email")
                    }
                  ),
                  errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "العنوان" }),
                  /* @__PURE__ */ jsx(
                    InputText,
                    {
                      type: "text",
                      required: true,
                      placeholder: "ادخل العنوان",
                      className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                      ...register("address")
                    }
                  ),
                  errors.address && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.address.message })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "المدينة" }),
                    /* @__PURE__ */ jsx(
                      SelectInput,
                      {
                        name: "governorate",
                        loading: governoratesLoading,
                        options: governorates || [],
                        className: "w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        value: watch("governorate") || "",
                        setValue,
                        optionLabel: "name",
                        placeholder: "اختر المحافظة",
                        setError
                      }
                    ),
                    errors.governorate && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.governorate.message })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "المنطقه" }),
                    /* @__PURE__ */ jsx(
                      SelectInput,
                      {
                        name: "city",
                        optionLabel: "name",
                        disabled: watch("governorate")?.length === 0,
                        options: cities || [],
                        loading: citiesLoading,
                        className: "w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        value: watch("city") || "",
                        setValue,
                        placeholder: "اختر المدينة او المنطقه",
                        setError
                      }
                    ),
                    errors.city && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.city.message })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "الفرع" }),
                  /* @__PURE__ */ jsx(
                    SelectInput,
                    {
                      name: "branch_id",
                      optionLabel: "name",
                      disabled: watch("governorate")?.length === 0,
                      options: branches || [],
                      loading: branchesLoading,
                      className: "w-full rounded-lg border border-gray-300 px-4 py-2 text-red-800 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                      value: watch("branch_id") || "",
                      setValue,
                      placeholder: "اختر الفرع",
                      setError
                    }
                  ),
                  errors.branch_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.branch_id.message })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "الشارع" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "text",
                        required: true,
                        placeholder: "ادخل الشارع",
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        ...register("street")
                      }
                    ),
                    errors.street && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.street.message })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "علامة خاصة" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "text",
                        required: true,
                        placeholder: "ادخل علامة خاصة",
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        ...register("special_Sign")
                      }
                    ),
                    errors.special_Sign && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.special_Sign.message })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "رقم / اسم المبنى" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "text",
                        required: true,
                        placeholder: "ادخل رقم المبنى",
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        ...register("building")
                      }
                    ),
                    errors.building && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.building.message })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "رقم الدور" }),
                    /* @__PURE__ */ jsx(
                      InputText,
                      {
                        type: "number",
                        required: true,
                        placeholder: "ادخل رقم الدور",
                        className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                        ...register("floor")
                      }
                    ),
                    errors.floor && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.floor.message })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "رقم الشقة" }),
                  /* @__PURE__ */ jsx(
                    InputText,
                    {
                      type: "number",
                      required: true,
                      placeholder: "ادخل رقم الشقة",
                      className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
                      ...register("flat")
                    }
                  ),
                  errors.flat && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.flat.message })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading,
                  className: "w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition-colors hover:bg-orange-600",
                  children: "تأكيد العنوان"
                }
              )
            ]
          }
        ) })
      ] }) })
    }
  ) });
}

function CheckoutPage() {
  const { loading: cartLoading, data: cartResponse } = useCartServices();
  const items = cartResponse?.cart_items || [];
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    watch,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: formSchemaDefaultValues,
    resolver: zodResolver(formSchema)
  });
  const { loading: addressLoading, value: address, retry } = useGetAddress();
  const selectedAddress = watch("address");
  const areaId = selectedAddress?.area_id ?? selectedAddress?.city_id ?? null;
  const shippingFees = Number(selectedAddress?.shipping ?? selectedAddress?.shipping_fees ?? 0);
  const { loading: branchesLoading, value: branches } = useBranchesWithCity(areaId || void 0);
  const { createOrder } = useCheckout();
  const onSubmit = async (inputs) => {
    setLoading(true);
    const res = await createOrder({
      ...inputs,
      shippingFees
    });
    if (res?.status === 200) {
      const orderId = res?.data?.data?.id;
      if (orderId) {
        router.push(`/order/${orderId}`);
      } else {
        router.push("/user/orders");
      }
    }
    setLoading(false);
  };
  if (cartLoading) {
    return /* @__PURE__ */ jsx(PageLoader, { text: "جاري تحميل عربة التسوق" });
  }
  if (!items?.length) {
    return /* @__PURE__ */ jsx(EmptyCart, {});
  }
  const total = cartResponse?.total_price || 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto min-h-screen max-w-7xl px-4 py-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-8 text-3xl font-bold", children: "إتمام الشراء" }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col-reverse gap-8 lg:flex-row", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full flex-1", children: addressLoading ? /* @__PURE__ */ jsx(AddressSkeleton, {}) : /* @__PURE__ */ jsx(
          BillingForm,
          {
            address,
            showDialog,
            setShowDialog,
            watch,
            setValue,
            setError,
            register,
            errors,
            handleSubmit,
            onSubmit,
            loading,
            branches: branches || [],
            branchesLoading,
            hasAddressSelected: !!selectedAddress?.id
          }
        ) }),
        /* @__PURE__ */ jsx(
          OrderSummary,
          {
            items,
            total,
            shippingFees
          }
        )
      ] })
    ] }),
    showDialog && /* @__PURE__ */ jsx(
      DialogAddressForm,
      {
        showDialog,
        retryAddress: retry,
        setShowDialog
      }
    )
  ] });
}
const EmptyCart = () => /* @__PURE__ */ jsxs("div", { className: "mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 text-center", children: [
  /* @__PURE__ */ jsx("h2", { className: "mb-4 text-2xl font-bold", children: "عربة التسوق فارغة" }),
  /* @__PURE__ */ jsx(
    Link,
    {
      href: "/",
      className: "font-semibold text-orange-500 hover:text-orange-600",
      children: "العودة للتسوق"
    }
  )
] });
const AddressSkeleton = () => /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-lg bg-white py-6", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
  /* @__PURE__ */ jsx("div", { className: "h-8 w-1/3 rounded bg-gray-200" }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "h-12 w-40 rounded bg-gray-200" }),
    /* @__PURE__ */ jsx("div", { className: "h-10 w-full rounded bg-gray-200" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "h-[200px] w-full rounded bg-gray-200" }),
  /* @__PURE__ */ jsx("div", { className: "h-32 w-full rounded bg-gray-200" }),
  /* @__PURE__ */ jsx("div", { className: "h-12 w-full rounded bg-gray-200" })
] }) });
const BillingForm = ({
  address,
  setShowDialog,
  watch,
  setValue,
  setError,
  register,
  errors,
  handleSubmit,
  onSubmit,
  loading,
  branches,
  branchesLoading,
  hasAddressSelected
}) => /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg bg-white px-4 py-6", children: [
  /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-bold", children: "معلومات الفاتورة" }),
  /* @__PURE__ */ jsxs("div", { className: "mb-5 mt-10 flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-2 font-medium", children: address?.length ? "العناوين المحفوظة" : "لا يوجد عناوين محفوظة" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setShowDialog(true),
        className: "text-nowrap rounded-md bg-[var(--second-color)] px-3 py-4 text-[var(--main-background)]",
        children: "اضافة عنوان جديد"
      }
    )
  ] }),
  !address?.length ? /* @__PURE__ */ jsx("h3", { className: "text-md flex h-[200px] items-center justify-center bg-slate-50 text-center font-bold text-red-600", children: "لم يتم إضافة عنوان، من فضلك قم بإضافة عنوان لاستكمال الطلب" }) : /* @__PURE__ */ jsx(
    AddressList,
    {
      addresses: address,
      selectedAddressId: watch("address")?.id || null,
      onSelectAddress: (selectedAddress) => {
        setValue("address", selectedAddress);
        setValue("branch_id", "");
        setError("address", { type: "manual", message: "" });
      }
    }
  ),
  hasAddressSelected && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
    /* @__PURE__ */ jsx("label", { className: "mb-2 block text-sm font-medium text-gray-700", children: "اختر الفرع" }),
    branchesLoading ? /* @__PURE__ */ jsx("div", { className: "flex h-12 items-center justify-center rounded-lg border border-gray-200 bg-slate-50", children: /* @__PURE__ */ jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-[var(--main-color)] border-t-transparent" }) }) : branches?.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700", children: "لا توجد فروع متاحة لهذه المنطقة" }) : /* @__PURE__ */ jsx(
      SelectInput,
      {
        name: "branch_id",
        optionLabel: "name",
        options: branches || [],
        loading: branchesLoading,
        className: "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500",
        value: watch("branch_id") || "",
        setValue,
        placeholder: "اختر الفرع",
        setError
      }
    ),
    errors.branch_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.branch_id.message?.toString() })
  ] }),
  /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 pt-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-gray-700", children: "ملاحظات إضافية" }),
      /* @__PURE__ */ jsx(
        InputTextarea,
        {
          rows: 4,
          className: "w-full rounded-lg border border-gray-300 px-4 py-4 focus:border-transparent focus:ring-2 focus:ring-orange-500",
          ...register("desc")
        }
      ),
      errors.desc && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.desc.message }),
      errors.address && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.address.message?.toString() }),
      errors.paymentMethod && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.paymentMethod.message?.toString() })
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        type: "submit",
        loading,
        className: "flex w-full items-center justify-center gap-4 rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-600",
        children: "تأكيد الطلب"
      }
    )
  ] })
] });
const OrderSummary = ({ items, total, shippingFees }) => /* @__PURE__ */ jsxs("div", { className: "h-fit w-full flex-1 rounded-lg bg-gray-100 p-6", children: [
  /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-bold", children: "ملخص الطلب" }),
  /* @__PURE__ */ jsx("div", { className: "max-h-[500px] space-y-4 overflow-y-auto bg-gray-50 px-10 pb-10", children: items.map((item) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "flex items-center gap-4 border-t border-gray-200 py-4 max-sm:items-start",
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-start justify-start gap-4 max-sm:flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "relative h-20 w-20", children: /* @__PURE__ */ jsx(
          Image,
          {
            src: item.product_image,
            alt: item.product_name || "",
            fill: true,
            className: "rounded object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: item.product_name }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-end text-sm text-gray-800", children: [
            item.qty,
            " ×",
            (item.item_total - (item.variations?.reduce(
              (sum, variation) => sum + variation.choices.reduce(
                (choiceSum, choice) => choiceSum + choice.price,
                0
              ),
              0
            ) || 0)).toFixed(1),
            "ج.م"
          ] }),
          item.product_note && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "ملاحظة:" }),
            item.product_note
          ] }),
          item.variations && item.variations.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1", children: item.variations.map((variation) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-1 text-xs text-gray-500",
              children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  variation.main_variation_name,
                  ":"
                ] }),
                variation.choices.map((choice, idx) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
                  idx > 0 && /* @__PURE__ */ jsx("span", { children: ", " }),
                  /* @__PURE__ */ jsxs("bdi", { children: [
                    choice.name,
                    " (",
                    choice.price,
                    " ج.م+)"
                  ] })
                ] }, choice.id))
              ]
            },
            variation.main_variation_id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-between text-sm text-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "", children: "إجمالي المنتج" }),
            /* @__PURE__ */ jsxs(Fragment, { children: [
              item.item_total.toFixed(2),
              " ج.م"
            ] })
          ] })
        ] })
      ] })
    },
    item.cart_item_id
  )) }),
  /* @__PURE__ */ jsxs("div", { className: "text-md space-y-2 border-t pt-4 font-bold", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { children: "إجمالي المنتجات" }),
      /* @__PURE__ */ jsxs("span", { children: [
        total.toFixed(2),
        " ج.م"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { children: "رسوم الشحن" }),
      /* @__PURE__ */ jsx("span", { className: shippingFees > 0 ? "text-orange-600" : "text-green-600", children: shippingFees > 0 ? `${shippingFees.toFixed(2)} ج.م` : "مجاني" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-md flex justify-between border-t pt-2", children: [
      /* @__PURE__ */ jsx("span", { children: "الإجمالي النهائي" }),
      /* @__PURE__ */ jsxs("span", { children: [
        (total + shippingFees).toFixed(2),
        " ج.م"
      ] })
    ] })
  ] })
] });

const $$Astro = createAstro("https://admin-osama.cashierthru.com");
const prerender = false;
const $$Checkout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Checkout;
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
  const pageTitle = "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 - " + (settingsData?.name || "\u0627\u0644\u0645\u062A\u062C\u0631");
  const pageDescription = "\u0623\u0643\u0645\u0644 \u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u0634\u0631\u0627\u0621 \u0648\u0623\u062F\u062E\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u062D\u0646 \u0648\u0627\u0644\u062F\u0641\u0639";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "SettingsProvider", null, { "initialSettings": settingsData, "isLogin": isLogin, "cartCount": cartCount, "token": token, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/providers", "client:component-export": "SettingsProvider" }, { "default": async ($$result3) => renderTemplate`  ${renderComponent($$result3, "ColorHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/ColorHandler", "client:component-export": "default" })} ${renderComponent($$result3, "LoginHandler", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/layouts/LoginHandler", "client:component-export": "default" })}  ${renderComponent($$result3, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Header/Header", "client:component-export": "default" })}  ${maybeRenderHead()}<main class="min-h-screen"> ${renderComponent($$result3, "CheckoutPage", CheckoutPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Checkout/Checkout", "client:component-export": "default" })} </main>  ${whatsappLink && renderTemplate`<a${addAttribute(whatsappLink, "href")} target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر الواتساب" class="group fixed left-4 top-40 z-50"> <div class="
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
}, "F:/react js projects/kamal/web-small-business-react/src/pages/shop/checkout.astro", void 0);

const $$file = "F:/react js projects/kamal/web-small-business-react/src/pages/shop/checkout.astro";
const $$url = "/shop/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
