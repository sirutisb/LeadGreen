/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'primary': '#1DB954',
                'secondary': '#168d40',
                'lead-light': '#2bde6a',
                'lead-black': '#191414'
            },
            fontFamily: {
                montserrat: ['"Montserrat"', "sans-serif"],
                poppins: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

module.exports = {
      theme: {
        extend: {
          animation: {
            'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
            'star-movement-top': 'star-movement-top linear infinite alternate',
          },
          keyframes: {
            'star-movement-bottom': {
              '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
              '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
            },
            'star-movement-top': {
              '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
              '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
            },
          },
        },
      }
    }
