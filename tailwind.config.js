/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js",
    "./src/**/*.{html,js}",
    "./components/**/*.{html,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // BMKG Brand Colors
        'bmkg': {
          'primary': '#1e3a8a',
          'secondary': '#0ea5e9',
          'accent': '#f59e0b',
          'success': '#059669',
          'warning': '#dc2626',
          'dark': '#0f172a',
          'light': '#f8fafc',
        },
        // Semantic Colors
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1e40af', // bmkg-primary
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e293b',
        },
        // Status Colors
        'status': {
          'normal': '#059669',
          'warning': '#f59e0b',
          'danger': '#dc2626',
          'info': '#0ea5e9',
        },
        // Magnitude Scale Colors
        'magnitude': {
          1: '#10b981',
          2: '#84cc16',
          3: '#eab308',
          4: '#f97316',
          5: '#ef4444',
          6: '#dc2626',
          7: '#991b1b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Fluid Typography
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 5vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 6vw, 3rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // Custom shadows
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
        'earthquake': '0 4px 20px rgba(239, 68, 68, 0.3)',
        'tsunami': '0 4px 20px rgba(14, 165, 233, 0.3)',
        'magnetic': '0 4px 20px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'slide-in-down': 'slideInDown 0.5s ease-out forwards',
        'pulse-dot': 'pulseDot 2s infinite',
        'seismic-wave': 'seismicWave 3s infinite linear',
        'loading-shimmer': 'loadingShimmer 1.5s infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        seismicWave: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        loadingShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
        // Container queries
        '@xs': '20rem',
        '@sm': '24rem',
        '@md': '28rem',
        '@lg': '32rem',
        '@xl': '36rem',
        '@2xl': '42rem',
        '@3xl': '48rem',
        '@4xl': '56rem',
        '@5xl': '64rem',
        '@6xl': '72rem',
        '@7xl': '80rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
        '10': 'repeat(10, minmax(0, 1fr))',
        '11': 'repeat(11, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/container-queries'),
    // Custom plugin untuk utilities tambahan
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.writing-vertical': {
          'writing-mode': 'vertical-rl',
        },
        '.writing-horizontal': {
          'writing-mode': 'horizontal-tb',
        },
        '.contain-layout': {
          'contain': 'layout',
        },
        '.contain-paint': {
          'contain': 'paint',
        },
        '.contain-size': {
          'contain': 'size',
        },
        '.contain-strict': {
          'contain': 'strict',
        },
        '.will-change-transform': {
          'will-change': 'transform',
        },
        '.will-change-opacity': {
          'will-change': 'opacity',
        },
        '.will-change-scroll': {
          'will-change': 'scroll-position',
        },
      });

      // Custom components
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          border: 'none',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.600'),
          textDecoration: 'none',
          transition: 'all 150ms ease-in-out',
          cursor: 'pointer',
          userSelect: 'none',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.bmkg.primary'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.md'),
          },
        },
        '.btn-secondary': {
          backgroundColor: 'transparent',
          color: theme('colors.bmkg.primary'),
          border: `2px solid ${theme('colors.bmkg.primary')}`,
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.bmkg.primary'),
            color: theme('colors.white'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.md'),
          border: `1px solid ${theme('colors.slate.200')}`,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '.dark &': {
            backgroundColor: theme('colors.slate.900'),
            borderColor: theme('colors.slate.700'),
          },
        },
        '.card-hover': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
          },
        },
        '.glass-effect': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '.dark &': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        '.text-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.bmkg.primary')}, ${theme('colors.bmkg.secondary')})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.hero-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.bmkg.primary')} 0%, ${theme('colors.primary.600')} 50%, ${theme('colors.bmkg.secondary')} 100%)`,
        },
      });
    },
  ],
  // Safelist untuk dynamic classes
  safelist: [
    'magnitude-1',
    'magnitude-2',
    'magnitude-3',
    'magnitude-4',
    'magnitude-5',
    'magnitude-6',
    'magnitude-7',
    'status-normal',
    'status-warning',
    'status-danger',
    'status-info',
    'animate-pulse-dot',
    'animate-seismic-wave',
    'animate-loading-shimmer',
    {
      pattern: /bg-(red|green|blue|yellow|purple|pink|indigo)-(50|100|500|600|700|800|900)/,
    },
    {
      pattern: /text-(red|green|blue|yellow|purple|pink|indigo)-(50|100|500|600|700|800|900)/,
    },
    {
      pattern: /border-(red|green|blue|yellow|purple|pink|indigo)-(50|100|500|600|700|800|900)/,
    },
  ],
};