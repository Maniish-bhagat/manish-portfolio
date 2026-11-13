/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090909',
        surface: '#141414',
        'surface-card': '#141414',
        'surface-elevated': '#191919',
        'surface-border': '#292929',
        border: {
          DEFAULT: '#292929',
          hover: '#3F3F46',
        },
        dev: {
          orange: '#F0883E',
          'orange-light': '#FFA657',
          blue: '#58A6FF',
          'blue-light': '#79B8FF',
          green: '#3FB950',
          'green-light': '#56D364',
          red: '#F85149',
        },
        primary: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#F0883E',
          600: '#FFA657',
          700: '#3f3f46',
          800: '#292929',
          900: '#141414',
          950: '#090909',
        },
        accent: {
          400: '#58A6FF',
          500: '#F0883E',
          600: '#FFA657',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
