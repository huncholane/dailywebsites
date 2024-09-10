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
        primary: "var(--primary-color)",
        "primary-light": "var(--primary-color-light)",
        "primary-dark": "var(--primary-color-dark)",
        secondary: "var(--secondary-color)",
        "secondary-light": "var(--secondary-color-light)",
        "secondary-dark": "var(--secondary-color-dark)",
        accent: "var(--accent-color)",
        "accent-light": "var(--accent-color-light)",
        "accent-dark": "var(--accent-color-dark)",
        background: "var(--background-color)",
        "background-light": "var(--background-color-light)",
        "background-dark": "var(--background-color-dark)",
        text: "var(--text-color)",
        "text-light": "var(--text-color-light)",
        "text-dark": "var(--text-color-dark)",
        border: "var(--border-color)",
        "border-light": "var(--border-color-light)",
        "border-dark": "var(--border-color-dark)",
      },
    },
  },
  plugins: [],
};
export default config;
