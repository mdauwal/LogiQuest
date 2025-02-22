/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        prompt: ["font-prompt", "sans-serif"],
      },
      backgroundColor:{
        whychoseus:' rgba(3, 51, 48, 1)'
      }
    },
  },
  plugins: [],
};
