<template>
  <section id="code" class="code wrap">
    <header class="sec-head">
      <p class="track-tag"><i />MIXER · APPS</p>
      <h2 class="display">{{ $t('works.title') }}</h2>
      <p>{{ $t('works.description') }}</p>
    </header>

    <!-- channel display: shows the strip you are on (hover / focus on desktop, the centred strip on phones) -->
    <div class="lcd" aria-live="polite">
      <p class="lcd-head num">CH {{ String(active + 1).padStart(2, '0') }} · {{ cur.year }} · {{ cur.type.toUpperCase() }}</p>
      <Transition name="lcd" mode="out-in">
        <div :key="cur.slug" class="lcd-body">
          <h3 class="lcd-name">{{ cur.name }}</h3>
          <p class="lcd-text">{{ short(cur) }}</p>
          <div class="lcd-foot">
            <span class="lcd-stack">{{ cur.stack.join(' · ') }}</span>
            <NuxtLink class="btn btn-primary" :to="localePath(`/projects/${cur.slug}`)"><span>{{ $t('works.open') }} ↗</span></NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- every app is a channel strip: hover or focus records it in and puts it on the display -->
    <ol ref="desk" class="desk">
      <li
        v-for="(p, i) in rows"
        :key="p.slug"
        :data-i="i"
        class="strip"
        :class="{ on: i === active }"
        :style="{ '--lvl': p.level, '--d': `${(i % 4) * 0.11}s` }"
        @click.capture="pick(i, $event)"
      >
        <NuxtLink :to="localePath(`/projects/${p.slug}`)" class="ch" @pointerenter="e => e.pointerType === 'mouse' && (active = i)" @focus="e => (e.target as HTMLElement).matches(':focus-visible') && (active = i)">
          <span class="no num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="main">
            <span class="meter" aria-hidden="true"><i /><i /></span>
            <span class="name">{{ p.name }}</span>
          </span>
          <span class="year num">{{ p.year }}</span>
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { projects } from '~/data/project'
import { projectsData } from '~/data/project-detail'

const localePath = useLocalePath()
const { t, te } = useI18n()
const detail = projectsData as Record<string, { year?: string; techs?: string[] }>

// newest first; the meter's resting level = how many technologies the app runs on (real, from the case data)
const rows = projects
  .map(p => {
    const techs = detail[p.slug]?.techs?.length ?? p.stack.length
    return { ...p, year: detail[p.slug]?.year ?? '', level: Math.min(0.85, 0.25 + techs * 0.1).toFixed(2) }
  })
  .sort((a, b) => Number(b.year) - Number(a.year))

const active = ref(0)
const cur = computed(() => rows[active.value])
const short = (p: (typeof rows)[number]) => (te(`projects.${p.slug}.short`) ? t(`projects.${p.slug}.short`) : p.shortDesc)

// phones: the strip snapped to the left edge goes on the display; tapping another strip selects it first
const desk = ref<HTMLOListElement>()
let io: IntersectionObserver | undefined
onMounted(() => {
  if (!desk.value || !matchMedia('(max-width: 760px)').matches) return
  io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) active.value = Number((e.target as HTMLElement).dataset.i)
  }, { root: desk.value, rootMargin: '0px -75% 0px 0px' })
  desk.value.querySelectorAll('.strip').forEach(s => io!.observe(s))
})
onBeforeUnmount(() => io?.disconnect())

// touch: first tap puts a strip on the display, a second tap on it opens the case study
function pick(i: number, e: MouseEvent) {
  if (i === active.value || !matchMedia('(hover: none)').matches) return
  e.preventDefault()
  active.value = i
}
</script>

<style scoped>
.code { padding-block: clamp(96px, 14vh, 160px) clamp(64px, 10vh, 120px); }

