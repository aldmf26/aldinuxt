/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Background tokens
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        // Text tokens
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        // Accent tokens
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'accent2': 'var(--accent2)',
        // Border tokens
        border: 'var(--border)',
        'border-accent': 'var(--border-accent)',
        'border-strong': 'var(--border-strong)',
        // Legacy aliases (keep for backward compat)
        lime: { DEFAULT: 'var(--accent)', dim: 'var(--accent-dim)' },
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        text: { primary: 'var(--text-primary)', muted: 'var(--text-muted)', secondary: 'var(--text-secondary)' },
        dark: { DEFAULT: 'var(--bg-primary)', surface: 'var(--bg-surface)', elevated: 'var(--bg-elevated)' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        hand: ['"Rockabye"', 'cursive'],
      },
      fontSize: {
        'hero': 'clamp(80px, 12vw, 180px)',
        'section': 'clamp(60px, 8vw, 140px)',
        'works': 'clamp(120px, 15vw, 220px)',
      },
      animation: {
        'marquee-left': 'marquee-left 40s linear infinite',
        'marquee-right': 'marquee-right 30s linear infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'waveform': {
          '0%': { height: '20%' },
          '100%': { height: '80%' },
        },
      },
    },
  },
  plugins: [],
}
