/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bgPanel: "var(--bg-panel)",
        bgPanel2: "var(--bg-panel-2)",
        cream: "var(--cream)",
        creamDim: "var(--cream-dim)",
        gold: "var(--gold)",
        goldDim: "var(--gold-dim)",
        ajrakRed: "var(--ajrak-red)",
        ajrakIndigo: "var(--ajrak-indigo)",
        line: "var(--line)",
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 30px -5px rgba(201, 162, 39, 0.25)",
        goldGlow: "0 0 25px rgba(201, 162, 39, 0.35)",
        ajrakGlow: "0 0 25px rgba(147, 26, 41, 0.35)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        float: "float 4s ease-in-out infinite",
        floatSlow: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}