/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'diagnostic-red': '#dc2626',
        'diagnostic-accent': '#ffffff',
        'diagnostic-bg': '#000000',
        'diagnostic-surface': '#0a0a0a',
        'diagnostic-border': '#dc2626',
        'diagnostic-text': '#ffffff',
        'diagnostic-muted': '#a3a3a3',
      },
      boxShadow: {
        'red-edge': '0 0 0 1px #dc2626, 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'red-edge-lg': '0 0 0 1px #dc2626, 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        'red': '1px',
      },
    },
  },
  plugins: [],
}
