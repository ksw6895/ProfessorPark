import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(241 245 249)",
        primary: "rgb(17 24 39)",
        danger: "rgb(220 38 38)",
        success: "rgb(5 150 105)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Pretendard", "Noto Sans KR", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
