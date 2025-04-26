/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ludo-red': '#e63946',
        'ludo-blue': '#457b9d',
        'ludo-green': '#4caf50',
        'ludo-yellow': '#ffca28',
        'ludo-board': '#f1faee',
      },
      backgroundImage: {
        'ludo-pattern': "url('./assets/ludo-pattern.jpg')",
      },
      boxShadow: {
        'ludo': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'ludo': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}