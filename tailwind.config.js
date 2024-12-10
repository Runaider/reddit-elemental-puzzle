/** @type {import('tailwindcss').Config} */
export default {
  content: ["./game/index.html", "./game/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "pastel-green": "#E0E5B6",
        "pastel-red": "#F7A4A4",
        "custom-main-text": "#262626",
        "custom-bg": "#fcf7e9",
        "custom-cell": "#F1E5D1",
        "custom-active": "#f7e9d1",
        "custom-border": "#6e6d6a",
        "custom-muted": "#e4dcc8",
        "custom-muted-dark": "#d3ccb9",
      },
      screens: {
        xxs: "420px",
      },
    },
  },
  plugins: [],
  safelist: [
    "top-[254px]",
    "left-[182px]",
    // Add other dynamic classes here
  ],
  darkMode: "class",
};
