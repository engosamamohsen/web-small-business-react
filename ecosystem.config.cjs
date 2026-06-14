// pm2 process definition for the Astro SSR server (multi-tenant storefront).
//
//   pm2 start ecosystem.config.cjs     # first time
//   pm2 reload ecosystem.config.cjs    # after a rebuild (npm run build)
//   pm2 save                           # persist across reboots
//
// Runs the standalone Node server built by @astrojs/node (mode: 'standalone').
// This serves the on-demand SSR routes (product pages, the dynamic per-tenant
// middleware, etc.) AND the static assets. We run the built entry directly
// instead of `astro preview`, which is a dev-preview tool, not a production
// server.
//
// HOST/PORT must match the `proxy_pass` target in deploy/nginx/cashierthru.conf.
module.exports = {
  apps: [
    {
      name: "shop",
      script: "./dist/server/entry.mjs",
      instances: 1,
      exec_mode: "fork",
      env: {
        HOST: "127.0.0.1",
        PORT: "3000",
      },
    },
  ],
};
