/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#e91010',
          hover: '#c80c0c',
          glow: 'rgba(233, 16, 16, 0.25)',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#121212',
          surface: '#181818',
          border: '#262626',
          text: '#f5f5f5',
          muted: '#8e8e8e',
        },
        light: {
          bg: '#EAE0D0',
          card: '#DFD4C2',
          surface: '#D5C8B4',
          border: '#C6B7A0',
          text: '#1a1a1a',
          muted: '#635c51',
        },
      },
    },
  },
  plugins: [],
};

