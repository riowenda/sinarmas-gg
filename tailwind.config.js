module.exports = {
  mode: "jit", // Optionally use just in time engine
  content: ["./src/**/*.{js,jsx,ts,tsx,css}", "./public/index.html"],
  theme: {
    extend: {},
    screen: {
      mobile: "300px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // require('@tailwindcss/typography'),
    //require('@tailwindcss/forms'),
    //require('@tailwindcss/line-clamp'),
    //require('@tailwindcss/aspect-ratio'),
  ],
};
