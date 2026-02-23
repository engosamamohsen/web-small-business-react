import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://admin-osama.cashierthru.com',
  output: 'static', // SSG by default, SSR on-demand
  adapter: node({ mode: 'standalone' }),

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Use custom global styles
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

  // Image optimization
  image: {
    domains: ['admin-osama.cashierthru.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.cashierthru.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'staging.fawaterk.com' }
    ]
  },

  // Build optimizations
  build: {
    inlineStylesheets: 'auto', // Critical for LCP improvement
    assets: '_astro'
  },

  // Vite configuration
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

  // Dev server
  server: {
    port: 3000,
    host: true
  },

  // Prefetch strategy
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap'
  },

  // Clean URLs
  trailingSlash: 'never',

  // Compression
  compressHTML: true
});
