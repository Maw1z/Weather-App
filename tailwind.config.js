/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#000000",
        accent1: {
          900: "#545CFF",
          100: "#C9CBFF",
        },
        accent2: "#DBDBDB",
        grey1: "#D9D9D9",
        grey2: "#434343",
      },
      screens: {
        sm: "360px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
