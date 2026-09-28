import type { Config } from "tailwindcss";

const neutralScale = {
  50: "#F5F5F5",   // Secondary BG / Hover
  100: "#E5E5E5",  // Border / Divider / Active
  200: "#E5E5E5",  // Border
  300: "#D4D4D4",  // Secondary Border / Inactive / Focus
  400: "#737373",  // Muted Text
  500: "#737373",  // Muted Text
  600: "#404040",  // Secondary Text
  700: "#404040",  // Secondary Text
  800: "#262626",  // Dark Neutral / Border
  900: "#111111",  // Primary Text / Primary Button
  950: "#0A0A0A",  // Deep Black
  DEFAULT: "#111111",
};

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        transparent: "transparent",
        current: "currentColor",

        primary: {
          DEFAULT: "#111111",
          text: "#111111",
        },
        secondary: {
          DEFAULT: "#404040",
          text: "#404040",
          border: "#D4D4D4",
        },
        muted: {
          DEFAULT: "#737373",
          text: "#737373",
        },
        systemNavy: "#111111",

        // Map every color palette to pure monochrome White / Black / Gray
        slate: neutralScale,
        gray: neutralScale,
        zinc: neutralScale,
        neutral: neutralScale,
        stone: neutralScale,

        blue: neutralScale,
        emerald: neutralScale,
        green: neutralScale,
        purple: neutralScale,
        indigo: neutralScale,
        amber: neutralScale,
        orange: neutralScale,
        red: neutralScale,
        cyan: neutralScale,
        teal: neutralScale,
        sky: neutralScale,
        violet: neutralScale,
        yellow: neutralScale,
        rose: neutralScale,
        fuchsia: neutralScale,
        pink: neutralScale,

        advisor: neutralScale,
        manager: neutralScale,
        admin: neutralScale,

        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5F5F5",
          card: "#FFFFFF",
          border: "#E5E5E5",
        }
      },
      borderRadius: {
        card: "14px",
        xl: "12px",
        "2xl": "16px"
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        float: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }
    }
  },
  plugins: []
} satisfies Config;
