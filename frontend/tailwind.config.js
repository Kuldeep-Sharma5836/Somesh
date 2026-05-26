/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#D97706',
        gold: '#C9A227',
        cream: '#FFF9ED',
        beige: '#F3E7D1',
        maroon: '#6F1D1B',
        ember: '#A44A3F',
      },
      boxShadow: {
        soft: '0 10px 35px rgba(111, 29, 27, 0.10)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        aura: 'radial-gradient(circle at 10% 20%, rgba(201,162,39,0.15), transparent 40%), radial-gradient(circle at 90% 10%, rgba(217,119,6,0.10), transparent 35%)',
      },
    },
  },
  plugins: [],
};
