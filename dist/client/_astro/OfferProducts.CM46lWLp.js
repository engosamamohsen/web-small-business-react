import{j as e}from"./jsx-runtime.BjG_zV1W.js";import{S as s,a as o}from"./create-element-if-not-defined.BHsYGO9r.js";import{N as t}from"./navigation.Bfz8aOKn.js";import{A as a}from"./autoplay.B2gTXv05.js";/* empty css                       *//* empty css                       */import{P as n}from"./ProductCard.C7poiD7Y.js";import"./index.Baz2VbZ6.js";import"./js.cookie.Cz0CWeBA.js";import"./index.BtA5d64W.js";import"./clsx.B-dksMZM.js";import"./fetch-hook.Ct8ryMjM.js";import"./cart.33BLe1s1.js";import"./createLucideIcon.Bd5lDQu6.js";import"./loader-circle.bquFQ8Sq.js";import"./shopping-cart.BwXvVBHN.js";function P({products:r}){return!r||r.length===0?e.jsxs("section",{className:"container py-10",children:[e.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),e.jsx("div",{className:"flex min-h-[200px] items-center justify-center rounded-lg bg-gray-100",children:e.jsx("p",{className:"text-gray-500",children:"لا توجد عروض حالياً"})})]}):e.jsxs("section",{className:"container py-10",children:[e.jsx("h2",{className:"mb-8 text-2xl font-bold",children:"العروض"}),e.jsx("div",{className:"offer-swiper-container",children:e.jsx(s,{modules:[t,a],navigation:!0,autoplay:{delay:3e3,disableOnInteraction:!1},breakpoints:{320:{slidesPerView:1.4,spaceBetween:10},480:{slidesPerView:2.4,spaceBetween:15},768:{slidesPerView:3.4,spaceBetween:20},1024:{slidesPerView:4.5,spaceBetween:26}},loop:r.length>4,className:"offer-swiper min-h-[300px]",children:r.map(i=>e.jsx(o,{className:"py-4",children:e.jsx("div",{className:"group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg",children:e.jsx(n,{product:i})})},i.id))})}),e.jsx("style",{children:`
        .offer-swiper .swiper-button-next,
        .offer-swiper .swiper-button-prev {
          color: var(--main-color);
          background: white;
          padding: 24px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .offer-swiper .swiper-button-next:after,
        .offer-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
      `})]})}export{P as default};
