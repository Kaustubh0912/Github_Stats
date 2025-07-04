/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    // Language bar colors - these will never be purged
    "bg-blue-500",
    "bg-yellow-400", 
    "bg-green-500",
    "bg-rose-600",      // C++
    "bg-violet-600",    // C#
    "bg-emerald-500",   // ShaderLab
    "bg-red-600",
    "bg-blue-700",
    "bg-orange-400",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-green-400",
    "bg-orange-300",
    "bg-gray-700",
    "bg-yellow-600",
    "bg-zinc-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-red-700",
    "bg-lime-500",
    "bg-green-600",
    "bg-blue-600",
    "bg-blue-400",
    "bg-cyan-600",
    "bg-amber-600",
    "bg-green-700",
    "bg-gray-600",
    "bg-purple-700",
    "bg-blue-800",
    "bg-indigo-600",
    "bg-blue-300",
    "bg-orange-600",
    "bg-purple-600",
    "bg-purple-400",
    "bg-red-400",
    "bg-green-600",
    "bg-violet-500",
    "bg-red-300",
    "bg-yellow-700",
    "bg-blue-900",
    "bg-gray-500",      // Fallback color
    
    // Optional: Add hover and focus variants if needed
    "hover:bg-blue-600",
    "hover:bg-yellow-500",
    "hover:bg-green-600",
    // ... add more hover states as needed
  ],
}