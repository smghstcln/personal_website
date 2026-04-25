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
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        ink: '#0a0e1a',
        paper: '#fafaf7',
        background: '#f6f6f1',
        surface: '#ffffff',
        primary: '#4f46e5',
        secondary: '#0ea5e9',
        accent: '#f43f5e',
        line: '#e7e5dc',
        text: {
          primary: '#0a0e1a',
          secondary: '#475569',
          muted: '#94a3b8'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 60s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
