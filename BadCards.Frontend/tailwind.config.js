/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        default: "#09090b",
        secondary: "#191A1A",
        background: "#121214",
      },
    },
  },
  plugins: [],
  safelist: [
    "border-blue-600",
    "border-orange-600",
    "border-purple-600",
    "grid-cols-[minmax(150px,_250px)_1fr]",
  ],
};
