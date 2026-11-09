<template>
  <section id="contact" class="contact">
    <h2 class="title">{{ $t('contact.title') }}<br>{{ $t('contact.accent') }}</h2>
    <div class="cta">
      <a class="btn btn-primary" :href="WA" target="_blank" rel="noopener">{{ $t('contact.whatsapp') }}</a>
      <a class="btn btn-ghost" :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
    </div>
    <ul class="social">
      <li v-for="s in SOCIAL" :key="s.url">
        <a :href="s.url" target="_blank" rel="noopener" :aria-label="s.label">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="s.icon" /></svg>
          <span>{{ s.label }}</span>
        </a>
      </li>
    </ul>
    <footer class="foot">© {{ year }} Aldi Fahrizaldi · Banjarmasin</footer>
  </section>
</template>

<script setup>
const WA = 'https://wa.me/6289541311053'
const EMAIL = 'aldimf26@gmail.com'
const year = new Date().getFullYear()
// simple-icons paths (CC0)
const SOCIAL = [
  { label: 'Instagram', url: 'https://www.instagram.com/aldiiimf', icon: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z' },
  { label: 'YouTube', url: 'https://www.youtube.com/@ALdMFbeat', icon: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z' },
  { label: 'GitHub', url: 'https://github.com/aldmf26', icon: 'M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3' },
]
</script>

<style scoped>
.contact { max-width: 1100px; margin: 0 auto; padding: 120px 16px 40px; text-align: center; }
.title {
  font-family: var(--font-display); font-weight: 800; letter-spacing: -0.04em;
  font-size: clamp(3rem, 9vw, 6rem); line-height: 0.9; text-wrap: balance;
}
.cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 36px; }
.social { list-style: none; display: flex; justify-content: center; gap: 28px; margin-top: 48px; }
.social a { display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); text-decoration: none; font-weight: 500; }
.social a:hover { color: var(--text-primary); }
.social svg { width: 20px; height: 20px; fill: currentColor; }
.foot { margin-top: 96px; color: var(--text-muted); font-size: 0.95rem; }
@media (max-width: 480px) { .social span { display: none; } .social svg { width: 26px; height: 26px; } }
</style>
