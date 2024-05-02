/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx,js}"
  ],
  theme: {
    extend: {},
    screens: {
      "lg": "550px",
      "sm": "100px",
    },
    fontFamily: {
      "nothing": ["Nothing", "Arial", "sans-serif"]
    }
  },
  plugins: [],
}

