<template>
  <!-- Transport bar: name, where the playhead is, the few places to go, theme and language -->
  <nav class="transport" :class="{ away }" :aria-label="$t('nav.label')">
    <NuxtLink :to="localePath('/')" class="brand">ALDMF<span class="sr-only"> Aldi Fahrizaldi</span></NuxtLink>

    <p class="readout num" aria-hidden="true">
      <span class="bpm">{{ BPM }} BPM</span>
      <span class="pos"><b>{{ Math.floor(year) }}</b> · BAR {{ String(bar).padStart(2, '0') }}</span>
    </p>

    <ul class="links">
      <li><a :href="localePath('/') + '#code'">{{ $t('nav.code') }}</a></li>
      <li><a :href="localePath('/') + '#beats'">{{ $t('nav.beats') }}</a></li>
      <li><NuxtLink :to="localePath('/cv')" :aria-current="isCv ? 'page' : undefined">CV</NuxtLink></li>
    </ul>

    <div class="tools">
      <div class="swatches" role="group" :aria-label="$t('nav.accent')">
        <button
          v-for="a in ACCENTS"
          :key="a.id"
          type="button"
          class="swatch"
          :style="{ '--c': a.hex }"
          :aria-pressed="accent === a.id"
          :aria-label="a.label"
          :title="a.label"
          @click="setAccent(a.id, $event)"
        />
      </div>
      <button type="button" class="swatch cycle" :style="{ '--c': accentHex }" :aria-label="$t('nav.accent')" @click="cycle" />
      <div class="langs">
        <NuxtLink
          v-for="code in ['id', 'en']"
          :key="code"
          :to="switchLocalePath(code)"
          :lang="code"
          :aria-current="locale === code ? 'true' : undefined"
        >{{ code.toUpperCase() }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { BPM } from '~/data/timeline'

const { accent, accentHex, setAccent } = useSide()
const { year, bar } = usePlayhead()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
const route = useRoute()
const isCv = computed(() => route.path.endsWith('/cv'))

// phones get one swatch that steps through the four themes
const cycle = (e: MouseEvent) => {
  const i = ACCENTS.findIndex(a => a.id === accent.value)
  setAccent(ACCENTS[(i + 1) % ACCENTS.length].id, e)
}

// the bar steps aside while reading down, comes back on the way up
const away = ref(false)
let st: { kill: () => void } | undefined
onMounted(async () => {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { away.value = self.direction === 1 && self.scroll() > 200 } })
})
onUnmounted(() => st?.kill())
</script>

<style scoped>
.transport {
  position: fixed; inset: 0 0 auto; z-index: 100; height: var(--bar-h);
  display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 20px;
  padding-inline: var(--margin);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--line);
  transition: translate 0.5s var(--ease);
}
.transport.away { translate: 0 -100%; }
.transport:focus-within { translate: 0 0; }
.brand {
  font: 800 1.05rem/1 var(--font-display); font-variation-settings: 'wdth' 125; letter-spacing: -0.02em;
  text-decoration: none; padding: 8px 0;
}
.readout { display: flex; gap: 18px; font-size: var(--t-xs); color: var(--text-secondary); }
.readout b { color: var(--accent); font-weight: 500; }
.links { list-style: none; display: flex; gap: 22px; }
.links a {
  position: relative; display: inline-block; padding: 8px 4px; min-width: 28px; text-align: center; text-decoration: none; font-weight: 600; font-size: var(--t-s);
}
/* nav answers like a region being recorded: a bar draws under it from the left */
.links a::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 2px; background: var(--accent);
  transform-origin: left; scale: 0 1; transition: scale 0.4s var(--ease);
}
.links a:hover::after, .links a:focus-visible::after, .links a[aria-current='page']::after { scale: 1 1; }
.tools { display: flex; align-items: center; gap: 16px; }
.swatches { display: flex; gap: 6px; }
.swatch {
  width: 24px; height: 24px; border-radius: 4px; border: 0; padding: 0; cursor: pointer;
  background: var(--c); transition: scale 0.2s var(--ease);
}
.swatch:hover { scale: 1.15; }
.swatch[aria-pressed='true'] { outline: 2px solid var(--text-primary); outline-offset: 2px; }
.swatch:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
.cycle { display: none; }
.langs { display: flex; gap: 10px; font-weight: 600; font-size: var(--t-s); }
.langs a { color: var(--text-secondary); text-decoration: none; padding: 8px 4px; min-width: 28px; text-align: center; }
.langs a:hover { color: var(--text-primary); }
.langs a[aria-current='true'] { color: var(--text-primary); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--accent); text-decoration-thickness: 2px; }

@media (max-width: 860px) {
  .transport { grid-template-columns: auto 1fr auto; gap: 14px; }
  .readout { display: none; }
  .links { justify-self: end; gap: 14px; }
  .swatches { display: none; }
  .cycle { display: block; }
  .tools { gap: 12px; }
}
@media (prefers-reduced-motion: reduce) { .transport.away { translate: 0 0; } }
</style>
