/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#e782a0',    // used in globals.css (e.g., .cart-badge, etc.)
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