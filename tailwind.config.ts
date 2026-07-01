import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C8102E",
          "red-hover": "#E01030",
        },
        /* Tokens semânticos — resolvem para CSS vars */
        c: {
          bg:       "var(--c-bg)",
          "bg-alt": "var(--c-bg-alt)",
          raised:   "var(--c-raised)",
          surface:  "var(--c-surface)",
          surface2: "var(--c-surface2)",
          border:   "var(--c-border)",
          border2:  "var(--c-border2)",
          border3:  "var(--c-border3)",
          text:     "var(--c-text)",
          text2:    "var(--c-text2)",
          text3:    "var(--c-text3)",
          text4:    "var(--c-text4)",
          inv:      "var(--c-inv)",
        },
      },
      fontFamily: {
        display:   ["var(--font-bebas)", "sans-serif"],
        condensed: ["var(--font-barlow-condensed)", "sans-serif"],
        sans:      ["var(--font-barlow)", "sans-serif"],
      },
      backgroundImage: {
        "speed-lines": "repeating-linear-gradient(105deg, transparent, transparent 2px, rgba(200,16,46,0.04) 2px, rgba(200,16,46,0.04) 4px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16,24,40,0.04), 0 12px 32px -16px rgba(16,24,40,0.16)",
        "card-hover": "0 2px 8px -2px rgba(16,24,40,0.10), 0 28px 56px -24px rgba(16,24,40,0.28)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
