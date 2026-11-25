/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/accessbridge/**/*.{ts,tsx}', './src/components/ResearchDashboard.tsx'],
  theme: { extend: { colors: { paper: '#F7F8FA', surface: '#FFFFFF', ink: '#14181F', graphite: '#5A6472', hairline: '#E2E6EC', accent: '#14545A' }, fontFamily: { sans: ['system-ui', 'sans-serif'], mono: ['ui-monospace', 'monospace'], serif: ['Georgia', 'serif'] } } },
  plugins: [],
};
