/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8A96E',
        'primary-light': '#E0BD80',
        'primary-dark': '#A88850',
        'dark-bg': '#0D0D0D',
        'dark-card': '#1A1A1A',
        'dark-hover': '#242424',
        'dark-border': '#2A2A2A',
        'dark-muted': '#3A3A3A',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-in-right': 'slideInRight 0.35s ease',
        'slide-up': 'slideUp 0.3s ease',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-gold': 'pulseGold 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,169,110,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,169,110,0)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C8A96E 0%, #E0BD80 50%, #C8A96E 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
      },
    },
  },
  plugins: [],
}

