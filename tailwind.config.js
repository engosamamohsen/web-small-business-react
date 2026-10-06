/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    // Status pill colours live here (orders list and order page).
    "./src/lib/order-status.ts",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {},
  },
  plugins: [],
};
