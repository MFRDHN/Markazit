/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Tosca light
          600: '#0d9488',
          700: '#0f766e', // Tosca dark
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        gold: {
          50: '#fef9eb',
          100: '#fdf0c8',
          200: '#fbe08d',
          300: '#f9cc52',
          400: '#f7b731',
          500: '#e8a317',
          600: '#cc7e0f',
          700: '#a95b10',
          800: '#8a4814',
          900: '#723b14',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c4c6cb',
          300: '#9fa2a9',
          400: '#7b7f88',
          500: '#60646e',
          600: '#4c4f57',
          700: '#3e4047',
          800: '#2a2c31',
          900: '#1a1b1f',
          950: '#111215',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F4F1E1',
          200: '#EAE5D9',
          300: '#DFD8C8',
          400: '#C4BCA8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(45,138,78,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(45,138,78,0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'islamic-pattern': "url('https://www.transparenttextures.com/patterns/arabesque.png')",
      },
    },
  },
  plugins: [],
}
