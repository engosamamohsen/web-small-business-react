import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D2njOUin.mjs';
import { manifest } from './manifest_CljtsVms.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/api/vitals.astro.mjs');
const _page4 = () => import('./pages/auth/forgot-password.astro.mjs');
const _page5 = () => import('./pages/auth/login.astro.mjs');
const _page6 = () => import('./pages/auth/register.astro.mjs');
const _page7 = () => import('./pages/order/_id_.astro.mjs');
const _page8 = () => import('./pages/products/_slug_.astro.mjs');
const _page9 = () => import('./pages/shop/cart.astro.mjs');
const _page10 = () => import('./pages/shop/checkout.astro.mjs');
const _page11 = () => import('./pages/user/orders.astro.mjs');
const _page12 = () => import('./pages/user/profile.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["src/pages/api/vitals.ts", _page3],
    ["src/pages/auth/forgot-password.astro", _page4],
    ["src/pages/auth/login.astro", _page5],
    ["src/pages/auth/register.astro", _page6],
    ["src/pages/order/[id].astro", _page7],
    ["src/pages/products/[slug].astro", _page8],
    ["src/pages/shop/cart.astro", _page9],
    ["src/pages/shop/checkout.astro", _page10],
    ["src/pages/user/orders.astro", _page11],
    ["src/pages/user/profile.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///F:/react%20js%20projects/kamal/web-small-business-react/dist/client/",
    "server": "file:///F:/react%20js%20projects/kamal/web-small-business-react/dist/server/",
    "host": true,
    "port": 3000,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
