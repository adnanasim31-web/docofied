import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#123B33",
          light: "#1C4A40",
          dark: "#0E2E2A",
        },
        accent: {
          50: "#E8F5EC",
          100: "#cdead9",
          400: "#3DBE6B",
          500: "#3DBE6B",
          600: "#2FA65A",
          DEFAULT: "#3DBE6B",
          hover: "#2FA65A",
          tint: "#E8F5EC",
        },
        ink: {
          DEFAULT: "#1E2A28",
          muted: "#4d5c59",
          faint: "#7c8c89",
        },
        mint: {
          DEFAULT: "#CDE8D8",
        },
        surface: {
          DEFAULT: "#ffffff",
          sunk: "#F4F7F5",
          page: "#EDEDE8",
        },
        line: "#E2ECE7",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
        panel: "28px",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #1E7A6A 0%, #3DBE6B 100%)",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(18, 40, 34, 0.06), 0 1px 2px rgba(18, 40, 34, 0.04)",
        card: "0 8px 24px rgba(18, 40, 34, 0.08)",
        lift: "0 16px 40px rgba(18, 40, 34, 0.14)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
