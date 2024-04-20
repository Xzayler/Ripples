/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/routes/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        faint: "rgb(var(--color-faint) / <alpha-value>)",
        highlight: "rgb(var(--color-highlight) / <alpha-value>)",
        highlightextra: "rgb(var(--color-highlightextra) / <alpha-value>)",
        ui: "rgb(var(--color-divider) / <alpha-value>)",
        like: "rgb(var(--color-like) / <alpha-value>)",
        repost: "rgb(var(--color-repost) / <alpha-value>)",
        comment: "rgb(var(--color-comment) / <alpha-value>)",
      },
      fontSize: {
        md: ["0.9375/* 15px */", "1.175/* 22px */"],
      },
    },
    fontFamily: {
      main: "var(--font-family)",
    },
  },
  plugins: [],
};
