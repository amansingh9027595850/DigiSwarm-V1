/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1700px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          200: '#bcd2ff',
          300: '#8fb3ff',
          400: '#5b89ff',
          500: '#3563ff',
          600: '#1f44f5',
          700: '#1a36dd',
          800: '#1c2fb1',
          900: '#1d2e8b',
          950: '#161e54',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f5',
          200: '#dde1ea',
          300: '#bfc6d4',
          400: '#9aa3b6',
          500: '#737d92',
          600: '#5b6478',
          700: '#444a5a',
          800: '#2d3140',
          900: '#181b26',
          950: '#0c0e15',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(15, 23, 42, 0.08)',
        card: '0 8px 30px -8px rgba(15, 23, 42, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.5s ease-out both',
        'pop-in': 'popIn 0.5s cubic-bezier(.34,1.56,.64,1) both',
        'pop-out': 'popOut 0.3s ease-in both',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 1.4s ease-in-out infinite',
        'attention-bounce': 'attentionBounce 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.6) translateY(-8px)' },
          '60%': { opacity: 1, transform: 'scale(1.08) translateY(2px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        popOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.85) translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.55)' },
          '50%': { boxShadow: '0 0 0 10px rgba(245, 158, 11, 0)' },
        },
        attentionBounce: {
          '0%, 75%, 100%': { transform: 'translateY(0) rotate(0) scale(1)' },
          '78%': { transform: 'translateY(-8px) scale(1.08) rotate(0)' },
          '82%': { transform: 'translateY(0) scale(1.05) rotate(-5deg)' },
          '86%': { transform: 'translateY(-4px) scale(1.05) rotate(5deg)' },
          '90%': { transform: 'translateY(0) scale(1.05) rotate(-3deg)' },
          '94%': { transform: 'translateY(0) scale(1) rotate(0)' },
        },
      },
    },
  },
  plugins: [],
};
