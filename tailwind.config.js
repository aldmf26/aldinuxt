/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        warna1: 'var(--accent-color)',
        warnaHeading: 'var(--bg-color)',
        warnaBiru: 'var(--accent-color)',
        warnaHijau: 'var(--accent-secondary)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        bg: 'var(--bg-color)',
      }
    },
  },
  plugins: [],
}