import { jsxs, jsx } from 'react/jsx-runtime';
import { c as cn } from './package_CJwS4JJH.mjs';

function PageLoader({ text, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" }) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 text-2xl font-bold", children: text })
      ]
    }
  );
}

export { PageLoader as P };
