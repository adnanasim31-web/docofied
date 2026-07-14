import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf6f5",
          100: "#cfe9e7",
          200: "#a3d6d1",
          300: "#72beb7",
          400: "#469f97",
          500: "#0f766e",
          600: "#0c5f59",
          700: "#0a4a50",
          800: "#083a3f",
          900: "#062b2f",
        },
        ink: {
          DEFAULT: "#12211f",
          muted: "#5b6b69",
          faint: "#8a9997",
        },
        surface: {
          DEFAULT: "#ffffff",
          sunk: "#f5f8f7",
        },
        line: "#e3ebe9",
        accent: {
          DEFAULT: "#2f9e7e",
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        "card-lg": "20px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(18, 33, 31, 0.06), 0 1px 2px rgba(18, 33, 31, 0.04)",
        card: "0 4px 16px rgba(18, 33, 31, 0.08)",
        lift: "0 12px 32px rgba(18, 33, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
