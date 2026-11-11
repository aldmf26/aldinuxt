<template>
  <section id="beats" class="beats wrap" :style="{ '--beat': `${60 / (cur.bpm || 120)}s` }">
    <header class="sec-head">
      <p class="track-tag beat"><i />BEATS · FL STUDIO</p>
      <h2 class="display">{{ $t('music.title') }}</h2>
      <p>{{ $t('music.description') }}</p>
    </header>

    <!-- the deck: one track loaded at a time; the real YouTube player shows, framed, while it plays -->
    <div class="deck" :class="{ playing }">
      <div ref="slot" class="slot">
      <div class="screen" :class="{ docked }">
        <template v-if="!loaded || (!cur.yt && !cur.sc && !cur.src)">
          <img class="cover" :src="cover(cur)" :alt="cur.judul" width="480" height="360" />
          <span class="tint" aria-hidden="true" />
        </template>
        <div v-if="loaded && cur.yt" id="yt-deck" class="yt" />
        <iframe
          v-else-if="loaded && cur.sc"
          class="yt"
          :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(cur.sc)}&color=${encodeURIComponent(accentHex)}&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=true`"
          :title="cur.judul"
          allow="autoplay"
        />
        <audio v-else-if="loaded && cur.src" :src="cur.src" controls autoplay class="local" />
      </div>
      </div>

      <div class="np">
        <p class="np-head num"><i aria-hidden="true" />NOW PLAYING<span v-if="cur.bpm"> · {{ cur.bpm }} BPM</span> · {{ pad(sel + 1) }}/{{ pad(beats.length) }}</p>
        <h3 class="np-title">{{ cur.judul }}</h3>
        <p class="np-sub">{{ [cur.type, year(cur)].filter(Boolean).join(' · ') }}</p>

        <div class="ctrl">
          <button type="button" class="ctl" :aria-label="$t('music.prev')" @click="step(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5.5v13L9.5 12z" /></svg>
          </button>
          <button type="button" class="ctl main" :aria-label="(playing ? $t('music.pause') : $t('music.play')) + ': ' + cur.judul" @click="playPause">
            <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          </button>
          <button type="button" class="ctl" :aria-label="$t('music.next')" @click="step(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5.5v13L14.5 12z" /></svg>
          </button>
          <span class="time num">{{ duration ? `${fmt(current)} / ${fmt(duration)}` : '' }}</span>
        </div>

        <!-- waveform = seek bar (the shape is decorative, not the real audio) -->
        <div
          class="wave"
          role="slider"
          tabindex="0"
          :aria-label="$t('music.seek')"
          aria-valuemin="0"
          :aria-valuemax="Math.round(duration)"
          :aria-valuenow="Math.round(current)"
          :style="{ '--prog': duration ? current / duration : 0 }"
          @click="seekAt"
          @keydown.right.prevent="nudge(5)"
          @keydown.left.prevent="nudge(-5)"
        >
          <svg v-for="layer in ['rest', 'done']" :key="layer" :class="layer" viewBox="0 0 64 20" preserveAspectRatio="none" aria-hidden="true">
            <rect v-for="(h, k) in wave(cur.judul)" :key="k" :x="k" :y="10 - h / 2" width="0.6" :height="h" />
          </svg>
        </div>
      </div>
    </div>

    <!-- browser: every track, like the file browser of a DAW; a row loads into the deck -->
    <div class="browser">
      <template v-for="g in groups" :key="g.id">
        <div class="g-head">
          <p class="g-title">{{ g.title }}</p>
          <p v-if="g.sub" class="g-sub">{{ g.sub }}</p>
        </div>
        <ol class="rows">
          <li v-for="b in g.items" :key="b.yt || b.i">
            <button type="button" class="row" :class="{ on: sel === b.i }" :aria-current="sel === b.i ? 'true' : undefined" @click="pick(b.i)">
              <span class="no num">{{ pad(b.i + 1) }}</span>
              <span class="r-title">{{ b.judul }}</span>
              <span class="r-type">{{ b.type }}</span>
              <span class="r-bpm num">{{ b.bpm ? `${b.bpm} BPM` : '' }}</span>
              <span class="r-year num">{{ year(b) }}</span>
              <span class="eq" aria-hidden="true"><i /><i /><i /></span>
            </button>
          </li>
        </ol>
      </template>
      <button v-if="hidden" type="button" class="btn see-all" @click="showAll = true"><span>{{ $t('music.showAll') }} ({{ hidden }})</span></button>
    </div>

    <Transition name="mini">
      <div v-if="docked" class="mini" role="region" :aria-label="$t('music.mini')">
        <div class="mini-info">
          <p class="mini-title">{{ cur.judul }}</p>
          <p class="mini-sub num">{{ [cur.bpm && `${cur.bpm} BPM`, duration && `${fmt(current)} / ${fmt(duration)}`].filter(Boolean).join(' · ') }}</p>
        </div>
        <div class="mini-ctrl">
          <button type="button" class="m-btn" :aria-label="$t('music.prev')" @click="step(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5.5v13L9.5 12z" /></svg></button>
          <button type="button" class="m-btn main" :aria-label="playing ? $t('music.pause') : $t('music.play')" @click="playPause">
            <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          </button>
          <button type="button" class="m-btn" :aria-label="$t('music.next')" @click="step(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5.5v13L14.5 12z" /></svg></button>
          <button type="button" class="m-btn" :aria-label="$t('music.toDeck')" @click="toDeck"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l7 7-1.4 1.4L13 8.8V20h-2V8.8l-4.6 4.6L5 12z" /></svg></button>
          <button type="button" class="m-btn" :aria-label="$t('music.close')" @click="closeMini"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4L12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z" /></svg></button>
        </div>
      </div>
    </Transition>

    <p class="more">
      <a class="link" :href="YT_CHANNEL" target="_blank" rel="noopener">YouTube @ALdMFbeat</a>
    </p>
  </section>
</template>

<script setup lang="ts">
import { beats as myBeats, southGun } from '~/data/beats'

const YT_CHANNEL = 'https://www.youtube.com/@ALdMFbeat'
const FIRST = 6 // own beats listed before 'see all'
const { accentHex } = useSide()
const { t } = useI18n()

type Raw = { judul: string; bpm?: number; type?: string; src?: string; platform?: string; ytLink?: string }
type Track = { judul: string; yt?: string; sc?: string; src?: string; bpm?: number; type?: string; date?: string; i: number }
const ytId = (u = '') => u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1]

const raw = ref<Raw[]>([])
const showAll = ref(false)

// uploads (from /upload) after South Gun, then the built-in list; duplicates by YouTube id dropped
const uploaded = computed(() => raw.value.map(b => {
  const link = b.ytLink || (b.platform !== 'local' ? b.src : '') || ''
  // older entries stored a bare YouTube id in `src` with a non-local platform
  const yt = ytId(link) || (b.platform && b.platform !== 'local' && /^[\w-]{11}/.test(b.src || '') ? b.src!.slice(0, 11) : undefined)
  const sc = /soundcloud\.com/.test(link) ? link : undefined
  return { ...b, yt, sc }
}).filter(b => b.yt || b.sc || b.src))

const beats = computed<Track[]>(() => {
  const seen = new Set<string>()
  const keep = (b: Omit<Track, 'i'>) => !b.yt || (!seen.has(b.yt) && !!seen.add(b.yt))
  return [...southGun, ...uploaded.value, ...myBeats].filter(keep).map((b, i) => ({ ...b, i }))
})
const groups = computed(() => {
  const sg = beats.value.slice(0, southGun.length)
  const mine = beats.value.slice(southGun.length)
  return [
    { id: 'sg', title: t('music.sgTitle'), sub: t('music.sgSub'), items: sg },
    { id: 'mine', title: t('music.mineTitle'), sub: '', items: showAll.value ? mine : mine.slice(0, FIRST) },
  ]
})
const hidden = computed(() => (showAll.value ? 0 : Math.max(0, beats.value.length - southGun.length - FIRST)))

const sel = ref(0)
const cur = computed(() => beats.value[sel.value] ?? beats.value[0])
const loaded = ref(false)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)

// mini player: the loaded track follows you down the page (the video stays visible, YouTube's rule)
const slot = ref<HTMLElement>()
const offscreen = ref(false)
const closed = ref(false)
const docked = computed(() => loaded.value && offscreen.value && !closed.value)
let io: IntersectionObserver | undefined
function toDeck() {
  const lenis = useNuxtApp().$lenis as any
  lenis ? lenis.scrollTo(slot.value, { offset: -120, duration: 1 }) : slot.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
function closeMini() {
  if (player && playing.value) player.pauseVideo()
  closed.value = true
}

const pad = (n: number) => String(n).padStart(2, '0')
const year = (b: { date?: string }) => b.date?.slice(0, 4) ?? ''
const cover = (b: Track) => (b.yt ? `https://i.ytimg.com/vi/${b.yt}/hqdefault.jpg` : '/og.png')
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// stable pseudo-waveform per title (64 bars, 2..18 tall)
function wave(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return Array.from({ length: 64 }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    const env = Math.sin((i / 63) * Math.PI) * 0.6 + 0.4
    return 2 + ((h >>> 0) % 1000) / 1000 * 16 * env
  })
}

