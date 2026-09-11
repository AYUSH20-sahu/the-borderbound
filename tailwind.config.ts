import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090D",
        surface: {
          DEFAULT: "#0F1219",
          hover: "#171B26",
          active: "#1F2433",
        },
        borderbound: {
          crimson: "#E50914",
          "crimson-glow": "#FF2B36",
          amber: "#F59E0B",
          "amber-glow": "#FBBF24",
          steel: "#94A3B8",
          dark: "#050608",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "crimson-radial": "radial-gradient(circle at 50% 0%, rgba(229, 9, 20, 0.15) 0%, transparent 60%)",
        "amber-radial": "radial-gradient(circle at 50% 100%, rgba(245, 158, 11, 0.12) 0%, transparent 60%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        radarScan: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-slow": "pulseGlow 4s ease-in-out infinite",
        "radar-spin": "radarScan 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
