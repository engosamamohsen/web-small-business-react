import{j as n}from"./jsx-runtime.D_zvdyIk.js";import{S as P,N as k,d as m}from"./navigation.CwYd0QJM.js";import{A as O}from"./autoplay.COJ-kdM1.js";import{r as i}from"./index.DeO6U63H.js";import{u as N,P as S,a as E,c as y,C as R}from"./componentbase.esm.Bo6LrbGa.js";/* empty css                       */import{a}from"./index.95d291e9.mnxXm8yi.js";import{P as B}from"./Product.jR2CQ4-k.js";import{c as M}from"./createLucideIcon.DOjnmvXn.js";import"./Image.DxnKgFI2.js";import"./Link.LUfrTP7n.js";import"./cart.DEkW6IdV.js";import"./navigation.C6XGOaB_.js";import"./_astro-entry_react-toastify.CWO7AusI.js";import"./clsx.B-dksMZM.js";import"./js.cookie.Cz0CWeBA.js";import"./index.Dnh8JpYh.js";import"./providers.C1Sdikbx.js";import"./useAsyncRetry.N2y_0m_V.js";import"./tslib.es6.OVu8nUpd.js";import"./useAsync.BGB4N29Q.js";import"./utils.DwpzfNRW.js";import"./button.esm.DgV_rF-L.js";import"./tooltip.esm.sEuXq4xx.js";import"./index.DrlE4MoQ.js";import"./shopping-cart.D3F1cnrI.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=M("PackageOpen",[["path",{d:"M12 22v-9",key:"x3hkom"}],["path",{d:"M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",key:"2ntwy6"}],["path",{d:"M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",key:"1pmm1c"}],["path",{d:"M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",key:"12ttoo"}]]);function l(t){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(t)}function C(t,e){if(l(t)!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var s=r.call(t,e);if(l(s)!="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function L(t){var e=C(t,"string");return l(e)=="symbol"?e:e+""}function V(t,e,r){return(e=L(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var _={root:function(e){var r=e.props;return y("p-skeleton p-component",{"p-skeleton-circle":r.shape==="circle","p-skeleton-none":r.animation==="none"})}},D=`
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
`,A={root:{position:"relative"}},p=R.extend({defaultProps:{__TYPE:"Skeleton",shape:"rectangle",size:null,width:"100%",height:"1rem",borderRadius:null,animation:"wave",style:null,className:null},css:{classes:_,inlineStyles:A,styles:D}});function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),r.push.apply(r,s)}return r}function h(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?f(Object(r),!0).forEach(function(s){V(t,s,r[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach(function(s){Object.defineProperty(t,s,Object.getOwnPropertyDescriptor(r,s))})}return t}var u=i.memo(i.forwardRef(function(t,e){var r=N(),s=i.useContext(S),o=p.getProps(t,s),c=p.setMetaData({props:o}),x=c.ptm,b=c.cx,v=c.sx,g=c.isUnstyled;E(p.css.styles,g,{name:"skeleton"});var d=i.useRef(null);i.useImperativeHandle(e,function(){return{props:o,getElement:function(){return d.current}}});var j=o.size?{width:o.size,height:o.size,borderRadius:o.borderRadius}:{width:o.width,height:o.height,borderRadius:o.borderRadius},w=r({ref:d,className:y(o.className,b("root")),style:h(h({},j),v("root")),"aria-hidden":!0},p.getOtherProps(o),x("root"));return i.createElement("div",w)}));u.displayName="Skeleton";function I({response:t}){const e=t?.data?.data??[],r=e.length>0;return n.jsx("div",{children:n.jsx(P,{modules:[k,O],navigation:r&&e.length>1,autoplay:r?{delay:3e3,disableOnInteraction:!1,pauseOnMouseEnter:!0}:!1,breakpoints:{320:{slidesPerView:1.2,spaceBetween:10},480:{slidesPerView:1.8,spaceBetween:14},768:{slidesPerView:2.6,spaceBetween:18},1024:{slidesPerView:3.5,spaceBetween:22},1280:{slidesPerView:4,spaceBetween:24}},loop:r&&e.length>4,watchOverflow:!0,className:`${a["offer-swiper"]} min-h-[300px]`,children:r?e.map(s=>n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.card,children:n.jsx(B,{product:s})})},s.id)):n.jsxs(n.Fragment,{children:[n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.skeletonCard,children:n.jsx(u,{width:"100%",height:"100%"})})}),n.jsx(m,{className:a.slide,children:n.jsx("div",{className:a.skeletonCard,children:n.jsx(u,{width:"100%",height:"100%"})})})]})})})}function X({text:t="منتجات"}){return n.jsxs("div",{className:"flex h-full min-h-72 w-full flex-col items-center justify-center gap-5 bg-slate-100 text-center",children:[n.jsx(z,{className:"h-16 w-16 text-gray-500"}),n.jsxs("span",{className:"text-2xl font-semibold text-gray-500",children:["عذراً، لم يتم العثور على ",n.jsx("span",{children:t})]})]})}function fe({offerProducts:t}){const e={ok:!0,data:{data:t}};return t?.length?n.jsxs("div",{className:"container py-10",children:[n.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),n.jsx(I,{response:e})]}):n.jsxs("section",{className:"container py-10",id:"products",children:[n.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),n.jsx(X,{text:"عروض"})]})}export{fe as default};
