import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        text: "var(--color-text)",
        "text-2": "var(--color-text-2)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        "primary-weak": "var(--color-primary-weak)",
        "on-primary": "var(--color-on-primary)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)"
      }
    }
  },
  plugins: []
} satisfies Config;
