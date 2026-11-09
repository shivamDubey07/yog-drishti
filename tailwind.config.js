/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B3B2B', // Deep Forest Green
          light: '#274E3B',
          dark: '#11271C',
        },
        sage: {
          DEFAULT: '#7A9A8B', // Earthy Sage Green
          light: '#E6EFEA',
          muted: '#A3BBAF',
        },
        cream: {
          DEFAULT: '#FAF7F2', // Warm White
          dark: '#F0EAE1',    // Soft Beige
        },
        gold: {
          DEFAULT: '#C5A059', // Muted Luxury Gold
          light: '#DBC28E',
          dark: '#9E7B3B',
        },
        charcoal: '#242926',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(27, 59, 43, 0.08)',
        'luxury': '0 20px 40px -15px rgba(27, 59, 43, 0.14)',
      }
    },
  },
  plugins: [],
}
