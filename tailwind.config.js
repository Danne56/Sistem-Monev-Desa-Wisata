/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        inputBox: "#B0B0B0",
        textGray: "#6C7278",
        greenMain: "#165E1B",
      },
      fontSize: {
        headline1: "80px",
        headline2: "64px",
        headline3: "48px",
        subheadline: "24px",
        body: "20px",
        normal: "16px",
        smallText: "14px",
        verySmallText: "12px",
      },
    },
  },
  plugins: [],
};
