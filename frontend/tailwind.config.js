/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2430',
        paper: '#EFF2F1',
        surface: '#FFFFFF',
        muted: '#6B7684',
        line: '#DDE3E1',
        'dark-bg': '#12161C',
        'dark-surface': '#1A2029',
        'dark-line': '#2B333F',
        'dark-muted': '#8B95A3',
        focus: {
          50: '#EAF6F4',
          100: '#CDEAE5',
          300: '#6FBEB1',
          500: '#0E7C6F',
          600: '#0B655A',
          700: '#094F47',
        },
        ember: '#E0663E',
        gold: '#D9A441',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,36,48,0.06), 0 8px 24px -12px rgba(27,36,48,0.18)',
        modal: '0 20px 60px -12px rgba(27,36,48,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
