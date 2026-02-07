/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/pages/**/*.{astro,js,jsx,ts,tsx}',
    './src/components/**/*.{astro,js,jsx,ts,tsx}',
    './src/layouts/**/*.{astro,js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        'main-color': 'var(--main-color)',
        'second-color': 'var(--second-color)',
        'main-bg': 'var(--main-background)',
        'second-bg': 'var(--second-background)',
        'font-color': 'var(--font-color)',
        'second-font': 'var(--second-font-color)',
      },
    },
  },
  plugins: [],
};
