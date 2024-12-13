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
      boxShadow: {
        "custom-inner": "inset 0px 0px 0px 2px rgba(0, 0, 0, 0.25)",
        "custom-inner-highlight":
          "inset 1px 1px 1px rgba(255, 255, 255, 0.6), inset -1px -1px 1px rgba(0, 0, 0, 0.2);",
        "custom-inner-highlight-hover":
          "inset 2px 2px 3px rgba(255, 255, 255, 0.8), inset -2px -2px 3px rgba(0, 0, 0, 0.3);",
      },
      keyframes: {
        scaleUpDown: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "75%": { transform: "scale(1.2)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        scaleUpDown: "scaleUpDown 0.3s ease-in-out",
        shake: "shake 0.5s ease-in-out",
        fadeIn: "fadeIn 0.5s ease-in-out",
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
