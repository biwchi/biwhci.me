import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: {
        text: "var(--color-text)",
        "text-80": "var(--color-text-80)",
        background: "var(--color-background)",
      },
    },
  },
  plugins: [],
};
export default config;
