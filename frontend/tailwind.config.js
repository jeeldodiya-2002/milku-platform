/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'milku-primary': '#1B9FDA',
        'milku-secondary': '#2C4B7C',
        'milku-accent': '#FBC31F',
        'milku-bg-cream': '#FDFBF7',
        'milku-burnt-orange': '#E8571A',
        'milku-pink': '#D86FA0',
        'milku-grass-green': '#3DBE2A',
        'milku-amber': '#D4A017',
        'milku-fresh-green': '#5DC917',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'hind': ['Hind Vadodara', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.1)',
        '4xl': '0 50px 100px -20px rgba(0, 0, 0, 0.15)',
        '5xl': '0 80px 150px -30px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
