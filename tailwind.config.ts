import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card-background)',
          foreground: 'var(--foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: '#ffffff',
          hover: 'var(--accent-hover)',
        },
        muted: {
          DEFAULT: 'var(--text-muted)',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'var(--border)',
        input: 'var(--input)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
};

export default config;
