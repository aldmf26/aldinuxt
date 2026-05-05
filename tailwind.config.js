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
        dark: {
          DEFAULT: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-surface)',
        },
        lime: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
        },
        cool: {
          DEFAULT: 'var(--highlight)',
        },
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        highlight: 'var(--highlight)',
        dev: 'var(--bg-surface)',
        studio: 'var(--bg-primary)',
        music: 'var(--bg-primary)',
      },
      fontFamily: {
        display: ['"Editorial New"', 'Georgia', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
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