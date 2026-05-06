<template>
  <section id="music" class="relative py-24 md:py-40 px-6 md:px-16 overflow-hidden transition-colors duration-500" style="background: var(--bg-primary)">
    <!-- Background "BEATS" text -->
    <div
      ref="bgBeats"
      class="absolute top-16 left-1/2 -translate-x-1/2 font-display italic text-text-primary opacity-[0.02] select-none pointer-events-none z-0 whitespace-nowrap"
      style="font-size: clamp(100px, 12vw, 200px)"
    >
      BEATS
    </div>

    <div class="max-w-[1600px] mx-auto relative z-10">
      <!-- Section header -->
      <div class="mb-16">
        <span class="font-mono text-xs text-lime tracking-[0.3em] uppercase block mb-4">Sound Lab</span>
        <h2 class="font-display italic text-text-primary leading-none mb-6" style="font-size: clamp(48px, 7vw, 120px)">
          Beats &<br/>Productions
        </h2>
        <p class="text-text-muted font-body text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Trap, EDM, and free FLP packs — all produced in FL Studio. 
          Available for licensing, content use, or just listening.
        </p>
        
        <!-- Animated waveform SVG divider -->
        <div class="w-full max-w-md h-12">
          <svg class="w-full h-full" viewBox="0 0 400 40" fill="none">
            <path
              v-for="i in 3"
              :key="i"
              :d="generateWavePath(i)"
              style="stroke: var(--accent)"
              :stroke-width="1.5"
              fill="none"
              :opacity="0.4 / i"
              class="waveform-path"
              :style="{ animationDelay: i * 0.4 + 's' }"
            />
          </svg>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-3 mb-12">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            activeTab === tab 
              ? 'bg-lime text-dark font-black' 
              : 'bg-[var(--bg-surface)] text-text-muted hover:text-text-primary border border-white/5'
          ]"
          class="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Piano Roll Visualizer -->
      <div ref="pianoRollRef" class="mb-20 scroll-mt-32">
        <div class="flex justify-between items-center mb-2 px-2">
          <span class="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-text-muted uppercase">
            {{ activeItem ? `▶ ${activeItem.judul || 'Track'} — ${activeItem.bpm || 120} BPM` : '● PIANO ROLL — SELECT A BEAT' }}
          </span>
          <span class="font-mono text-[10px] text-lime opacity-60">
            FL STUDIO MODE
          </span>
        </div>
        <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <canvas ref="pianoRoll" class="w-full block" height="160"></canvas>
        </div>
      </div>

      <!-- Items Grid (REBUILT) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in displayedItems"
          :key="item.src"
          class="beat-card group relative rounded-[1.5rem] overflow-hidden border border-white/10 transition-all duration-500 flex flex-col"
          :class="{ 'border-lime': activeItem?.src === item.src }"
          :style="{ 
            background: 'var(--bg-surface)',
            boxShadow: activeItem?.src === item.src ? `0 0 30px ${glowColor}` : 'none'
          }"
        >
          <!-- TOP: BPM Visualization -->
          <div class="beat-bars" :class="{ active: activeItem?.src === item.src }">
            <div 
              v-for="i in 24" :key="i"
              class="beat-bar"
              :style="{ animationDelay: `${i * 0.04}s`, animationDuration: `${0.4 + (i % 5) * 0.08}s` }"
            />
          </div>

          <!-- BOTTOM: Info & Controls -->
          <div class="p-6">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-text-primary text-base font-bold truncate pr-4">
                {{ item.judul }}
              </h4>
              <button 
                @click="toggleActive(item)"
                class="play-toggle-btn"
                :class="{ 'is-active': activeItem?.src === item.src }"
              >
                {{ activeItem?.src === item.src ? '■' : '▶' }}
              </button>
            </div>

            <p class="font-mono text-[11px] text-text-muted uppercase tracking-widest">
              {{ item.type }} · {{ item.bpm }} BPM
            </p>

            <!-- External Link -->
            <a 
              :href="`https://www.youtube.com/watch?v=${item.src.split('?')[0]}`"
              target="_blank"
              class="yt-link"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="filteredItems.length > displayLimit && !showAllItems" class="mt-12 text-center">
        <button
          @click="showAllItems = true"
          class="px-10 py-5 bg-[var(--bg-surface)] border border-white/10 text-text-primary font-mono text-xs uppercase tracking-widest rounded-full hover:bg-white/5 transition-all duration-300"
        >
          Show All Tracks ({{ filteredItems.length }})
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const pianoRoll = ref(null)
const pianoRollRef = ref(null)
const activeItem = ref(null)
const activeTab = ref('ALL')
const bgBeats = ref(null)
const showAllItems = ref(false)
const displayLimit = ref(6)
let animFrame = null
let notes = []

