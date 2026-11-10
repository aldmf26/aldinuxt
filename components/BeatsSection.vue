<template>
  <section id="beats" class="beats wrap">
    <header class="sec-head">
      <p class="track-tag beat"><i />BEATS · FL STUDIO</p>
      <h2 class="display">{{ $t('music.title') }}</h2>
      <p>{{ $t('music.description') }}</p>
    </header>

    <p v-if="loading" class="note">{{ $t('music.loading') }}</p>

    <div v-else-if="!beats.length" class="empty">
      <p>{{ $t('music.empty') }}</p>
      <a class="btn btn-primary" :href="YT_CHANNEL" target="_blank" rel="noopener"><span>{{ $t('music.youtube') }}</span></a>
    </div>

    <!-- clip deck: our own cards and controls; the real YouTube player appears, framed, only once you press play -->
    <ol v-else class="deck">
      <li v-for="(b, i) in beats" :key="i" class="card" :class="{ on: active === i, playing: active === i && playing }">
        <div class="screen">
          <template v-if="active !== i || !b.yt">
            <img v-if="b.yt" class="cover" :src="`https://i.ytimg.com/vi/${b.yt}/hqdefault.jpg`" alt="" loading="lazy" width="480" height="360" />
            <span v-else class="cover blank" />
            <span class="tint" aria-hidden="true" />
          </template>
          <div v-if="active === i && b.yt" :id="`yt-${i}`" class="yt" />
          <iframe
            v-if="active === i && !b.yt && b.sc"
            class="sc"
            :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(b.sc)}&color=${encodeURIComponent(accentHex)}&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=false`"
            :title="b.judul"
            allow="autoplay"
          />
          <audio v-if="active === i && !b.yt && !b.sc && b.src" :src="b.src" controls autoplay class="local" />
        </div>

        <div class="body">
          <button type="button" class="play" :aria-label="(active === i && playing ? $t('music.pause') : $t('music.play')) + ': ' + b.judul" @click="toggle(i)">
            <svg v-if="active === i && playing" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>
          </button>
          <div class="meta">
            <h3 class="title">{{ b.judul }}</h3>
            <p class="sub">{{ [b.type, b.bpm && `${b.bpm} BPM`].filter(Boolean).join(' · ') || 'Beat' }}</p>
          </div>
          <span class="time num" aria-hidden="true">{{ active === i && duration ? `${fmt(current)} / ${fmt(duration)}` : '' }}</span>
        </div>

        <!-- waveform doubles as the seek bar while this beat is loaded (shape is decorative, not the real audio) -->
        <div
          class="wave"
          :role="active === i && b.yt ? 'slider' : undefined"
          :tabindex="active === i && b.yt ? 0 : undefined"
          :aria-label="active === i && b.yt ? $t('music.seek') : undefined"
          :aria-valuemin="active === i && b.yt ? 0 : undefined"
          :aria-valuemax="active === i && b.yt ? Math.round(duration) : undefined"
          :aria-valuenow="active === i && b.yt ? Math.round(current) : undefined"
          :style="{ '--prog': active === i && duration ? current / duration : 0 }"
          @click="active === i && seekAt($event)"
          @keydown.right.prevent="active === i && nudge(5)"
          @keydown.left.prevent="active === i && nudge(-5)"
        >
          <svg v-for="layer in ['rest', 'done']" :key="layer" :class="layer" viewBox="0 0 64 20" preserveAspectRatio="none" aria-hidden="true">
            <rect v-for="(h, k) in wave(b.judul)" :key="k" :x="k" :y="10 - h / 2" width="0.6" :height="h" />
          </svg>
        </div>
      </li>
    </ol>

    <p class="more">
      <a class="link" :href="YT_CHANNEL" target="_blank" rel="noopener">YouTube @ALdMFbeat</a>
    </p>
  </section>
</template>

<script setup lang="ts">
const YT_CHANNEL = 'https://www.youtube.com/@ALdMFbeat'
const { accentHex } = useSide()

type Raw = { judul: string; bpm?: number; type?: string; src?: string; platform?: string; ytLink?: string }
const ytId = (u = '') => u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1]

const raw = ref<Raw[]>([])
const loading = ref(true)
const active = ref<number | null>(null)
const playing = ref(false)
const current = ref(0)
const duration = ref(0)

const beats = computed(() => raw.value.map(b => {
  const link = b.ytLink || (b.platform !== 'local' ? b.src : '') || ''
  // older entries stored a bare YouTube id in `src` with a non-local platform
  const yt = ytId(link) || (b.platform && b.platform !== 'local' && /^[\w-]{11}/.test(b.src || '') ? b.src!.slice(0, 11) : undefined)
  const sc = /soundcloud\.com/.test(link) ? link : undefined
  return { ...b, yt, sc }
}).filter(b => b.yt || b.sc || b.src))

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

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/* ---------- YouTube IFrame API: one player at a time, our controls ---------- */
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
  playing.value = false
  current.value = 0
  duration.value = 0
}

async function toggle(i: number) {
  const b = beats.value[i]
  if (active.value === i && player) {
    playing.value ? player.pauseVideo() : player.playVideo()
    return
  }
  destroy()
  active.value = i
  if (!b.yt) { playing.value = true; return } // SoundCloud / local audio use their own players
  const YT = await loadApi()
  await nextTick()
  player = new YT.Player(`yt-${i}`, {
    host: 'https://www.youtube-nocookie.com',
    videoId: b.yt,
    playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, disablekb: 1, iv_load_policy: 3 },
    events: {
      onReady: (e: any) => { duration.value = e.target.getDuration(); e.target.playVideo() },
      onStateChange: (e: any) => {
        playing.value = e.data === YT.PlayerState.PLAYING
        if (playing.value) { duration.value = player.getDuration(); startClock() } else stopClock()
        if (e.data === YT.PlayerState.ENDED) current.value = duration.value
      },
    },
  })
}

function seekAt(e: MouseEvent) {
  if (!player || !duration.value) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const t = ((e.clientX - r.left) / r.width) * duration.value
  player.seekTo(t, true)
  current.value = t
}
function nudge(d: number) {
  if (!player || !duration.value) return
  const t = Math.min(duration.value, Math.max(0, current.value + d))
  player.seekTo(t, true)
  current.value = t
}

onMounted(async () => {
  try {
    const res = await fetch('/api/beats')
    if (res.ok) raw.value = await res.json()
  } catch {}
  loading.value = false
})
onBeforeUnmount(destroy)
</script>

<style scoped>
.beats { padding-block: clamp(64px, 10vh, 120px); }
.note { color: var(--text-secondary); }
.empty { display: grid; justify-items: start; gap: 20px; color: var(--text-secondary); font-size: var(--t-m); }

.deck { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(12px, 1.6vw, 20px); }
.card {
  display: grid; border-radius: var(--clip-r); overflow: hidden;
  background: color-mix(in oklab, var(--clip-beat) 8%, var(--bg-primary));
  border: 1px solid var(--line);
  transition: border-color 0.3s, translate 0.45s var(--ease);
}
.card:hover { translate: 0 -4px; border-color: var(--clip-beat); }
.card.on { border-color: var(--clip-beat); }

/* the screen: a duotone cover until play; then the real player, framed, at the same size */
.screen { position: relative; aspect-ratio: 16 / 9; background: var(--bg-primary); overflow: hidden; }
.cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); transition: scale 0.6s var(--ease); }
.cover.blank { background: repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px 12.5%); }
.tint { position: absolute; inset: 0; background: var(--clip-beat); mix-blend-mode: multiply; opacity: 0.85; transition: opacity 0.45s var(--ease); }
.card:hover .cover { scale: 1.04; }
.card:hover .tint { opacity: 0.55; }
.yt, .screen :deep(iframe.yt) { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.sc { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.local { position: absolute; left: 12px; right: 12px; bottom: 12px; width: calc(100% - 24px); }

.body { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; padding: 14px 14px 6px; }
.play {
  width: 48px; height: 48px; border-radius: var(--clip-r); border: 0; cursor: pointer; display: grid; place-items: center;
  background: var(--text-primary); color: var(--bg-primary);
  transition: scale 0.3s var(--ease), background-color 0.2s, color 0.2s;
}
.play:hover, .play:focus-visible { scale: 1.08; }
.play:active { scale: 0.96; }
.play svg { width: 20px; height: 20px; fill: currentColor; }
.on .play { background: var(--accent); color: var(--accent-ink); }
.meta { min-width: 0; }
.title { font-weight: 700; font-size: 1.05rem; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sub { color: var(--text-secondary); font-size: var(--t-s); }
.time { font-size: var(--t-xs); color: var(--text-secondary); }

/* waveform: played part fills with the clip colour */
.wave { position: relative; height: 40px; margin: 0 14px 14px; cursor: default; }
.on .wave { cursor: pointer; }
.wave svg { width: 100%; height: 100%; fill: color-mix(in oklab, var(--text-primary) 30%, transparent); }
.wave svg.done { position: absolute; inset: 0; fill: var(--clip-beat); clip-path: inset(0 calc((1 - var(--prog)) * 100%) 0 0); }
.wave:focus-visible { outline-offset: 2px; }
.more { margin-top: 28px; }
.more a { display: inline-block; padding: 8px 0; }
</style>
