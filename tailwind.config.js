const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          start: '#9D5CFF',
          end: '#FF3B7F',
        },
        surface: {
          DEFAULT: 'rgb(var(--background-rgb))',
          light: 'rgba(255, 255, 255, 0.05)',
          lighter: 'rgba(255, 255, 255, 0.1)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-surface': 'var(--gradient-surface)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'SF Pro Display', ...fontFamily.sans],
      },
      screens: {
        'xs': '375px',     // iPhone SE
        'sm': '390px',     // iPhone 12/13/14
        'md': '414px',     // iPhone Plus/Max/Pro Max
        'lg': '428px',     // iPhone 12/13/14 Pro Max
        'xl': '744px',     // iPad Mini/Air
        '2xl': '834px',    // iPad Pro 11"
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'dynamic-screen': 'var(--vh, 1vh) * 100',
      },
      height: {
        screen: ['100vh', '100dvh'],
      },
      minHeight: {
        screen: ['100vh', '100dvh'],
      },
      maxHeight: {
        screen: ['100vh', '100dvh'],
      },
      animation: {
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'fade-pulse': 'fade-pulse 2s ease-in-out infinite',
        'slide-left': 'slide-left 15s linear infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-x': 'bounceX 1.5s infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'fade-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        bounceX: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(5px)',
          },
        },
      },
      scale: {
        '102': '1.02',
        '98': '0.98',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.safe-top': {
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
        },
        '.safe-bottom': {
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        },
        '.safe-left': {
          paddingLeft: 'max(env(safe-area-inset-left), 16px)',
        },
        '.safe-right': {
          paddingRight: 'max(env(safe-area-inset-right), 16px)',
        },
        '.h-screen-safe': {
          height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        },
        '.min-h-screen-safe': {
          minHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}