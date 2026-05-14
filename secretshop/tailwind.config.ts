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
        // Core woodland palette — dark forest floor to deep canopy
        void: {
          950: '#050b04',
          900: '#0b120a',
          800: '#111a0d',
          700: '#172311',
          600: '#1e2d16',
          500: '#273b1c',
        },
        // Moss / canopy green — primary accent
        arcane: {
          50:  '#edf4e4',
          100: '#cde2ae',
          200: '#aacd78',
          300: '#87b843',
          400: '#6aa228',
          500: '#56821e',
          600: '#426417',
          700: '#30480f',
          800: '#1e2e08',
          900: '#0d1603',
        },
        // Fern green — secondary accent
        rune: {
          50:  '#e8f4ea',
          100: '#b9dfc0',
          200: '#88c894',
          300: '#59b068',
          400: '#369748',
          500: '#237d34',
          600: '#196325',
          700: '#0f4918',
          800: '#07300d',
          900: '#031805',
        },
        // Bark / amber — warm earthy highlight
        gold: {
          50:  '#f8f0e2',
          100: '#efd5a2',
          200: '#e0b562',
          300: '#c7912f',
          400: '#a77318',
          500: '#88580e',
          600: '#6d4409',
          700: '#513105',
          800: '#362002',
          900: '#1c1001',
        },
        // Copper ember — hot highlight
        ember: {
          400: '#c97b36',
          500: '#b5621c',
          600: '#9a4f0d',
        },
        // Dota 2 semantic colours
        radiant: '#5ca86e',
        dire:    '#eb5757',
      },
      fontFamily: {
        cinzel:    ['Cinzel', 'serif'],
        rajdhani:  ['Rajdhani', 'sans-serif'],
        mono:      ['"Share Tech Mono"', 'monospace'],
        display:   ['"Cinzel Decorative"', 'serif'],
      },
      backgroundImage: {
        // Very subtle leaf-vein grid in deep forest green
        'arcane-grid': `
          linear-gradient(rgba(106,162,40,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(106,162,40,0.04) 1px, transparent 1px)
        `,
        'void-radial': 'radial-gradient(ellipse at center, #172311 0%, #050b04 70%)',
        'arcane-glow': 'radial-gradient(ellipse at 50% 0%, rgba(66,100,23,0.28) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid-40': '40px 40px',
      },
      boxShadow: {
        'arcane':       '0 0 30px rgba(106,162,40,0.2), 0 0 60px rgba(106,162,40,0.08)',
        'arcane-sm':    '0 0 12px rgba(106,162,40,0.15)',
        'rune':         '0 0 20px rgba(54,151,72,0.25)',
        'gold':         '0 0 20px rgba(224,181,98,0.25)',
        'inset-arcane': 'inset 0 0 30px rgba(106,162,40,0.05)',
        'card':         '0 4px 40px rgba(5,11,4,0.9)',
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'rune-spin':  'runeSpin 20s linear infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'fadeIn':     'fadeIn 0.5s ease both',
        'slideUp':    'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slideDown':  'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'countdown':  'countdown 1s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        runeSpin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        countdown: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.02)' },
        },
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}

export default config
