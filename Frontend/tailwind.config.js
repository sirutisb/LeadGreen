/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'green' : '#1DB954',
                'dark-green' : '#168d40',
                'light-green' : '#2bde6a',
                'black' : '#191414'
            },
        },
        extend: {
            fontFamily: {
              montserrat: ['"Montserrat"', "sans-serif"],
              poppins: ['Poppins', 'sans-serif'],
            },
        },
    plugins: [],
    },
};