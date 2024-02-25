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
      colors:{
        warna1: '#255BA6',
        warnaHeading: '#f1f1e1',
        warnaBiru: '#4A7CBF',
        warnaHijau: '#EFC217'
      }
    },
  },
  plugins: [],
}