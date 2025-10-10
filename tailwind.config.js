// Add this to your existing tailwind.config.js
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
        primary: '#ff6370',    // used in globals.css (e.g., .cart-badge, etc.)
        'dark-100': '#020f10', // used in globals.css (e.g., .cart-btn)
      },
      fontFamily: {
        'malika': ['Malika'],
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