import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BN6bZST5.mjs';
import { manifest } from './manifest_BtG4Pvj8.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/admin/payment/transactions.astro.mjs');
const _page4 = () => import('./pages/cart.astro.mjs');
const _page5 = () => import('./pages/checkout.astro.mjs');
const _page6 = () => import('./pages/forgot-password/_email_/reset.astro.mjs');
const _page7 = () => import('./pages/forgot-password/_email_.astro.mjs');
const _page8 = () => import('./pages/forgot-password.astro.mjs');
const _page9 = () => import('./pages/login.astro.mjs');
const _page10 = () => import('./pages/order/_order_id_.astro.mjs');
const _page11 = () => import('./pages/order.astro.mjs');
const _page12 = () => import('./pages/products/_product_id_.astro.mjs');
const _page13 = () => import('./pages/profile/edit.astro.mjs');
const _page14 = () => import('./pages/profile.astro.mjs');
const _page15 = () => import('./pages/register.astro.mjs');
const _page16 = () => import('./pages/verify/_email_.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["src/pages/admin/payment/transactions.astro", _page3],
    ["src/pages/cart.astro", _page4],
    ["src/pages/checkout.astro", _page5],
    ["src/pages/forgot-password/[email]/reset.astro", _page6],
    ["src/pages/forgot-password/[email].astro", _page7],
    ["src/pages/forgot-password/index.astro", _page8],
    ["src/pages/login.astro", _page9],
    ["src/pages/order/[order_id].astro", _page10],
    ["src/pages/order/index.astro", _page11],
    ["src/pages/products/[product_id].astro", _page12],
    ["src/pages/profile/edit.astro", _page13],
    ["src/pages/profile/index.astro", _page14],
    ["src/pages/register.astro", _page15],
    ["src/pages/verify/[email].astro", _page16],
    ["src/pages/index.astro", _page17]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///F:/react%20js%20projects/web-small-business-react/dist/client/",
    "server": "file:///F:/react%20js%20projects/web-small-business-react/dist/server/",
    "host": true,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