const displayedItems = computed(() => {
  if (showAllItems.value) return filteredItems.value
  return filteredItems.value.slice(0, displayLimit.value)
})

const tabs = ['ALL', 'Trap Beat', 'Free FLP', 'EDM', 'SoundCloud']
const NOTE_ROWS = 16
const BASE_SPEED = 1.2

const musicData = [
  { judul: 'Hanoman',           src: 'WivTmpt7w5c', type: 'Trap Beat', bpm: 95,  platform: 'youtube' },
  { judul: 'Snakey',            src: '51X_4JpYxJ4', type: 'Free FLP',  bpm: 108, platform: 'youtube' },
  { judul: 'Flamingo',          src: 'UaNnC24Pnrg', type: 'Free FLP',  bpm: 100, platform: 'youtube' },
  { judul: 'GTA',               src: 'QDRnVt_5vRc', type: 'Free FLP',  bpm: 194, platform: 'youtube' },
  { judul: 'Ginto',             src: 'e4k6F9XnN_4', type: 'Free FLP',  bpm: 110, platform: 'youtube' },
  { judul: 'Boom',              src: 'IC29VAokmN8', type: 'Free FLP',  bpm: 90,  platform: 'youtube' },
  { judul: 'Chronela',          src: 'kRE6lMO8fvE', type: 'Free FLP',  bpm: 198, platform: 'youtube' },
  { judul: 'Bap Bap',           src: '8wFIg7C2slU', type: 'Free FLP',  bpm: 101, platform: 'youtube' },
  { judul: 'Dendang',           src: 'IuPr2iU23h0', type: 'Free FLP',  bpm: 90,  platform: 'youtube' },
  { judul: 'Kurma',             src: 'kuWnALFzasE', type: 'Free FLP',  bpm: 160, platform: 'youtube' },
  { judul: 'Beatbox v2',        src: 'VAf120fBT9o', type: 'Free FLP',  bpm: 190, platform: 'youtube' },
  { judul: 'Barkan',            src: 'tqWjv8MMQ5U', type: 'Free FLP',  bpm: 170, platform: 'youtube' },
  { judul: 'Habits',            src: 'mtSq-fF_ZDI', type: 'Free FLP',  bpm: 170, platform: 'youtube' },
  { judul: 'SMASH',             src: 'ACMkBeKlqJ8', type: 'EDM',       bpm: 150, platform: 'youtube' },
  { judul: 'ZAT Selatan',       src: 'Qb5_jPIvbnk', type: 'EDM',       bpm: 150, platform: 'youtube' },
]

const filteredItems = computed(() => {
  if (activeTab.value === 'ALL') return musicData
  return musicData.filter(i => i.type === activeTab.value || (activeTab.value === 'SoundCloud' && i.platform === 'soundcloud'))
})

