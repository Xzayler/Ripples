/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        faint: "var(--color-faint)",
        highlight: "var(--color-highlight)",
        highlightextra: "var(--color-highlightextra)",
        ui: "var(--color-divider)",
      },
      fontSize: {
        md: "15px",
      },
    },
    fontFamily: {
      main: "var(--font-family)",
    },
  },
  plugins: [],
};
