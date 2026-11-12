<template>
  <!-- first visit only: counts real loading, a 16-step sequencer keeps time, then the screen splits open -->
  <div v-if="show" ref="root" class="loader" role="status" :aria-label="$t('loader.label')">
    <span class="half top" />
    <span class="half bottom" />
    <div class="core">
      <p class="count num" aria-hidden="true">{{ String(pct).padStart(3, '0') }}</p>
      <ol class="steps" aria-hidden="true">
        <li v-for="(g, i) in GLYPHS" :key="i" :style="{ '--i': i }">{{ g }}</li>
      </ol>
      <p class="log num" aria-hidden="true">{{ log }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const GLYPHS = [';', '{', '}', '=>', '</>', '<', '>', '[]', '$', '#', '&&', '//', '()', '::', '++', '♪']
const show = ref(true)
const pct = ref(0)
const root = ref<HTMLElement>()
const done = useState('loaderDone', () => false)
const { t } = useI18n()
const LOG = ['loader.l1', 'loader.l2', 'loader.l3', 'loader.l4']
const log = computed(() => t(LOG[Math.min(LOG.length - 1, Math.floor(pct.value / 26))]))

onMounted(async () => {
  // already seen this session (the head script marks <html>): straight in
  if (document.documentElement.classList.contains('seen')) return finish()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const { gsap } = await import('gsap')
  const main = document.getElementById('main')
  const state = { p: 0 }
  // creep to 90 while the page really loads; the last 10 only once fonts + assets are in
  const creep = gsap.to(state, { p: 90, duration: 0.9, ease: 'power1.out', onUpdate: () => { pct.value = Math.round(state.p) } })
  const loaded = new Promise<void>(r => (document.readyState === 'complete' ? r() : addEventListener('load', () => r(), { once: true })))
  const timeout = new Promise<void>(r => setTimeout(r, 1400)) // never hold the visitor longer than this (thumbnails may still be loading)
  await Promise.race([Promise.all([loaded, document.fonts.ready, new Promise(r => setTimeout(r, 700))]), timeout])
  creep.kill()
  await gsap.to(state, { p: 100, duration: 0.2, ease: 'power2.out', onUpdate: () => { pct.value = Math.round(state.p) } })

  done.value = true
  try { sessionStorage.setItem('aldi-seen', '1') } catch {}
  if (reduce || !root.value) return finish()
  // the screen opens like a portal; the page underneath comes forward out of the depth
  const tl = gsap.timeline({ onComplete: finish })
  tl.to(root.value.querySelector('.core'), { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' })
    .to(root.value.querySelector('.top'), { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, 0.12)
    .to(root.value.querySelector('.bottom'), { yPercent: 100, duration: 0.75, ease: 'expo.inOut' }, 0.12)
  if (main) tl.fromTo(main, { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.25)
})

async function finish() {
  done.value = true
  show.value = false
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  ScrollTrigger.refresh() // pinned sections measured while the page was scaled
}
</script>

<style scoped>
.loader {
  position: fixed; inset: 0; z-index: 400; display: grid; place-items: center; pointer-events: none;
  animation: bail 0s 3.5s forwards; /* safety: if scripts never run, the page still shows */
}
:global(html.seen) .loader { display: none; } /* seen this session: no loader, not even for a frame */
@keyframes bail { to { visibility: hidden; } }
.half { position: absolute; left: 0; right: 0; height: 50.5%; background: var(--bg-primary); }
.half.top { top: 0; border-bottom: 1px solid var(--line); }
.half.bottom { bottom: 0; }
.core { position: relative; display: grid; justify-items: center; gap: 22px; padding: 0 16px; }
.count {
  font: 800 clamp(4rem, 2rem + 12vw, 11rem)/0.85 var(--font-display); font-variation-settings: 'wdth' 125;
  letter-spacing: -0.05em; font-variant-numeric: tabular-nums;
}
.steps { list-style: none; display: grid; grid-template-columns: repeat(16, 1fr); gap: 6px; }
.steps li {
  width: clamp(16px, 4vw, 30px); aspect-ratio: 1; display: grid; place-items: center; border-radius: 3px;
  border: 1px solid var(--line); font: 500 clamp(0.5rem, 0.4rem + 0.4vw, 0.75rem)/1 var(--font-mono); color: var(--text-secondary);
  /* a 1/16 step every 60/140/4 s: one bar of the sequencer per 1.7 s */
  animation: step calc(16 * 60s / 140 / 4) steps(1) infinite;
  animation-delay: calc(var(--i) * 60s / 140 / 4);
}
.steps li:nth-child(4n + 1) { border-color: color-mix(in oklab, var(--text-primary) 30%, transparent); } /* the downbeats */
@keyframes step {
  0% { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
  6.25% { background: transparent; color: var(--text-secondary); border-color: var(--line); }
}
.log { font-size: var(--t-xs); color: var(--text-secondary); min-height: 1.4em; }
@media (max-width: 520px) {
  .steps { grid-template-columns: repeat(8, 1fr); }
}
@media (prefers-reduced-motion: reduce) { .steps li { animation: none; } }
</style>
