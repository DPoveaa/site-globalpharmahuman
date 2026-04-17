import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f9f8",
          100: "#d9f0ee",
          200: "#b3e0dc",
          300: "#8dcfca",
          400: "#5cb4ae",
          500: "#279992",
          600: "#1c7b76",
          700: "#145d5a",
          800: "#0e403d",
          900: "#082423"
        },
        accent: {
          500: "#f89f1a",
          600: "#e18905"
        }
      }
    }
  },
  plugins: []
};

export default config;

