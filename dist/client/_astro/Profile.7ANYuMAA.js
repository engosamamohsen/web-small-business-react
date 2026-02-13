import{j as e}from"./jsx-runtime.BjG_zV1W.js";import{r as n}from"./index.Baz2VbZ6.js";import{a as d}from"./js.cookie.Cz0CWeBA.js";import{f as m}from"./fetch-hook.Ct8ryMjM.js";import{c as a}from"./createLucideIcon.Bd5lDQu6.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=a("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=a("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=a("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=a("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);function y(){const[t,c]=n.useState(null),[i,l]=n.useState(!0),r=d.get("app_token");n.useEffect(()=>{if(!r){window.location.href="/login";return}o()},[r]);const o=async()=>{const s=await m({url:"v1/profile",token:r});s.ok&&s.data&&c(s.data.data||s.data),l(!1)};return i?e.jsx("div",{className:"flex min-h-[300px] items-center justify-center",children:e.jsx("div",{className:"h-8 w-8 animate-spin rounded-full border-4 border-[var(--main-color)] border-t-transparent"})}):e.jsxs("div",{className:"mx-auto max-w-2xl rounded-lg bg-white p-6 shadow",children:[e.jsxs("div",{className:"mb-6 flex items-center justify-between",children:[e.jsx("h2",{className:"text-xl font-bold text-[var(--second-font-color)]",children:"معلومات الحساب"}),e.jsxs("a",{href:"/profile/edit",className:"flex items-center gap-1 text-[var(--main-color)] hover:underline",children:[e.jsx(f,{className:"h-4 w-4"})," تعديل"]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(p,{className:"h-5 w-5 text-gray-400"}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm text-gray-500",children:"الاسم"}),e.jsx("p",{className:"font-medium",children:t?.name||"-"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(x,{className:"h-5 w-5 text-gray-400"}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm text-gray-500",children:"البريد"}),e.jsx("p",{className:"font-medium",children:t?.email||"-"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(h,{className:"h-5 w-5 text-gray-400"}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm text-gray-500",children:"الهاتف"}),e.jsx("p",{className:"font-medium",children:t?.phone||"-"})]})]})]}),e.jsx("div",{className:"mt-8 border-t pt-6",children:e.jsx("a",{href:"/order",className:"block w-full rounded-lg border border-[var(--main-color)] py-3 text-center font-medium text-[var(--main-color)] hover:bg-orange-50",children:"عرض طلباتي"})})]})}export{y as default};
