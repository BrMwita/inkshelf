/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#1A1A1A',
          800: '#2D2D2D',
          700: '#404040',
          100: '#FDF8F0',
        },
        amber: {
          500: '#D96C2B',
          600: '#C45A1F',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}