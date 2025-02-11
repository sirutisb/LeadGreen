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
