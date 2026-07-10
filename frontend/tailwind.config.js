/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101322",
        paper: "#F7F5F1",
        brass: "#B08A3E",
        moss: "#3E5641",
        clay: "#9C4A3C",
        mist: "#E7E3DA",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        panel: "0 30px 60px -25px rgba(16, 19, 34, 0.35)",
      },
    },
  },
  plugins: [],
};