/* ---------- YouTube IFrame API: one player, our controls ---------- */
let player: any = null
let apiReady: Promise<any> | null = null
let tick: (() => void) | null = null

function loadApi() {
  apiReady ??= new Promise(resolve => {
    const w = window as any
    if (w.YT?.Player) return resolve(w.YT)
    w.onYouTubeIframeAPIReady = () => resolve(w.YT)
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiReady
}

async function stopClock() {
  if (!tick) return
  const { gsap } = await import('gsap')
  gsap.ticker.remove(tick)
  tick = null
}

async function startClock() {
  if (tick) return
  const { gsap } = await import('gsap')
  tick = () => { if (player?.getCurrentTime) current.value = player.getCurrentTime() }
  gsap.ticker.add(tick)
}

function destroy() {
  stopClock()
  try { player?.destroy() } catch {}
  player = null
  loaded.value = false
  playing.value = false
  current.value = 0
  duration.value = 0
}

// load a track into the deck and start it
async function load(i: number) {
  destroy()
  sel.value = i
  loaded.value = true
  closed.value = false
  const b = cur.value
  if (!b.yt) { playing.value = true; return } // SoundCloud / local audio use their own players
  const YT = await loadApi()
  await nextTick()
  if (sel.value !== i) return // another track was picked while the API loaded
  player = new YT.Player('yt-deck', {
    host: 'https://www.youtube-nocookie.com',
    videoId: b.yt,
    playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, disablekb: 1, iv_load_policy: 3 },
    events: {
      onReady: (e: any) => { duration.value = e.target.getDuration(); e.target.playVideo() },
      onStateChange: (e: any) => {
        playing.value = e.data === YT.PlayerState.PLAYING
        if (playing.value) { duration.value = player.getDuration(); startClock() } else stopClock()
        if (e.data === YT.PlayerState.ENDED) step(1) // keep the set going
      },
    },
  })
}

function playPause() {
  if (!loaded.value) return load(sel.value)
  if (player) playing.value ? player.pauseVideo() : player.playVideo()
}
function pick(i: number) {
  if (i === sel.value && loaded.value) return playPause()
  load(i)
}
function step(d: number) {
  const n = beats.value.length
  const next = (sel.value + d + n) % n
  if (next >= southGun.length + FIRST) showAll.value = true // keep the playing row visible
  load(next)
}

function seekAt(e: MouseEvent) {
  if (!player || !duration.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const to = ((e.clientX - r.left) / r.width) * duration.value
  player.seekTo(to, true)
  current.value = to
}
function nudge(d: number) {
  if (!player || !duration.value) return
  const to = Math.min(duration.value, Math.max(0, current.value + d))
  player.seekTo(to, true)
  current.value = to
}

onMounted(async () => {
  if (slot.value) {
    io = new IntersectionObserver(([e]) => { offscreen.value = !e.isIntersecting }, { threshold: 0.25 })
    io.observe(slot.value)
  }
  try {
    const res = await fetch('/api/beats')
    if (res.ok) raw.value = await res.json()
  } catch {}
})
onBeforeUnmount(() => { io?.disconnect(); destroy() })
</script>

<style scoped>
.beats { padding-block: clamp(64px, 10vh, 120px); }

/* ---------- deck ---------- */
.deck {
  position: relative; isolation: isolate;
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(20px, 3vw, 40px); align-items: center;
  padding: clamp(14px, 2vw, 24px); border-radius: var(--clip-r);
  background: color-mix(in oklab, var(--clip-beat) 9%, var(--bg-primary)); border: 1px solid var(--line);
}
.deck::before { /* glow that pulses on the beat of the loaded track */
  content: ''; position: absolute; inset: -1px; z-index: -1; border-radius: inherit;
  box-shadow: 0 0 0 1px var(--clip-beat), 0 0 50px -10px var(--clip-beat); opacity: 0;
}
.deck.playing::before { animation: thump var(--beat) ease-out infinite; }
@keyframes thump { 0% { opacity: 0.9; } 70%, 100% { opacity: 0.15; } }

.slot { aspect-ratio: 16 / 9; } /* holds the deck's shape while the screen is docked */
.screen { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 4px; background: #000; }
/* docked: the same element, now fixed above the mini controls; YouTube needs the player >= 200 px tall */
.screen.docked {
  position: fixed; z-index: 91; right: 20px; bottom: calc(20px + var(--mini-h)); width: var(--mini-w); height: auto; aspect-ratio: 16 / 9;
  border-radius: var(--clip-r) var(--clip-r) 0 0; box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.7);
  animation: dock-in 0.5s var(--ease);
}
@keyframes dock-in { from { translate: 0 40px; opacity: 0; } }
/* .deck isolates its glow; lift it while docked so the floating video sits above later sections */
.deck:has(.screen.docked) { z-index: 91; }
.cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); animation: breathe calc(var(--beat) * 4) ease-in-out infinite; }
@keyframes breathe { 50% { scale: 1.03; } } /* idle: the cover breathes on the bar */
.tint { position: absolute; inset: 0; background: var(--clip-beat); mix-blend-mode: multiply; opacity: 0.7; }
.screen :deep(iframe), .yt { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.local { position: absolute; left: 12px; right: 12px; bottom: 12px; width: calc(100% - 24px); }

.np { display: grid; gap: 12px; min-width: 0; }
.np-head { display: flex; align-items: center; gap: 8px; font-size: var(--t-xs); color: var(--accent-text); }
.np-head i { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.playing .np-head i { animation: thump var(--beat) ease-out infinite; }
.np-title {
  font: 800 var(--t-xl)/0.92 var(--font-display); font-variation-settings: 'wdth' 118; letter-spacing: -0.04em;
  overflow-wrap: anywhere;
}
.np-sub { color: var(--text-secondary); }
.ctrl { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.ctl {
  width: 44px; height: 44px; border-radius: var(--clip-r); border: 1px solid var(--line); cursor: pointer; display: grid; place-items: center;
  background: transparent; color: var(--text-primary); transition: scale 0.3s var(--ease), background-color 0.2s, color 0.2s;
}
.ctl svg { width: 18px; height: 18px; fill: currentColor; }
.ctl:hover, .ctl:focus-visible { scale: 1.08; background: var(--text-primary); color: var(--bg-primary); }
.ctl:active { scale: 0.95; }
.ctl.main { width: 56px; height: 56px; background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.ctl.main svg { width: 22px; height: 22px; }
.time { margin-left: auto; font-size: var(--t-xs); color: var(--text-secondary); }

.wave { position: relative; height: 48px; cursor: pointer; }
.wave svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.wave svg.rest { fill: color-mix(in oklab, var(--text-primary) 28%, transparent); }
.wave svg.done { fill: var(--clip-beat); clip-path: inset(0 calc((1 - var(--prog)) * 100%) 0 0); }

/* ---------- browser ---------- */
.browser { margin-top: clamp(28px, 4vh, 44px); }
.g-head { display: grid; gap: 2px; margin: 28px 0 8px; }
.g-head:first-child { margin-top: 0; }
.g-title { font: 500 var(--t-xs)/1.4 var(--font-mono); color: var(--accent-text); text-transform: uppercase; }
.g-sub { color: var(--text-secondary); font-size: var(--t-s); }
.rows { list-style: none; border-top: 1px solid var(--line); }
.row {
  position: relative; isolation: isolate; width: 100%;
  display: grid; grid-template-columns: 3rem minmax(0, 1.4fr) minmax(0, 1fr) 6rem 3.5rem 1.6rem; align-items: center; gap: 12px;
  padding: 14px 8px; border: 0; border-bottom: 1px solid var(--line); background: none; color: inherit; font: inherit; text-align: left; cursor: pointer;
}
.row::before { /* the row records in from the left, like a clip */
  content: ''; position: absolute; inset: 0; z-index: -1; background: var(--clip-beat);
  clip-path: inset(0 100% 0 0); transition: clip-path 0.45s var(--ease);
}
.row:hover::before, .row:focus-visible::before, .row.on::before { clip-path: inset(0 0 0 0); }
.row:hover, .row:focus-visible, .row.on { color: var(--clip-beat-ink); }
.row:hover .r-type, .row:hover .r-bpm, .row:hover .r-year, .row:hover .no,
.row.on .r-type, .row.on .r-bpm, .row.on .r-year, .row.on .no { color: var(--clip-beat-ink); }
.no, .r-bpm, .r-year { font-size: var(--t-xs); color: var(--text-secondary); }
.r-title { font: 800 var(--t-m)/1.1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.02em; transition: translate 0.45s var(--ease); }
.row:hover .r-title, .row.on .r-title { translate: 6px 0; }
.r-type { font-size: var(--t-s); color: var(--text-secondary); }
.eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; opacity: 0; }
.eq i { width: 3px; height: 100%; background: currentColor; transform-origin: bottom; scale: 1 0.3; }
.deck.playing ~ .browser .row.on .eq { opacity: 1; }
.deck.playing ~ .browser .row.on .eq i { animation: eq calc(var(--beat) / 2) ease-in-out infinite alternate; }
.eq i:nth-child(2) { animation-delay: 0.15s !important; }
.eq i:nth-child(3) { animation-delay: 0.3s !important; }
@keyframes eq { to { scale: 1 1; } }
.see-all { margin-top: 20px; }

/* mini player bar (pairs with .screen.docked) */
.beats { --mini-w: 380px; --mini-h: 64px; }
.mini {
  position: fixed; z-index: 91; right: 20px; bottom: 20px; width: var(--mini-w); height: var(--mini-h);
  display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 0 8px 0 14px;
  background: var(--bg-primary); border: 1px solid var(--line); border-radius: 0 0 var(--clip-r) var(--clip-r);
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.7);
}
.mini::before { /* the bar's top edge pulses on the beat, like the deck */
  content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 2px; background: var(--clip-beat);
  animation: thump var(--beat) ease-out infinite;
}
.mini-info { min-width: 0; }
.mini-title { font: 800 1rem/1.1 var(--font-display); font-variation-settings: 'wdth' 112; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-sub { font-size: var(--t-xs); color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-ctrl { display: flex; gap: 2px; flex: none; }
.m-btn {
  width: 36px; height: 36px; border: 0; border-radius: 4px; display: grid; place-items: center; cursor: pointer;
  background: transparent; color: var(--text-primary); transition: background-color 0.2s, color 0.2s, scale 0.25s var(--ease);
}
.m-btn svg { width: 16px; height: 16px; fill: currentColor; }
.m-btn:hover, .m-btn:focus-visible { background: var(--text-primary); color: var(--bg-primary); }
.m-btn:active { scale: 0.92; }
.m-btn.main { background: var(--accent); color: var(--accent-ink); }
.mini-enter-active, .mini-leave-active { transition: translate 0.5s var(--ease), opacity 0.3s; }
.mini-enter-from, .mini-leave-to { translate: 0 40px; opacity: 0; }
.more { margin-top: 28px; }
.more a { display: inline-block; padding: 8px 0; }

@media (max-width: 760px) {
  .beats { --mini-w: calc(100vw - 16px); --mini-h: 60px; }
  .screen.docked, .mini { right: 8px; }
  .screen.docked { bottom: calc(8px + var(--mini-h)); }
  .mini { bottom: 8px; }
  .m-btn { width: 40px; height: 40px; }
  .deck { grid-template-columns: 1fr; }
  .row { grid-template-columns: 2.2rem minmax(0, 1fr) auto; gap: 4px 10px; }
  .r-type, .r-year, .eq { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .cover, .deck.playing::before, .playing .np-head i, .eq i, .mini::before, .screen.docked { animation: none !important; }
}
</style>
