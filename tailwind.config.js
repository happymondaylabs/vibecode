/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto Mono', 'monospace'],
        'mono': ['Roboto Mono', 'monospace'],
        'primary': ['Montserrat', 'sans-serif'],
        'secondary': ['Roboto Mono', 'monospace'],
      },
      colors: {
        orange: {
          400: '#FF8C42',
          500: '#FF7A00',
        },
        green: {
          400: '#00FF9D',
        }
      }
      borderWidth: {
        '3': '3px',
      },
      scale: {
        '120': '1.2',
      },
      spacing: {
        '15': '3.75rem',
      }
    },
  },
  plugins: [],
};