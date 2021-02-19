module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
    extend: {
      colors: {
        primary: '#f2f2f2',
        secondary: '#685454',
        tertiary: '#ea8a8a',
        text: '#393232',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
