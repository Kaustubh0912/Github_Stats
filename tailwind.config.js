/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          light: '#ffffff',
          accent: '#58a6ff',
          secondary: '#6e7681',
          green: '#2ea44f',
          yellow: '#f1e05a',
          red: '#f85149',
          purple: '#8957e5',
        },
      },
    },
  },
  plugins: [],
}