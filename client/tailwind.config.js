/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F152A',
        surface: '#1A2240',
        surfaceLight: '#2A3455',
        accent: '#82D1F5',
        gold: '#BCA164',
        text: '#FFFFFF',
        textMuted: '#A0A8C0'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}
