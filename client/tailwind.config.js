/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#041c14',
        navy: '#0A2551',
        'vibrant-red': '#E12C2C',
        emerald: '#00703B',
        'pitch-dark': '#041c14',
        'pitch-green': '#0a2e20',
        'brand-yellow': '#f6e05e',
        'brand-green': '#22c55e',
        surface: '#0a2e20',
        text: '#FFFFFF',
        textMuted: '#a0aec0'
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
