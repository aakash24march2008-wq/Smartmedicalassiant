/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vc: {
          blue: '#1E5AA8',
          sky: '#4DA6E8',
          red: '#D32F45',
          navy: '#1B2A49',
          gray: '#F5F7FA',
          'blue-dark': '#164080',
          'blue-light': '#E8F1FB',
          'sky-light': '#EAF5FD',
          'red-light': '#FDECEA',
        },
        primary: {
          50: '#E8F1FB',
          100: '#C5D9F5',
          200: '#9BBDE8',
          300: '#70A1DB',
          400: '#4DA6E8',
          500: '#1E5AA8',
          600: '#164080',
          700: '#0F2D5C',
          800: '#091D3A',
          900: '#040E1D',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'vc': '0 4px 24px rgba(30, 90, 168, 0.12)',
        'vc-lg': '0 8px 40px rgba(30, 90, 168, 0.18)',
        'glass': '0 8px 32px rgba(30, 90, 168, 0.10)',
        'card': '0 2px 16px rgba(27, 42, 73, 0.08)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1B2A49 0%, #1E5AA8 50%, #4DA6E8 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1E5AA8 0%, #4DA6E8 100%)',
        'soft-gradient': 'linear-gradient(135deg, #E8F1FB 0%, #EAF5FD 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(232,241,251,0.6) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
