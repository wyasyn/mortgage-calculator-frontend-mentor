/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-sans)",
      },
      colors: {
        accent: "hsl(var(--accent))",
        danger: "hsl(var(--danger))",
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [],
};
