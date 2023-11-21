/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:
          {
            "custom-bg": "#0f0606",
            "custom-highlight": "#490000",
            "custom-primary": "#2f0000",
            "custom-border": "#650000",
              "custom-text": "#DDDDDD",
          }
    },
  },
  plugins: [],
}

