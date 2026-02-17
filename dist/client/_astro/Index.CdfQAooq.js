import{j as n}from"./jsx-runtime.BjG_zV1W.js";import{S as P,N as O,d as m}from"./navigation.5Pa-AoAa.js";import{A as k}from"./autoplay.LnEnkbMo.js";import{r as i}from"./index.DGOumNSj.js";import{u as S,P as N,a as E,c as y,C as R}from"./componentbase.esm.CMFrStRF.js";/* empty css                       */import{a}from"./index.95d291e9.CW53t3od.js";import{P as B}from"./Product.i_gd627f.js";import{c as M}from"./createLucideIcon.CineUDy-.js";import"./Image.BgogDUHG.js";import"./Link.BqK_IixG.js";import"./cart.DTX6BUnY.js";import"./navigation.DijynRCw.js";import"./_astro-entry_react-toastify.BeX7-DVQ.js";import"./clsx.B-dksMZM.js";import"./js.cookie.Cz0CWeBA.js";import"./index.BVz4tbdG.js";import"./providers.CLBHCDtv.js";import"./tslib.es6.OVu8nUpd.js";import"./useAsync.BNGWJ4SI.js";import"./utils.CppfKf37.js";import"./button.esm.BjDPQc3W.js";import"./index.bwOXJm1I.js";import"./shopping-cart.DIaI45RX.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=M("PackageOpen",[["path",{d:"M12 22v-9",key:"x3hkom"}],["path",{d:"M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",key:"2ntwy6"}],["path",{d:"M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",key:"1pmm1c"}],["path",{d:"M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",key:"12ttoo"}]]);function l(t){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(t)}function z(t,e){if(l(t)!=="object"||t===null)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var s=r.call(t,e);if(l(s)!=="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function C(t){var e=z(t,"string");return l(e)==="symbol"?e:String(e)}function L(t,e,r){return e=C(e),e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var V={root:function(e){var r=e.props;return y("p-skeleton p-component",{"p-skeleton-circle":r.shape==="circle","p-skeleton-none":r.animation==="none"})}},D=`
@layer primereact {
    .p-skeleton {
        position: relative;
        overflow: hidden;
    }
    
    .p-skeleton::after {
        content: "";
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
    }
    
    .p-skeleton-circle {
        border-radius: 50%;
    }
    
    .p-skeleton-none::after {
        animation: none;
    }
}

@keyframes p-skeleton-animation {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}
`,A={root:{position:"relative"}},p=R.extend({defaultProps:{__TYPE:"Skeleton",shape:"rectangle",size:null,width:"100%",height:"1rem",borderRadius:null,animation:"wave",style:null,className:null},css:{classes:V,inlineStyles:A,styles:D}});function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),r.push.apply(r,s)}return r}function h(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?f(Object(r),!0).forEach(function(s){L(t,s,r[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach(function(s){Object.defineProperty(t,s,Object.getOwnPropertyDescriptor(r,s))})}return t}var d=i.memo(i.forwardRef(function(t,e){var r=S(),s=i.useContext(N),o=p.getProps(t,s),c=p.setMetaData({props:o}),x=c.ptm,b=c.cx,g=c.sx,v=c.isUnstyled;E(p.css.styles,v,{name:"skeleton"});var u=i.useRef(null);i.useImperativeHandle(e,function(){return{props:o,getElement:function(){return u.current}}});var w=o.size?{width:o.size,height:o.size,borderRadius:o.borderRadius}:{width:o.width,height:o.height,borderRadius:o.borderRadius},j=r({ref:u,className:y(o.className,b("root")),style:h(h({},w),g("root")),"aria-hidden":!0},p.getOtherProps(o),x("root"));return i.createElement("div",j)}));d.displayName="Skeleton";function I({response:t}){const e=t?.data?.data??[],r=e.length>0;return n.jsx("div",{children:n.jsx(P,{modules:[O,k],navigation:r&&e.length>1,autoplay:r?{delay:3e3,disableOnInteraction:!1,pauseOnMouseEnter:!0}:!1,breakpoints:{320:{slidesPerView:1.2,spaceBetween:10},480:{slidesPerView:1.8,spaceBetween:14},768:{slidesPerView:2.6,spaceBetween:18},1024:{slidesPerView:3.5,spaceBetween:22},1280:{slidesPerView:4,spaceBetween:24}},loop:r&&e.length>4,watchOverflow:!0,className:`${a["offer-swiper"]} min-h-[300px]`,children:r?e.map(s=>n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.card,children:n.jsx(B,{product:s})})},s.id)):n.jsxs(n.Fragment,{children:[n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.skeletonCard,children:n.jsx(d,{width:"100%",height:"100%"})})}),n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.skeletonCard,children:n.jsx(d,{width:"100%",height:"100%"})})})]})})})}function X({text:t="منتجات"}){return n.jsxs("div",{className:"flex h-full min-h-72 w-full flex-col items-center justify-center gap-5 bg-slate-100 text-center",children:[n.jsx(_,{className:"h-16 w-16 text-gray-500"}),n.jsxs("span",{className:"text-2xl font-semibold text-gray-500",children:["عذراً، لم يتم العثور على ",n.jsx("span",{children:t})]})]})}function de({offerProducts:t}){const e={ok:!0,data:{data:t}};return t?.length?n.jsxs("div",{className:"container py-10",children:[n.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),n.jsx(I,{response:e})]}):n.jsxs("section",{className:"container py-10",id:"products",children:[n.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),n.jsx(X,{text:"عروض"})]})}export{de as default};
