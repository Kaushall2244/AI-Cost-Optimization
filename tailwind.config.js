/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Executive Dark Blue Palette
        navy: {
          950: '#060e1d', // Deepest midnight navy
          900: '#0b192c', // Rich dark navy
          850: '#0f223f', // Navy card header / dark surface
          800: '#1e293b', // Slate navy
          700: '#1e3a8a', // Corporate dark blue
          600: '#1d4ed8', // Dark cobalt blue
          500: '#2563eb', // Royal blue
          400: '#38bdf8', // Sky accent
          200: '#bfdbfe', // Soft ice blue
          100: '#dbeafe', // Tinted ice
          50: '#eff6ff',  // Lightest blue tint
        },
        // Light Theme Surfaces
        surface: {
          white: '#ffffff',
          canvas: '#f8fafc',
          muted: '#f1f5f9',
          border: '#e2e8f0',
          'border-subtle': '#cbd5e1',
        },
        brand: {
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e3a8a',
          800: '#0f172a',
        },
        savings: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        anomaly: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'glow-blue': '0 0 20px -4px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
