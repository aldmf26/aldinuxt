<template>
  <section id="playlist" ref="root" class="playlist" :aria-label="$t('timeline.title')">
    <div ref="stage" class="stage wrap" :style="{ '--p': progress }">
      <header class="pl-head">
        <h2 class="display">{{ $t('timeline.title') }}</h2>
        <p>{{ $t('timeline.sub') }}</p>
      </header>

      <div class="board">
        <!-- markers: real dated facts -->
        <div class="row markers" aria-hidden="true">
          <div class="hd" />
          <div class="lane">
            <span v-for="m in markers" :key="m.year" class="marker" :style="{ left: pct(m.year) + '%' }">{{ $t(m.key) }}</span>
          </div>
        </div>

        <!-- ruler: one bar per year -->
        <div class="row ruler" aria-hidden="true">
          <div class="hd num">BAR</div>
          <div class="lane">
            <span v-for="i in BARS" :key="i" class="tick num" :class="{ on: bar >= i }">
              <b>{{ i }}</b><em>{{ FIRST_YEAR + i - 1 }}</em>
            </span>
          </div>
        </div>

        <div v-for="t in tracks" :key="t.id" class="row track" :class="[t.kind, solo && solo !== t.kind && 'muted']">
          <div class="hd">
            <span class="tname">{{ t.name }}</span>
            <button
              type="button"
              class="solo"
              :aria-pressed="solo === t.kind"
              :aria-label="$t('timeline.solo', { track: t.name })"
              @click="toggleSolo(t.kind)"
            >S</button>
          </div>
          <ol class="lane">
            <li
              v-for="c in t.clips"
              :key="c.id"
              class="clip"
              :class="{ live: live.includes(c), played: year >= c.start + c.len }"
              :style="{ left: pct(c.start) + '%', width: (c.len / BARS) * 100 + '%' }"
            >
              <NuxtLink v-if="hrefOf(c)" :to="hrefOf(c)"><span>{{ nameOf(c) }}</span></NuxtLink>
              <div v-else><span>{{ nameOf(c) }}</span></div>
            </li>
          </ol>
        </div>

        <div class="playhead-track" aria-hidden="true"><i class="playhead" /></div>
      </div>

      <!-- what the playhead is on right now -->
      <div class="now" aria-live="polite">
        <p class="now-pos num">{{ Math.floor(year) }} · BAR {{ String(bar).padStart(2, '0') }}</p>
        <div v-for="t in tracks" :key="t.id" class="now-clip" :class="t.kind">
          <span class="lbl"><i />{{ t.name }}</span>
          <NuxtLink v-if="now[t.id] && hrefOf(now[t.id]!)" class="now-name" :to="hrefOf(now[t.id]!)!">{{ nameOf(now[t.id]!) }}<span aria-hidden="true"> ↗</span></NuxtLink>
          <span v-else class="now-name">{{ now[t.id] ? nameOf(now[t.id]!) : $t('timeline.rest') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BARS, BPM, FIRST_YEAR, appClips, beatClips, clipAt, clipNear, jobClips, markers, pct, type Clip } from '~/data/timeline'

const localePath = useLocalePath()
const { t } = useI18n()
const { setSide } = useSide()
const { progress, year, bar } = usePlayhead()
const root = ref<HTMLElement>()
const stage = ref<HTMLElement>()

const tracks = [
  { id: 'jobs', kind: 'code' as const, name: 'JOBS', clips: jobClips },
  { id: 'apps', kind: 'code' as const, name: 'APPS', clips: appClips },
  { id: 'beats', kind: 'beat' as const, name: 'BEATS', clips: beatClips },
]

const nameOf = (c: Clip) => (c.key ? t(c.key) : c.label)
const hrefOf = (c: Clip) => (c.slug ? localePath(`/projects/${c.slug}`) : c.href?.startsWith('#') ? localePath('/') + c.href : c.href ? localePath(c.href) : undefined)
const live = computed(() => tracks.map(tr => clipAt(tr.clips, year.value)).filter(Boolean))
const now = computed(() => Object.fromEntries(tracks.map(tr => [tr.id, clipNear(tr.clips, year.value)])) as Record<string, Clip | undefined>)

// Solo a track: the other one dims, and the channel rack below follows (dev keyboard / producer pads)
const solo = ref<'code' | 'beat' | null>(null)
function toggleSolo(id: 'code' | 'beat') {
  solo.value = solo.value === id ? null : id
  if (solo.value) setSide(solo.value === 'code' ? 'dev' : 'producer')
}

let st: { kill: () => void } | undefined
onMounted(async () => {
  progress.value = 0.02
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) {
    progress.value = 0.999 // static: everything played, the lists below carry the detail
    return
  }
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  st = ScrollTrigger.create({
    trigger: root.value,
    start: 'top top',
    end: () => '+=' + innerHeight * 2.4,
    pin: stage.value,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => { progress.value = 0.02 + self.progress * 0.977 },
  })
})
onBeforeUnmount(() => st?.kill())

const beat = `${(60 / BPM).toFixed(3)}s`
</script>

<style scoped>
.stage {
  min-height: 100svh; display: grid; align-content: center; gap: clamp(20px, 3.5vh, 40px);
  padding-top: calc(var(--bar-h) + 16px); padding-bottom: 24px;
  --hd: clamp(64px, 9vw, 132px);
}
.pl-head { display: grid; grid-template-columns: auto minmax(0, 26rem); justify-content: space-between; align-items: end; gap: 12px 40px; }
.pl-head h2 { font-size: var(--t-xl); }
.pl-head p { color: var(--text-secondary); font-size: var(--t-body); }

