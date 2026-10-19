import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palet Resmi Saluang Teknologi
        saluang: {
          dark: '#3A1F3D',    // Deep Aubergine / Dark Plum (Primary Text & Outlines)
          teal: '#2DBE9B',    // Fresh Teal / River Wave
          mint: '#7ED3C6',    // Soft Mint / Digital Aqua
          coral: '#EF5B4D',   // Vibrant Coral / Fish Accent
          yellow: '#F4B223',  // Golden Amber / Sun Accent
          pink: '#F9E2EB',    // Hero Soft Pink / Blush
          pinkLight: '#FDF2F6',
          cream: '#FFFDF9',   // Warm Cream Card Background
          sand: '#FAF4EB',    // Section Warm Sand
          marigold: '#FCD865',// Warm Rich Gold Section
        },
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #3A1F3D',
        'neo': '4px 4px 0px #3A1F3D',
        'neo-md': '6px 6px 0px #3A1F3D',
        'neo-lg': '8px 8px 0px #3A1F3D',
        'neo-xl': '12px 12px 0px #3A1F3D',
        'neo-teal': '4px 4px 0px #2DBE9B',
        'neo-coral': '4px 4px 0px #EF5B4D',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
