/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#ff6370',    // used in globals.css (e.g., .cart-badge, etc.)
        'dark-100': '#020f10', // used in globals.css (e.g., .cart-btn)
      },
      fontFamily: {
        'quicksand': ['Quicksand-Regular'],
        'quicksand-medium': ['Quicksand-Medium'],
        'quicksand-semibold': ['Quicksand-SemiBold'],
        'quicksand-bold': ['Quicksand-Bold'],
        'quicksand-light': ['Quicksand-Light'],
      },
    },
  },
  plugins: [],
}