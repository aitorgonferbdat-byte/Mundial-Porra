/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#05070A',
        surface: '#0D121F',
        surfaceLight: '#1A2333',
        accent: '#00F5FF', // Electric Cyan (Official 2026 feel)
        secondary: '#FF0080', // Vibrant Pink
        gold: '#FFD700',
        text: '#FFFFFF',
        textMuted: '#94A3B8'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'gradient-2026': 'linear-gradient(135deg, #00F5FF 0%, #FF0080 100%)',
      }
    },
  },
  plugins: [],
}
