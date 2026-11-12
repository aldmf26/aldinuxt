<template>
  <!-- route change: spectrum bars rise and cover the page, a `cd` command types the destination, then the bars fall away -->
  <div ref="root" class="curtain" aria-hidden="true">
    <i v-for="n in BARS" :key="n" class="bar" />
    <p ref="label" class="cmd num"><span class="prompt">~$</span> {{ cmd }}<span class="caret" /></p>
  </div>
</template>

<script setup lang="ts">
const BARS = 12
const root = ref<HTMLElement>()
const label = ref<HTMLElement>()
const cmd = ref('')
const router = useRouter()
const nuxtApp = useNuxtApp()

// destination as a shell path: /en/projects/kasir-ok -> cd ./projects/kasir-ok
const pathOf = (p: string) => `cd ./${p.replace(/^\/(en)(\/|$)/, '').replace(/^\//, '') || '~'}`

let gsap: any
let covering: Promise<void> | null = null
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const off = router.beforeEach(async (to, from) => {
  // same page (hash links, query) or first load: no curtain
  if (!from.matched.length || to.path === from.path || reduce()) return
  gsap ??= (await import('gsap')).gsap
  cmd.value = pathOf(to.path)
  const bars = root.value!.querySelectorAll('.bar')
  const main = document.getElementById('main')
  covering = new Promise<void>(resolve => {
    const tl = gsap.timeline({ onComplete: resolve })
    tl.set(root.value, { visibility: 'visible' })
      .fromTo(bars, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1, duration: 0.55, ease: 'expo.inOut',
        stagger: { each: 0.035, from: 'random' }, // uneven rise, like a spectrum analyser
      })
      .fromTo(label.value, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' }, 0.35)
    if (main) tl.to(main, { scale: 0.96, opacity: 0.4, duration: 0.55, ease: 'expo.in' }, 0)
  })
  await covering // the new page renders only once the screen is covered
})

// new page is in: jump to top behind the curtain, then let the bars fall and the page come forward
const unhook = nuxtApp.hook('page:finish', async () => {
  if (!covering) return
  await covering
  covering = null
  const lenis = nuxtApp.$lenis as any
  lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  const bars = root.value!.querySelectorAll('.bar')
  const main = document.getElementById('main')
  const tl = gsap.timeline({
    onComplete: () => { gsap.set(root.value, { visibility: 'hidden' }); ScrollTrigger.refresh() },
  })
  tl.to(label.value, { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' })
    .to(bars, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.6, ease: 'expo.inOut', stagger: { each: 0.03, from: 'center' } }, 0.1)
  if (main) tl.fromTo(main, { scale: 1.04, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.2)
})

onBeforeUnmount(() => { off(); unhook() })
</script>

<style scoped>
.curtain {
  position: fixed; inset: 0; z-index: 300; pointer-events: none; visibility: hidden;
  display: grid; grid-template-columns: repeat(12, 1fr);
}
/* code and sound take turns across the bars */
.bar { display: block; height: 100%; background: var(--clip-code); } /* scale set by GSAP only; the curtain is hidden between transitions */
.bar:nth-child(even) { background: var(--clip-beat); }
.cmd {
  position: absolute; left: 50%; top: 50%; translate: -50% -50%; white-space: nowrap;
  padding: 12px 18px; border-radius: var(--clip-r); background: var(--bg-primary); color: var(--text-primary);
  font-size: clamp(0.8rem, 0.7rem + 0.5vw, 1.05rem); opacity: 0;
}
.prompt { color: var(--accent-text); margin-right: 6px; }
.caret { display: inline-block; width: 0.6em; height: 1.1em; margin-left: 4px; vertical-align: -0.2em; background: var(--accent); animation: blink 0.9s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
