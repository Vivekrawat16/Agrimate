/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    extend: {
        colors: {
            'primary-green': '#2E7D32',
            'light-bg': '#F6F8F7',
            'card-white': '#FFFFFF',
            'text-dark': '#263238',
            'text-muted': '#546E7A',
            // Legacy support (optional, can be removed if not used)
            'forest-green': '#2E7D32',
        },
        fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
        },
        boxShadow: {
            'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
            'hover': '0 10px 25px rgba(0, 0, 0, 0.1)',
        }
    },
    plugins: [],
}
