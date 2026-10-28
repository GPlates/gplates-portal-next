/** @type {import('tailwindcss').Config} */
// Tailwind is only used by the Paleomap Maker pages under src/app/map.
// Its directives live in src/app/map/styles/global.css, so the rest of the
// portal is unaffected.
module.exports = {
  content: ['./src/app/map/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
