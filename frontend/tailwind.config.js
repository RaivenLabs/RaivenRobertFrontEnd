console.log('Loading Tailwind config...');

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        royalBlue: {
          DEFAULT: '#0A2351',
          hover: '#153672'
        },
        ivory: {
          DEFAULT: '#FFFFF0',
          light: '#FFFFFA'
        },
        sidebarDark: '#132440',
        teal: '#006D77',
        lightBlue: {
          DEFAULT: 'rgba(10, 35, 81, 0.1)'
        },
        cyan: 'rgb(21, 235, 235)',
        navyBlue: '#132440',
        
        // Grays
        gray: {
          light: '#F5F5F5',
          dark: '#333333',
          DEFAULT: '#B0B0B0'
        },

        // Functional Colors using CSS variables
        sidebar: {
          bg: 'var(--navy-blue)',
          text: 'var(--ivory)',
          hover: 'var(--grey)'
        },
        main: {
          bg: 'var(--light-ivory)'
        },
        button: {
          primary: 'var(--royal-blue)',
          primaryHover: 'var(--hover-blue)'
        },
        text: {
          header: 'var(--royal-blue)'
        },
        border: {
          DEFAULT: 'var(--light-gray)'
        },
        
        // Additional theme colors
        separator: 'rgb(229, 241, 241)',
        subtitle: '#a0a0a0'
      },

      spacing: {
        sidebar: '295px',
      },

      boxShadow: {
        sidebar: '2px 0 5px rgba(0, 0, 0, 0.1)',
        separator: '0 0 8px rgb(229, 241, 241)'
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          ...defaultTheme.fontFamily.sans,
        ],
      }
    }
  },
  plugins: []
};
