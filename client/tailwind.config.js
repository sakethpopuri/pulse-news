/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0a0a0f",
          900: "#111118",
          800: "#1a1a24",
          700: "#252532",
          600: "#3a3a4e",
          400: "#6b6b8a",
          200: "#b0b0c8",
          100: "#e0e0f0",
        },
        signal: {
          DEFAULT: "#e8441a",
          hover: "#ff5528",
          muted: "#3d1a10",
        },
        gold: "#c9a84c",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "modal-in": "modalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        ticker: "ticker 30s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        modalIn: { from: { opacity: 0, transform: "scale(0.94) translateY(12px)" }, to: { opacity: 1, transform: "scale(1) translateY(0)" } },
        pulseRing: { "0%": { transform: "scale(1)", opacity: 1 }, "100%": { transform: "scale(2)", opacity: 0 } },
        ticker: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
