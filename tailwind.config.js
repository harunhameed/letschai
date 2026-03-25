/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f5eee9',
          100: '#ead7c9',
          200: '#dcb89f',
          300: '#c99370',
          400: '#a77e58', // base requested
          500: '#946a48',
          600: '#754f34',
          700: '#63402e',
          800: '#582f0e', // dark requested
          900: '#46240d',
        },
        accent: {
          50:  '#fdf9f4',
          100: '#f9eee3',
          200: '#efd5bd',
          300: '#e5b690',
          400: '#d59461',
          500: '#a77e58', // using primary as accent as well safely
          600: '#754823',
          700: '#582f0e', // using the dark requested
          800: '#4f2b16',
          900: '#422415',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #a77e58 0%, #946a48 25%, #582f0e 50%, #a77e58 75%, #ca8a04 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(167, 126, 88, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(167, 126, 88, 0.2)',
        'glow': '0 0 20px rgba(167, 126, 88, 0.3)',
        'glow-accent': '0 0 20px rgba(88, 47, 14, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(167, 126, 88, 0.3)' },
          '50%': { opacity: 0.85, boxShadow: '0 0 40px rgba(167, 126, 88, 0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