function toggleActive(item) {
  if (activeItem.value?.src === item.src) {
    activeItem.value = null
  } else {
    activeItem.value = item
    nextTick(() => {
      pianoRollRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}

function generateWavePath(seed) {
  let d = 'M 0 20'
  for (let i = 0; i <= 400; i += 5) {
    const y = 20 + Math.sin(i * 0.05 + seed) * 10 + Math.sin(i * 0.02) * 5
    d += ` L ${i} ${y}`
  }
  return d
}

const accentColor = ref('#C8F580')
const glowColor = ref('rgba(200, 245, 128, 0.2)')

function parseColor(val, opacity = 1) {
  if (!val) return 'rgba(0,0,0,0)'
  if (val.startsWith('#')) {
    if (opacity === 1) return val
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0')
    return val + alpha
  }
  return val
}

function updateColors() {
  if (typeof document !== 'undefined') {
    const style = getComputedStyle(document.documentElement)
    const rawAccent = style.getPropertyValue('--accent').trim() || '#C8F580'
    accentColor.value = parseColor(rawAccent)
    glowColor.value = parseColor(rawAccent, 0.2)
  }
}

function generateNotes(bpm) {
  const canvas = pianoRoll.value
  if (!canvas) return []
  const W = canvas.width
  const noteList = []
  for (let i = 0; i < 40; i++) {
    noteList.push({
      x: Math.random() * W * 1.5 + W,
      row: Math.floor(Math.random() * NOTE_ROWS),
      width: Math.random() * 100 + 30,
      speed: (bpm / 120) * BASE_SPEED * (0.8 + Math.random() * 0.4),
      opacity: 0.6 + Math.random() * 0.4,
    })
  }
  return noteList
}

function drawPianoRoll() {
  const canvas = pianoRoll.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth || 800
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const KEYBOARD_W = 28
  const rowH = H / NOTE_ROWS

  const style = getComputedStyle(document.documentElement)
  const accent = accentColor.value
  const bgSurface = style.getPropertyValue('--bg-surface').trim() || '#1A1A1A'
  
  ctx.fillStyle = bgSurface
  ctx.fillRect(0, 0, W, H)

  const blackKeyRows = [1, 3, 6, 8, 10, 13, 15]
  for (let r = 0; r < NOTE_ROWS; r++) {
    const y = r * rowH
    const isBlack = blackKeyRows.includes(r % NOTE_ROWS)
    ctx.fillStyle = isBlack ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.02)'
    ctx.fillRect(KEYBOARD_W, y, W - KEYBOARD_W, rowH)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(KEYBOARD_W, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  const bpm = activeItem.value?.bpm || 120
  const beatPx = (60 / bpm) * 60 * ((bpm / 120) * BASE_SPEED) * 16
  for (let x = KEYBOARD_W; x < W; x += beatPx) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }

  for (const note of notes) {
    ctx.shadowColor = accent
    ctx.shadowBlur = activeItem.value ? 6 : 2
    ctx.fillStyle = parseColor(accent, note.opacity)
    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(note.x, note.row * rowH + rowH * 0.1, note.width, rowH * 0.75, 3)
    else ctx.rect(note.x, note.row * rowH + rowH * 0.1, note.width, rowH * 0.75)
    ctx.fill()
    ctx.shadowBlur = 0
    note.x -= note.speed
    if (note.x + note.width < KEYBOARD_W) {
      note.x = W + Math.random() * 200
      note.row = Math.floor(Math.random() * NOTE_ROWS)
      note.width = Math.random() * 100 + 30
      note.opacity = 0.6 + Math.random() * 0.4
    }
  }

  for (let r = 0; r < NOTE_ROWS; r++) {
    const y = r * rowH
    const isBlack = blackKeyRows.includes(r % NOTE_ROWS)
    ctx.fillStyle = isBlack ? '#111' : '#2a2a2a'
    ctx.fillRect(0, y + 0.5, KEYBOARD_W - 2, rowH - 1)
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, y + rowH)
    ctx.lineTo(KEYBOARD_W, y + rowH)
    ctx.stroke()
  }

  ctx.strokeStyle = parseColor(accent, 0.2)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(KEYBOARD_W, 0)
  ctx.lineTo(KEYBOARD_W, H)
  ctx.stroke()
  animFrame = requestAnimationFrame(drawPianoRoll)
}

watch(activeItem, (val) => {
  const bpm = val?.bpm || 120
  notes = generateNotes(bpm)
})

onMounted(() => {
  updateColors()
  notes = generateNotes(120)
  drawPianoRoll()

  const observer = new MutationObserver(updateColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  if (bgBeats.value) {
    gsap.to(bgBeats.value, {
      yPercent: -20,
      scrollTrigger: { trigger: '#music', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    })
  }

  window.addEventListener('resize', () => {
    if (pianoRoll.value) pianoRoll.value.width = pianoRoll.value.offsetWidth
  })
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.waveform-path {
  animation: waveMove 4s ease-in-out infinite alternate;
}
@keyframes waveMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-15px); }
}

/* Beat Cards Stylized (REBUILT) */
.beat-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 60px;
  padding: 12px 16px 8px;
  background: var(--bg-surface);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.beat-bar {
  flex: 1;
  background: var(--accent);
  opacity: 0.3;
  border-radius: 2px 2px 0 0;
  height: 20%;
  transition: height 0.1s ease;
}
.beat-bars.active .beat-bar {
  opacity: 1;
  animation: barPulse var(--dur, 0.5s) ease-in-out infinite alternate;
}
@keyframes barPulse {
  from { height: 15%; }
  to { height: 85%; }
}
.beat-bars.active .beat-bar:nth-child(3n)   { --dur: 0.3s; }
.beat-bars.active .beat-bar:nth-child(3n+1) { --dur: 0.5s; }
.beat-bars.active .beat-bar:nth-child(3n+2) { --dur: 0.4s; }

.play-toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-size: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.play-toggle-btn:hover {
  transform: scale(1.1);
}
.play-toggle-btn.is-active {
  animation: buttonPulse 0.5s ease-in-out infinite alternate;
}
@keyframes buttonPulse {
  from { box-shadow: 0 0 0px var(--accent); }
  to   { box-shadow: 0 0 12px var(--accent); }
}

.yt-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.yt-link:hover {
  opacity: 1;
}
</style>
