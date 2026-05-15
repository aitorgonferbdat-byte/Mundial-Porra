/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        navy: '#0A2551',
        'vibrant-red': '#E12C2C',
        emerald: '#00703B',
        surface: '#FFFFFF',
        surfaceLight: '#F8FAFC',
        text: '#0A2551',
        textMuted: '#64748B'
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-2026': 'linear-gradient(135deg, #0A2551 0%, #E12C2C 100%)',
        'pattern-2026': "url('https://www.fifa.com/static-assets/fifacom/images/identity/fwc2026/background-pattern.png')", // Placeholder if needed
      }
    },
  },
  plugins: [],
}
