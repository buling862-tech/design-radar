import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937',
        accent: '#F59E0B',
      },
      spacing: {
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(31, 41, 55)',
            a: {
              color: 'rgb(59, 130, 246)',
              '&:hover': {
                color: 'rgb(37, 99, 235)',
              },
            },
            strong: {
              color: 'rgb(17, 24, 39)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        invert: {
          css: {
            color: 'rgb(243, 244, 246)',
            a: {
              color: 'rgb(96, 165, 250)',
              '&:hover': {
                color: 'rgb(147, 197, 253)',
              },
            },
            strong: {
              color: 'rgb(243, 244, 246)',
            },
            blockquote: {
              borderLeftColor: 'rgb(107, 114, 128)',
              color: 'rgb(209, 213, 219)',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
