import type { Config } from "tailwindcss"

const config: Omit<Config, "content"> = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Algol Brand Colors
        brand: {
          "teal-darkest": "hsl(180, 60%, 14%)",
          "teal-dark": "hsl(180, 55%, 18%)",
          "teal-medium": "hsl(175, 65%, 24%)",
          "teal-light": "hsl(170, 50%, 35%)",
          golden: "hsl(45, 50%, 54%)",
          "golden-light": "hsl(45, 60%, 65%)",
          "cream-warm": "hsl(40, 100%, 97%)",
          "cream-soft": "hsl(40, 50%, 94%)",
        },
        // Subsidiary Colors
        financia: {
          primary: "hsl(45, 50%, 54%)",
          secondary: "hsl(180, 55%, 18%)",
          accent: "hsl(38, 92%, 50%)",
        },
        security: {
          primary: "hsl(175, 65%, 24%)",
          secondary: "hsl(180, 60%, 14%)",
          accent: "hsl(174, 84%, 47%)",
        },
        analytics: {
          primary: "hsl(217, 91%, 60%)",
          secondary: "hsl(180, 55%, 18%)",
          accent: "hsl(199, 89%, 48%)",
        },
        digital: {
          primary: "hsl(262, 83%, 58%)",
          secondary: "hsl(180, 55%, 18%)",
          accent: "hsl(280, 87%, 65%)",
        },
        forensics: {
          primary: "hsl(0, 72%, 51%)",
          secondary: "hsl(180, 60%, 14%)",
          accent: "hsl(14, 89%, 55%)",
        },
        // Semantic Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        pulse: "pulse 2s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
