import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
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
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize: (item) => item
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
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
