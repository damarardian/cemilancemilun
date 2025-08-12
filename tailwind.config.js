/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../view2/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

