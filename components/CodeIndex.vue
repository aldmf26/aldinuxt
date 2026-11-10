<template>
  <section id="code" class="code wrap">
    <header class="sec-head">
      <p class="track-tag"><i />MIXER · APPS</p>
      <h2 class="display">{{ $t('works.title') }}</h2>
      <p>{{ $t('works.description') }}</p>
    </header>

    <!-- every app is a channel strip: hover or focus records it in and drives its meter -->
    <ol class="desk">
      <li v-for="(p, i) in rows" :key="p.slug" class="strip" :style="{ '--lvl': p.level, '--d': `${(i % 4) * 0.11}s` }">
        <NuxtLink :to="localePath(`/projects/${p.slug}`)" class="ch">
          <span class="no num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="main">
            <span class="meter" aria-hidden="true"><i /><i /></span>
            <span class="name">{{ p.name }}</span>
          </span>
          <span class="type">{{ p.type }}</span>
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
const detail = projectsData as Record<string, { year?: string; techs?: string[] }>

// newest first; the meter's resting level = how many technologies the app runs on (real, from the case data)
const rows = projects
  .map(p => {
    const techs = detail[p.slug]?.techs?.length ?? p.stack.length
    return { ...p, year: detail[p.slug]?.year ?? '', level: Math.min(0.85, 0.25 + techs * 0.1).toFixed(2) }
  })
  .sort((a, b) => Number(b.year) - Number(a.year))
</script>

<style scoped>
.code { padding-block: clamp(96px, 14vh, 160px) clamp(64px, 10vh, 120px); }
.desk {
  list-style: none; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 6px;
  padding: 10px; border-radius: var(--clip-r);
  background: color-mix(in oklab, var(--text-primary) 5%, var(--bg-primary));
  border: 1px solid var(--line);
}
.ch {
  position: relative; isolation: isolate; height: clamp(440px, 62vh, 600px);
  display: grid; grid-template-rows: auto 1fr auto auto; justify-items: center; gap: 12px;
  padding: 14px 8px 16px; border-radius: 4px; text-decoration: none;
  background: var(--bg-primary); border: 1px solid var(--line);
}
.ch::before { /* the strip records in from the bottom when it is the one you are on */
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--clip-code);
  clip-path: inset(100% 0 0 0); transition: clip-path 0.5s var(--ease);
}
.ch:hover, .ch:focus-visible { color: var(--clip-code-ink); }
.ch:hover::before, .ch:focus-visible::before { clip-path: inset(0 0 0 0); }
.no { font-size: var(--t-xs); color: var(--text-secondary); }
.ch:hover .no, .ch:focus-visible .no, .ch:hover .type, .ch:focus-visible .type, .ch:hover .year, .ch:focus-visible .year { color: var(--clip-code-ink); }

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
.ch:hover .meter i, .ch:focus-visible .meter i { background: var(--clip-code-ink); animation-name: meter-hot; }
@keyframes meter { 0% { scale: 1 calc(var(--lvl) * 0.55); } 60% { scale: 1 calc(var(--lvl) * 0.35); } }
@keyframes meter-hot { 0% { scale: 1 0.98; } 60% { scale: 1 0.6; } }

.name {
  writing-mode: vertical-rl; rotate: 180deg; max-height: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: end;
  font: 800 clamp(1.05rem, 0.8rem + 0.8vw, 1.5rem)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.02em;
}
.type { font-size: var(--t-xs); color: var(--text-secondary); text-align: center; line-height: 1.2; min-height: 2.4em; }
.year { font-size: var(--t-xs); color: var(--accent); }

/* phones: the desk scrolls sideways, one strip snaps at a time */
@media (max-width: 760px) {
  .desk { grid-auto-columns: 46%; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
  .strip { scroll-snap-align: start; }
  .ch { height: 400px; }
}
@media (prefers-reduced-motion: reduce) { .meter i { animation: none; } }
</style>
