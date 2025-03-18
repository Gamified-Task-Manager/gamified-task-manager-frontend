/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          light: '#F5F5F5', // Soft White
          dark: '#2C2C2C',  // Charcoal Black
          deep: '#1A1A1A',  // Deep Black
          grey: '#BDBDBD',  // Light Grey
        },
        gold: '#D4AF37',      // Gold Accent
        terraPink: '#ff69b4', // Existing custom color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean and modern font
        serif: ['Playfair Display', 'serif'], // Classy and elegant font
      },
    },
  },
  plugins: [],
};
