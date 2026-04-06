import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#1E3A5F',
        'medical-red': '#C41E3A',
        'medical-green': '#2D6A4F',
        'background': '#FAFBFC',
        'text-primary': '#1A1D23',
      },
      fontFamily: {
        // next/font/google variables injected on <html> — served from same origin at build time
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
