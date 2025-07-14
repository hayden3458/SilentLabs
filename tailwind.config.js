/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        techblue: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
          600: '#2c3e50',
          500: '#3a506b',
          400: '#5bc0be',
          300: '#6fffe9',
        },
        accent: {
          500: '#64ffda',
          400: '#43e6b0',
        },
        glassblue: {
          900: '#0a2233',
          800: '#164863',
          700: '#3baea0',
          600: '#7ed6df',
          500: '#b8e0d2',
        },
        glassgreen: {
          500: '#a8e063',
          400: '#56ab2f',
        },
        earth: {
          100: '#f6f1e7',
          200: '#e9dac1',
          300: '#c7b198',
        },
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #0a192f 0%, #112240 40%, #233554 100%)',
        'accent-gradient': 'linear-gradient(90deg, #64ffda 0%, #43e6b0 100%)',
        'nature-glass': 'linear-gradient(135deg, #0a2233 0%, #164863 40%, #3baea0 80%, #a8e063 100%)',
        'glass-overlay': 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(174,238,238,0.10) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}