.board { position: relative; display: grid; gap: 6px; }
.row { display: grid; grid-template-columns: var(--hd) 1fr; align-items: stretch; }
.lane { position: relative; list-style: none; margin: 0; padding: 0; }

/* bar grid lives behind both tracks */
.track .lane {
  height: clamp(54px, 9vh, 92px);
  background:
    repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px calc(100% / 40)),
    repeating-linear-gradient(90deg, color-mix(in oklab, var(--text-primary) 26%, transparent) 0 1px, transparent 1px calc(100% / 10));
  background-color: color-mix(in oklab, var(--text-primary) 3%, transparent);
  border-block: 1px solid var(--line);
}
.hd {
  display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-right: 10px;
  font: 500 var(--t-xs)/1 var(--font-mono); color: var(--text-secondary);
}
.track .hd { border-left: 3px solid var(--clip-code); padding-left: 10px; background: color-mix(in oklab, var(--text-primary) 4%, transparent); }
.track.beat .hd { border-left-color: var(--clip-beat); }
.tname { color: var(--text-primary); font-weight: 500; }
.solo {
  flex: none; width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--line); background: transparent;
  color: var(--text-secondary); font: 500 var(--t-xs)/1 var(--font-mono); cursor: pointer;
  transition: background-color 0.2s, color 0.2s, scale 0.2s var(--ease);
}
.solo:hover { scale: 1.1; color: var(--text-primary); }
.solo[aria-pressed='true'] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.track.muted .lane { opacity: 0.25; }

.markers .lane { height: 22px; }
.marker {
  position: absolute; bottom: 0; translate: 0 0; white-space: nowrap;
  font-size: var(--t-xs); color: var(--text-secondary); padding-left: 8px; border-left: 1px solid var(--accent);
}
.ruler .lane { display: grid; grid-template-columns: repeat(10, 1fr); height: 28px; }
.tick { display: flex; align-items: baseline; gap: 8px; padding-left: 6px; border-left: 1px solid var(--line); font-size: var(--t-xs); color: var(--text-secondary); }
.tick b { font-weight: 500; }
.tick em { font-style: normal; opacity: 0.7; }
.tick.on b { color: var(--text-primary); }

/* clips */
.clip { position: absolute; top: 6px; bottom: 6px; min-width: 6px; }
.clip > * {
  position: relative; display: flex; align-items: flex-start; height: 100%; overflow: hidden;
  padding: 6px 8px; border-radius: var(--clip-r); text-decoration: none;
  font-weight: 700; font-size: clamp(0.7rem, 0.62rem + 0.35vw, 0.92rem); line-height: 1.1;
  background: color-mix(in oklab, var(--clip-code) 30%, var(--bg-primary));
  color: var(--text-primary);
  transition: background-color 0.35s var(--ease), color 0.35s var(--ease);
}
.beat .clip > * { background: color-mix(in oklab, var(--clip-beat) 22%, var(--bg-primary)); }
.clip > *::before { /* the recorded region fills in */
  content: ''; position: absolute; inset: 0; background: var(--clip-code); clip-path: inset(0 100% 0 0);
  transition: clip-path 0.5s var(--ease); z-index: 0;
}
.beat .clip > *::before { background: var(--clip-beat); }
.clip span { position: relative; z-index: 1; }
.clip.played > *::before, .clip.live > *::before, .clip a:hover::before, .clip a:focus-visible::before { clip-path: inset(0 0 0 0); }
.clip.played > *, .clip.live > *, .clip a:hover, .clip a:focus-visible { color: var(--clip-code-ink); }
.beat .clip.played > *, .beat .clip.live > * { color: var(--clip-beat-ink); }
.clip.live { animation: pulse v-bind(beat) ease-out infinite; } /* idle: the live clip breathes on the beat */
@keyframes pulse { 0% { scale: 1 1.06; } 35% { scale: 1 1; } }

/* playhead, driven by --p (0…1) */
.playhead-track {
  position: absolute; top: 0; bottom: 0; left: var(--hd); right: 0; pointer-events: none;
}
.playhead {
  position: absolute; top: -4px; bottom: 0; left: 0; width: 2px; background: var(--accent);
  translate: calc(var(--p) * (100cqw - 2px)) 0;
}
.playhead::before { content: ''; position: absolute; top: 0; left: -6px; border: 7px solid transparent; border-top: 9px solid var(--accent); }
.playhead-track { container-type: inline-size; }

/* now playing */
.now {
  display: grid; grid-template-columns: auto repeat(3, minmax(0, 1fr)); align-items: end; gap: 12px clamp(20px, 4vw, 56px);
  padding-top: 16px; border-top: 1px solid var(--line);
}
.now-pos { font-size: var(--t-s); color: var(--accent-text); }
.now-clip { display: grid; gap: 6px; min-width: 0; }
.lbl { display: flex; align-items: center; gap: 8px; font: 500 var(--t-xs)/1 var(--font-mono); color: var(--text-secondary); }
.lbl i { width: 14px; height: 8px; border-radius: 2px; background: var(--clip-code); }
.beat .lbl i { background: var(--clip-beat); }
.now-name {
  font: 800 var(--t-l)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.03em;
  text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
a.now-name:hover { color: var(--accent-text); }

@media (max-width: 760px) {
  .stage { --hd: 58px; align-content: start; padding-top: calc(var(--bar-h) + 24px); }
  .pl-head { grid-template-columns: 1fr; }
  /* too small to read or tap on a phone: the now-playing panel names and links them */
  .clip span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .clip { pointer-events: none; }
  .marker { display: none; }
  .markers .lane { height: 0; }
  .tick em { display: none; }
  .now { grid-template-columns: 1fr; }
  .now-name { white-space: normal; }
}
@media (prefers-reduced-motion: reduce) { .clip.live { animation: none; } }
</style>
