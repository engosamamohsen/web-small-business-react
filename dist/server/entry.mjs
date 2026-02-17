import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BuKLVcaK.mjs';
import { manifest } from './manifest_DNezMWgk.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/api/vitals.astro.mjs');
const _page4 = () => import('./pages/auth/forgot-password.astro.mjs');
const _page5 = () => import('./pages/auth/login.astro.mjs');
const _page6 = () => import('./pages/auth/register.astro.mjs');
const _page7 = () => import('./pages/shop/cart.astro.mjs');
const _page8 = () => import('./pages/shop/checkout.astro.mjs');
const _page9 = () => import('./pages/shop/products/_id_.astro.mjs');
const _page10 = () => import('./pages/user/profile.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["src/pages/api/vitals.ts", _page3],
    ["src/pages/auth/forgot-password.astro", _page4],
    ["src/pages/auth/login.astro", _page5],
    ["src/pages/auth/register.astro", _page6],
    ["src/pages/shop/cart.astro", _page7],
    ["src/pages/shop/checkout.astro", _page8],
    ["src/pages/shop/products/[id].astro", _page9],
    ["src/pages/user/profile.astro", _page10],
    ["src/pages/index.astro", _page11]
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
    "client": "file:///F:/react%20js%20projects/kamal/web-small-business-react/dist/client/",
    "server": "file:///F:/react%20js%20projects/kamal/web-small-business-react/dist/server/",
    "host": true,
    "port": 3000,
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
