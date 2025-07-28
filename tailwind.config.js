/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        montserratRegular: "Montserrat_400Regular",
        montserratLight: "Montserrat_300Light",
        montserratMedium: "Montserrat_500Medium",
        montserratSemiBold: "Montserrat_600SemiBold",
        montserratBold: "Montserrat_700Bold",
        montserratExtraBold: "Montserrat_800ExtraBold",
      },
      colors: {
        Primary: "#0052FF",
        Dark: "#131214",
        Gray: "#616161",
        LightGray: "#F2F2F2",
        LightPrimary: "#ACC7FF",
        Accent: "#F7C404",
        LightBlue: "#EDF1F7",
        White: "#FFFFFF",
        iconBg: "#D9D9D9",
        Danger: "#E41D12",
        DangerDark: "#7C0C06",
      },
      borderWidth: {
        0.5: "0.5px",
        1: "1px",
      },
    },
  },
  plugins: [],
};
