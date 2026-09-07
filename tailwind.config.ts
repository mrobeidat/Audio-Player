import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        bar: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "90px" },
        },
      },
      animation: {
        marquee: "marquee 9s linear infinite",
        bar: "bar 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
