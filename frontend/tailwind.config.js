/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                serif: '"Roboto Serif", serif;',
                poppins: '"Poppins", sans-serif;',
            },
        },
    },
    plugins: [],
}
