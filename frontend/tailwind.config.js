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
          50: '#eef7fd',
          100: '#d5ecfa',
          200: '#b3ddf5',
          300: '#7fc8ef',
          400: '#4aafe6',
          500: '#017EB7',
          600: '#016ea3',
          700: '#015a87',
          800: '#004665',
          900: '#003a52',
          950: '#002b3d',
        },
        gold: {
          50: '#fcf8ef',
          100: '#f7edd7',
          200: '#efdbb0',
          300: '#e5c784',
          400: '#D8B364',
          500: '#c9a456',
          600: '#BA9A55',
          700: '#9d7e44',
          800: '#826837',
          900: '#6b552d',
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
        'gradient-x': 'gradientX 3s ease infinite',
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
          '0%': { boxShadow: '0 0 20px rgba(1,126,183,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(1,126,183,0.6)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',

      },
    },
  },
  plugins: [],
}
