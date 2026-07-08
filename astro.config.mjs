import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://cashierthru.com',  // base domain, not a specific tenant
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      config: { path: './tailwind.config.js' }
    }),
    // NOTE: the build-time @astrojs/sitemap integration was removed — it
    // hardcoded `site` (cashierthru.com) and only knew static routes, so it
    // could not produce a correct per-tenant sitemap. The storefront is
    // multi-tenant SSR, so the sitemap is generated on demand instead at
    // src/pages/sitemap.xml.ts (and robots.txt at src/pages/robots.txt.ts),
    // resolving each tenant's host + catalogue per request.
    //
    // NOTE: @astrojs/partytown was removed too — it only existed to run
    // Google Analytics in a web worker, but Partytown is unreliable for GA4
    // Realtime/DebugView. gtag now loads on the main thread directly
    // (src/components/Analytics.astro).
  ],

  image: {
    // No hardcoded domains needed — wildcard remotePatterns covers all tenants
    remotePatterns: [
      { protocol: 'https', hostname: '*.cashierthru.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'staging.fawaterk.com' }
    ]
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['primereact', 'primeicons']
          }
        }
      }
    },
    ssr: {
      noExternal: ['primereact', 'react-use']
    }
  },

  server: {
    port: 3000,
    host: true
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap'
  },

  trailingSlash: 'never',
  compressHTML: true
});
