import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Site URL - required for sitemap generation
  site: process.env.PUBLIC_SITE_URL || 'https://example.com',

  // Output mode: 'static' for full SSG, 'server' for SSR, 'hybrid' for mixed
  output: 'hybrid',
  // output: 'static',

  // Node adapter for SSR
  adapter: node({
    mode: 'standalone',
  }),

  integrations: [
    // React integration for interactive islands
    react(),

    // TailwindCSS for styling
    tailwind({
      // Apply Tailwind's base styles
      applyBaseStyles: true,
    }),

    // Sitemap generation - temporarily disabled due to build issue
    // sitemap({
    //   filter: (page) => !page.includes('/admin/') && !page.includes('/profile/'),
    //   changefreq: 'daily',
    //   priority: 0.7,
    //   lastmod: new Date(),
    //   i18n: {
    //     defaultLocale: 'ar',
    //     locales: {
    //       ar: 'ar-SA',
    //     },
    //   },
    // }),
  ],

  // Vite configuration
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@hooks': '/src/hooks',
        '@lib': '/src/lib',
        '@utils': '/src/utils',
        '@types': '/src/types',
        '@stores': '/src/stores',
      },
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'jotai', 'zustand'],
    },
  },

  // Image optimization configuration
  image: {
    // Remote image domains
    domains: [
      'source.unsplash.com',
      'emend.cashierthru.com',
      'cdn.pixabay.com',
      'staging.fawaterk.com',
      'i.ibb.co',
    ],
    // Service configuration
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Prefetch configuration for better performance
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },

  // Server configuration
  server: {
    port: 4321,
    host: true,
  },

  // Build optimization
  build: {
    // Inline small assets
    inlineStylesheets: 'auto',
  },

  // Experimental features
  experimental: {
    // Enable client-side routing for smoother transitions
    clientPrerender: true,
  },
});