/* display */
.lcd {
  margin-bottom: 10px; padding: clamp(16px, 2.4vw, 26px); border-radius: var(--clip-r);
  background: color-mix(in oklab, var(--text-primary) 6%, var(--bg-primary)); border: 1px solid var(--line);
  box-shadow: inset 0 0 40px color-mix(in oklab, var(--clip-code) 10%, transparent);
}
.lcd-head { font-size: var(--t-xs); color: var(--accent-text); }
.lcd-body { display: grid; gap: 10px; margin-top: 10px; min-height: 9.5rem; align-content: start; }
.lcd-name { font: 800 var(--t-l)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.03em; }
.lcd-text { color: var(--text-secondary); max-width: 52ch; }
.lcd-foot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 4px; }
.lcd-stack { font: 400 var(--t-xs)/1.4 var(--font-mono); color: var(--text-secondary); }
.lcd-enter-active, .lcd-leave-active { transition: opacity 0.2s, translate 0.35s var(--ease); }
.lcd-enter-from { opacity: 0; translate: 0 8px; }
.lcd-leave-to { opacity: 0; translate: 0 -6px; }

/* desk */
.desk {
  list-style: none; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 6px;
  padding: 10px; border-radius: var(--clip-r);
  background: color-mix(in oklab, var(--text-primary) 5%, var(--bg-primary));
  border: 1px solid var(--line);
}
.ch {
  position: relative; isolation: isolate; height: clamp(340px, 48vh, 460px);
  display: grid; grid-template-rows: auto 1fr auto; justify-items: center; gap: 12px;
  padding: 14px 8px 16px; border-radius: 4px; text-decoration: none;
  background: var(--bg-primary); border: 1px solid var(--line);
}
.ch::before { /* the strip records in from the bottom when it is the one you are on */
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--clip-code);
  clip-path: inset(100% 0 0 0); transition: clip-path 0.5s var(--ease);
}
.on .ch, .ch:focus-visible { color: var(--clip-code-ink); }
.on .ch::before, .ch:focus-visible::before { clip-path: inset(0 0 0 0); }
.no { font-size: var(--t-xs); color: var(--text-secondary); }
.on .no, .on .year { color: var(--clip-code-ink); }

/* middle row: meter beside the name, full height */
.main { width: 100%; min-height: 0; display: flex; justify-content: center; align-items: stretch; gap: 14px; }
.meter { display: flex; gap: 3px; align-items: flex-end; }
.meter i {
  width: 4px; height: 100%; border-radius: 2px; transform-origin: bottom;
  background: linear-gradient(to top, var(--clip-code) 0 60%, var(--accent) 60% 85%, var(--text-primary) 85%);
  scale: 1 calc(var(--lvl) * 0.5);
  animation: meter calc(60s / 140) var(--d) ease-out infinite; /* idle: every channel breathes on the beat */
}
.meter i + i { animation-delay: calc(var(--d) + 0.05s); }
.on .meter i { background: var(--clip-code-ink); animation-name: meter-hot; }
@keyframes meter { 0% { scale: 1 calc(var(--lvl) * 0.55); } 60% { scale: 1 calc(var(--lvl) * 0.35); } }
@keyframes meter-hot { 0% { scale: 1 0.98; } 60% { scale: 1 0.6; } }

.name {
  writing-mode: vertical-rl; rotate: 180deg; max-height: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: end;
  font: 800 clamp(1.05rem, 0.8rem + 0.8vw, 1.5rem)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.02em;
}
.year { font-size: var(--t-xs); color: var(--accent-text); }

/* phones: swipe the desk; the strip at the left edge (or the one you tapped) is on the display */
@media (max-width: 760px) {
  .desk {
    grid-auto-columns: 92px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
    scroll-padding-inline: 10px; scrollbar-width: none;
  }
  .desk::-webkit-scrollbar { display: none; }
  .strip { scroll-snap-align: start; }
  .ch { height: 300px; }
  .lcd-body { min-height: 11rem; }
}
@media (prefers-reduced-motion: reduce) { .meter i { animation: none; } }
</style>
