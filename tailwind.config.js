/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Courier New', 'monospace'],
        'mono': ['JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Courier New', 'monospace'],
        'technical': ['JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Courier New', 'monospace'],
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