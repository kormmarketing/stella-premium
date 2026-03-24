/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0F0F10',
        'bg-secondary': '#111214',
        'bg-tertiary': '#151618',
        'bg-card': '#18191C',
        'text-main': '#EAEAEA',
        'text-muted': '#A9A9AD',
        'border': '#2A2A2D',
        'border-soft': '#303136',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 4.5vw, 4.5rem)', { lineHeight: '1.08' }],
        'section': ['clamp(2rem, 3vw, 3rem)', { lineHeight: '1.15' }],
        'lead': ['clamp(1.125rem, 1.5vw, 1.5rem)', { lineHeight: '1.4' }],
        'body': ['clamp(1rem, 1.125vw, 1.125rem)', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'micro': ['0.8125rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'content': '1360px',
        'narrow': '720px',
      },
      spacing: {
        'section': 'clamp(5rem, 10vh, 7.5rem)',
        'section-lg': 'clamp(6rem, 12vh, 9rem)',
      },
      transitionDuration: {
        'premium': '400ms',
        'premium-slow': '600ms',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}
