console.log("Loading Tailwind config...");

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        royalBlue: {
          DEFAULT: "#09576A",
          hover: "#1C8F9F",
        },
        ivory: {
          DEFAULT: "#FFFFFF",
          light: "#FFFFFF",
        },
        sidebarDark: "#f2f2f2",
        teal: "#006D77",
        lightBlue: {
          DEFAULT: "rgba(10, 35, 81, 0.1)",
        },
        cyan: "rgb(21, 235, 235)",
        navyBlue: "#09576A",

        // Grays
        gray: {
          lightest: "#F2F2F2",
          light: "#E5E5E5",
          lightMedium: "#DDD",
          medium: "#444",
          dark: "#333333",
          DEFAULT: "#B0B0B0",
        },

        // Functional Colors using CSS variables
        sidebar: {
          bg: "var(--light-gray)",
          text: "var(--dark)",
          hover: "var(--grey)",
        },
        main: {
          bg: "var(--light-ivory)",
        },
        button: {
          primary: "var(--royal-blue)",
          primaryHover: "var(--hover-blue)",
        },
        text: {
          header: "var(--dark-gray)",
        },
        border: {
          DEFAULT: "var(--light-gray)",
        },

        // Additional theme colors
        separator: "rgb(229, 241, 241)",
        subtitle: "#a0a0a0",
      },

      spacing: {
        sidebar: "240px",
      },

      fontFamily: {
        sans: [
          "Roboto",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};
