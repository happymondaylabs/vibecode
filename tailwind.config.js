/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        orange: {
          400: '#FF8C42',
          500: '#FF7A00',
        }
      }
    },
  },
  plugins: [],
};