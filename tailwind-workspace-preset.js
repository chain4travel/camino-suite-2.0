// tailwind-workspace-preset.js
const { colors, fontFamily, gradients } = require('./libs/styles/src');

module.exports = {
  mode: 'jit',
  darkMode: 'class', // Use class-based dark mode
  content: [
    './apps/**/*.{js,ts,jsx,tsx}',
    './libs/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: colors,
      backgroundImage: gradients,
      fontFamily: fontFamily,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
