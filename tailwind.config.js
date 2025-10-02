/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coomofu: {
          blue: "#00ff0dff",
          dark: "#eeeef0ff",
          light: "#E6F0FF",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(231, 231, 240, 1)",
      },
    },
  },
  plugins: [],
};
