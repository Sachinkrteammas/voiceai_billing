/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace']
      },
      colors: {
        brand: {
          50: '#F2F1FE',
          100: '#E6E4FD',
          200: '#C6C2FB',
          400: '#8C82F2',
          500: '#5B4FE8',
          600: '#4B3EE0',
          700: '#3D31C4'
        },
        surface: '#F7F8FB',
        ink: {
          900: '#14152B',
          700: '#3A3B52',
          500: '#6B6C85',
          400: '#8E8FA6',
          300: '#B4B5C6'
        },
        success: '#0F9D58',
        warning: '#E8871E',
        danger: '#E0433D'
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 21, 43, 0.04), 0 1px 6px rgba(20, 21, 43, 0.03)'
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px'
      }
    }
  },
  plugins: []
}
