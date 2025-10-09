import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        rethink: ["var(--font-rethink)"],
      },
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle at 80% 40%, #A9D2F3 0%, #4A6D8C 50%, #16354D 100%)',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;