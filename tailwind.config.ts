import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#1a2f5a',
          600: '#1e3a6e',
        },
        teal: {
          500: '#0d9488',
          600: '#0f766e',
        },
      },
    },
  },
  plugins: [],
}
export default config
