<template>
  <section id="hero" ref="root" class="hero wrap">
    <p class="count num" aria-hidden="true">
      <span v-for="n in 4" :key="n">{{ n }}</span>
    </p>

    <h1 class="display name">
      <span class="w"><span>FahrizAldi</span></span>
    </h1>

    <div class="under">
      <p class="lede">{{ $t('hero.lede') }}</p>
      <div class="cta">
        <a class="btn btn-primary" href="#playlist" @click.prevent="play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" /></svg>
          <span>{{ $t('hero.play') }}</span>
        </a>
        <a class="btn" :href="WA" target="_blank" rel="noopener"><span>{{ $t('contact.whatsapp') }}</span></a>
      </div>
    </div>

    <dl class="meta">
      <div><dt>{{ $t('hero.base') }}</dt><dd>Banjarmasin, ID</dd></div>
      <div><dt><i class="dot code" />{{ $t('hero.code') }}</dt><dd>Laravel · Nuxt · MySQL</dd></div>
      <div><dt><i class="dot beat" />{{ $t('hero.sound') }}</dt><dd>FL Studio · rap · trap · remix</dd></div>
    </dl>
  </section>
</template>

<script setup lang="ts">
const WA = 'https://wa.me/6289541311053'
const root = ref<HTMLElement>()
let ctx: { revert: () => void } | undefined

// "Play the timeline": glide down to the playlist; its pinned scroll does the rest
function play() {
  const el = document.getElementById('playlist')
  if (!el) return
  const lenis = useNuxtApp().$lenis as any
  lenis ? lenis.scrollTo(el, { duration: 1.2 }) : el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

onMounted(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  const { gsap } = await import('gsap')
  ctx = gsap.context(() => {
    // the name settles onto the grid; the count-in squares keep time below (CSS, on the beat)
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('.w > span', { yPercent: 40, duration: 0.9, stagger: 0.06 })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<style scoped>
.hero {
  min-height: 100svh; container-type: inline-size;
  display: grid; align-content: end; gap: clamp(20px, 3vw, 36px);
  padding-top: calc(var(--bar-h) + 32px); padding-bottom: clamp(28px, 5vh, 56px);
}
.count { display: flex; gap: 14px; font-size: var(--t-xs); color: var(--text-secondary); }
.count span {
  width: 22px; height: 22px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 3px;
  animation: tick calc(4 * 60s / 140) steps(1) infinite; /* 140 BPM metronome, one square per beat */
}
.count span:nth-child(2) { animation-delay: calc(60s / 140); }
.count span:nth-child(3) { animation-delay: calc(2 * 60s / 140); }
.count span:nth-child(4) { animation-delay: calc(3 * 60s / 140); }
@keyframes tick { 0% { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); } 25% { background: transparent; color: inherit; border-color: var(--line); } }
@media (prefers-reduced-motion: reduce) { .count span { animation: none; } }
.name {
  font-size: clamp(3rem, 13.4cqi, 15rem);
  margin-left: -0.05em; display: grid;
}
.w { display: block; overflow: hidden; padding-bottom: 0.06em; }
.w > span { display: block; }
.under {
  display: grid; grid-template-columns: minmax(0, 38rem) auto; justify-content: space-between; align-items: end; gap: 24px 48px;
}
.lede { font-size: var(--t-m); line-height: 1.35; color: var(--text-primary); text-wrap: pretty; }
.cta { display: flex; flex-wrap: wrap; gap: 12px; }
.meta {
  display: grid; grid-template-columns: repeat(3, auto); justify-content: start; gap: 8px clamp(24px, 5vw, 72px);
  padding-top: 18px; border-top: 1px solid var(--line); font-size: var(--t-s);
}
.meta dt { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font: 400 var(--t-xs)/1.6 var(--font-mono); }
.meta dd { font-weight: 600; }
.dot { width: 14px; height: 8px; border-radius: 2px; background: var(--clip-code); }
.dot.beat { background: var(--clip-beat); }

@media (max-width: 760px) {
  .hero { align-content: center; }
  .name { font-size: 19.5cqi; font-variation-settings: 'wdth' 75; letter-spacing: -0.015em; line-height: 0.88; }
  .under { grid-template-columns: 1fr; }
  .cta .btn { flex: 1 1 100%; }
  .meta { grid-template-columns: 1fr 1fr; }
  .meta div:first-child { grid-column: 1 / -1; }
}
</style>
