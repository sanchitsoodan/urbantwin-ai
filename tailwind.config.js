/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twin: {
          bg: '#f8fafc',       // Slate 50
          surface: '#ffffff',  // White
          card: '#ffffff',
          border: '#e2e8f0',   // Slate 200
          borderHover: '#cbd5e1', // Slate 300
          blue: '#2563eb',     // Blue 600
          blueLight: '#eff6ff', // Blue 50
          cyan: '#0284c7',     // Sky 600
          emerald: '#059669',  // Emerald 600
          emeraldLight: '#ecfdf5', // Emerald 50
          amber: '#d97706',    // Amber 600
          amberLight: '#fffbeb', // Amber 50
          danger: '#dc2626',   // Red 600
          dangerLight: '#fef2f2', // Red 50
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'popover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
