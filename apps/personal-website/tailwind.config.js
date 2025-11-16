import { colorTokens } from "../../packages/ui-theme/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: Object.entries(colorTokens).reduce((acc, [key, value]) => {
        acc[key] = {
          light: value.light,
          DEFAULT: value.light,
          dark: value.dark,
        };
        return acc;
      }, {}),
    },
  },
  plugins: [],
};