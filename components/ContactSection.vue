<template>
  <footer id="contact" class="end">
    <div class="wrap">
      <p class="marker num"><i />{{ $t('contact.marker') }}</p>
      <h2 class="title display">{{ $t('contact.title') }}</h2>
      <div class="cta">
        <a class="btn btn-primary" :href="WA" target="_blank" rel="noopener"><span>{{ $t('contact.whatsapp') }}</span></a>
        <a class="btn" :href="`mailto:${EMAIL}`"><span>{{ EMAIL }}</span></a>
      </div>

      <p class="big display" aria-hidden="true">FahrizAldi</p>

      <div class="foot">
        <ul class="social">
          <li v-for="s in SOCIAL" :key="s.url"><a :href="s.url" target="_blank" rel="noopener">{{ s.label }}</a></li>
        </ul>
        <p class="small">© {{ year }} Aldi Fahrizaldi · Banjarmasin · {{ $t('contact.colophon') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const WA = 'https://wa.me/6289541311053'
const EMAIL = 'aldimf26@gmail.com'
const year = new Date().getFullYear()
const SOCIAL = [
  { label: 'YouTube', url: 'https://www.youtube.com/@ALdMFbeat' },
  { label: 'Instagram', url: 'https://www.instagram.com/aldiiimf' },
  { label: 'GitHub', url: 'https://github.com/aldmf26' },
]
</script>

<style scoped>
.end { border-top: 1px solid var(--line); padding-top: clamp(64px, 12vh, 140px); overflow: hidden; container-type: inline-size; }
.marker { display: flex; align-items: center; gap: 10px; font-size: var(--t-xs); color: var(--text-secondary); }
.marker i { width: 2px; height: 18px; background: var(--accent); }
.title { font-size: var(--t-xl); margin-top: 18px; max-width: 14ch; }
.cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.big {
  margin-top: clamp(64px, 12vh, 140px); margin-left: -0.05em; white-space: nowrap;
  font-size: 16.5cqi; color: color-mix(in oklab, var(--text-primary) 52%, var(--bg-primary));
}
.foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; padding: 22px 0 28px; border-top: 1px solid var(--line); font-size: var(--t-s); }
.social { list-style: none; display: flex; gap: 20px; }
.social a { color: var(--text-secondary); text-decoration: none; padding: 6px 0; display: inline-block; }
.social a:hover, .social a:focus-visible { color: var(--text-primary); }
.small { color: var(--text-secondary); }
@media (max-width: 640px) { .cta .btn { flex: 1 1 100%; } }
</style>
