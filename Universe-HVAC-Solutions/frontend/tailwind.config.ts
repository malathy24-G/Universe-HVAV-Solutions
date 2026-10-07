import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        /* Main professional blue */
        navy: {
          DEFAULT: "#123B63",
          50: "#EFF8FF",
          100: "#DCEEFF",
          200: "#B9DBF7",
          300: "#8CC3EC",
          400: "#56A5DD",
          500: "#2786C4",
          600: "#176CA5",
          700: "#145782",
          800: "#123B63",
          900: "#0B2947",
        },

        /* Bright HVAC cyan */
        sky: {
          DEFAULT: "#0EA5D9",
          50: "#ECFBFF",
          100: "#D7F6FF",
          200: "#AEEBFA",
          300: "#73D8EF",
          400: "#38C4E5",
          500: "#0EA5D9",
          600: "#078BB9",
          700: "#067298",
          800: "#075D7D",
          900: "#064C67",
        },

        /* Accent blue */
        accent: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },

        /* Background colors */
        frost: "#F5FAFD",
        mist: "#E8F1F7",
        ice: "#F0FAFF",

        /* Text */
        ink: "#102A43",

        slate: {
          DEFAULT: "#526477",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },

        /* Success */
        success: {
          DEFAULT: "#16A34A",
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
        },

        /* Warning */
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
        },
      },

      fontFamily: {
        display: [
          "var(--font-sora)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],

        body: [
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },

      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "22px",
        "3xl": "28px",
      },

      boxShadow: {
        /* Cards */
        card: "0 4px 20px rgba(18, 59, 99, 0.08)",

        "card-hover":
          "0 16px 40px rgba(18, 59, 99, 0.15)",

        /* Panels */
        panel:
          "0 8px 30px rgba(18, 59, 99, 0.10)",

        "panel-hover":
          "0 20px 50px rgba(14, 165, 217, 0.18)",

        /* Buttons */
        button:
          "0 8px 20px rgba(14, 165, 217, 0.20)",

        "button-hover":
          "0 12px 28px rgba(14, 165, 217, 0.30)",

        /* Large hero */
        hero:
          "0 20px 60px rgba(18, 59, 99, 0.12)",

        /* Soft */
        soft:
          "0 2px 12px rgba(18, 59, 99, 0.06)",
      },

      backgroundImage: {
        /* Hero background */
        "hero-swirl":
          "radial-gradient(circle at 85% 20%, rgba(14,165,217,0.18), transparent 35%), radial-gradient(circle at 15% 80%, rgba(37,99,235,0.10), transparent 35%)",

        /* Blue gradient */
        "blue-gradient":
          "linear-gradient(135deg, #123B63 0%, #176CA5 50%, #0EA5D9 100%)",

        /* Light blue gradient */
        "light-gradient":
          "linear-gradient(135deg, #F5FAFD 0%, #EAF8FD 50%, #F8FCFF 100%)",

        /* Card gradient */
        "card-gradient":
          "linear-gradient(145deg, #ffffff 0%, #F4FBFF 100%)",

        /* CTA gradient */
        "cta-gradient":
          "linear-gradient(135deg, #0B2947 0%, #123B63 45%, #078BB9 100%)",
      },

      maxWidth: {
        content: "1200px",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },

      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },

        pulseSoft: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.75",
          },
        },

        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;