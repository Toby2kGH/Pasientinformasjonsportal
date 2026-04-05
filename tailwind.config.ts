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
        // Fonts served locally — see public/fonts/ and next/font setup in layout.tsx
        // Google Fonts CDN removed for GDPR compliance (avoids IP transfer to Google)
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
