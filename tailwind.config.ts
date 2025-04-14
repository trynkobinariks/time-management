import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-headings)'],
      },
      letterSpacing: {
        wider: '0.015em',
        widest: '0.03em',
      },
      transformOrigin: {
        center: 'center',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: { height: '0', opacity: '0' },
        },
        'spin-slow': {
          '0%': {
            transform:
              'translate(-50%, -50%) rotate(0deg) translateX(15px) rotate(0deg)',
            opacity: '0.4',
          },
          '25%': {
            opacity: '0.9',
            transform:
              'translate(-50%, -50%) rotate(90deg) translateX(20px) rotate(-90deg)',
          },
          '50%': {
            opacity: '0.7',
            transform:
              'translate(-50%, -50%) rotate(180deg) translateX(25px) rotate(-180deg)',
          },
          '75%': {
            opacity: '0.9',
            transform:
              'translate(-50%, -50%) rotate(270deg) translateX(20px) rotate(-270deg)',
          },
          '100%': {
            transform:
              'translate(-50%, -50%) rotate(360deg) translateX(15px) rotate(-360deg)',
            opacity: '0.4',
          },
        },
        'slow-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.9',
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '1',
            boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)',
          },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '50%': {
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'accordion-up': 'accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'spin-slow': 'spin-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-pulse': 'slow-pulse 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config; 