/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Playfair Display', 'serif'], // Adding a display font for elegance
      },
      colors: {
        background: '#f8fafc', // Light slate
        surface: '#ffffff',
        primary: '#4f46e5', // Indigo
        secondary: '#0ea5e9', // Sky
        accent: '#f43f5e', // Rose
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
