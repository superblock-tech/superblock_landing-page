/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "multi-color-gradient":
          "linear-gradient(93deg, #51B5FF 0%, #FFFFFF 16%, #9657E1 33%, #9657E1 66%, #FFFFFF 83%, #51B5FF 100%)",
      },
      backgroundSize: {
        "size-800": "800%",
      },
      keyframes: {
        colorCycle: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "120% 50%",
          },
        },
      },
      animation: {
        colorCycle: "colorCycle 16s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Firefox */
          "scrollbar-width": "none",
          /* Internet Explorer 10+ */
          "-ms-overflow-style": "none",
          /* WebKit */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
