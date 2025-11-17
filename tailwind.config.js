/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        's': '0 1px 2px rgba(0,0,0,0.19), 0 1px 2px rgba(0,0,0,0.12)',
        'm': '0 2px 4px rgba(0,0,0,0.19), 0 4px 8px rgba(0,0,0,0.08)',
        'l': '0 4px 6px rgba(0,0,0,0.19), 0 6px 10px rgba(0,0,0,0.08)',
      },
      colors: {
        primary: '#FF6F61',    // used in globals.css (e.g., .cart-badge, etc.)#ff6370
        'dark-100': '#020f10', // used in globals.css (e.g., .cart-btn)
      },
      fontFamily: {
        'malika': ['Malika'],
        'quicksand': ['Quicksand-Regular'],
        'quicksand-medium': ['Quicksand-Medium'],
        'quicksand-semibold': ['Quicksand-SemiBold'],
        'quicksand-bold': ['Quicksand-Bold'],
        'quicksand-light': ['Quicksand-Light'],
        'gilmer-bold': ['Gilmer-Bold'],
        'gilmer-regular': ['Gilmer-Regular'],
        'gilmer-light': ['Gilmer-Light'],
        'gilmer-thin': ['Gilmer-Thin'],
        // Gilroy fonts - making Gilroy the default
        'sans': ['Gilroy-Regular'], // Default sans-serif font
        'gilroy': ['Gilroy-Regular'],
        'gilroy-light': ['Gilroy-Light'],
        'gilroy-medium': ['Gilroy-Medium'],
        'gilroy-semibold': ['Gilroy-SemiBold'],
        'gilroy-bold': ['Gilroy-Bold'],
        'gilroy-heavy': ['Gilroy-Heavy'],
        'dubai-regular': ['Dubai-Regular'],
      },

    },
  },
  plugins: [],
}