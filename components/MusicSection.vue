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
      <div class="mb-20">
        <div class="flex justify-between items-center mb-2 px-2">
          <span class="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-text-muted uppercase">
            {{ activeItem ? `▶ ${activeItem.judul || 'SoundCloud Track'} — ${activeItem.bpm || 120} BPM` : '● PIANO ROLL — SELECT A BEAT' }}
          </span>
          <span class="font-mono text-[10px] text-lime opacity-60">
            FL STUDIO MODE
          </span>
        </div>
        <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <canvas ref="pianoRoll" class="w-full block" height="160"></canvas>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in displayedItems"
          :key="item.src"
          class="group relative rounded-[1.5rem] overflow-hidden border transition-all duration-500 cursor-pointer flex flex-col"
          :class="[
            activeItem?.src === item.src 
              ? 'border-lime' 
              : 'border-white/10'
          ]"
          :style="{ 
            background: 'var(--bg-surface)',
            boxShadow: activeItem?.src === item.src ? `0 0 30px ${glowColor}` : 'none'
          }"
          @click="selectItem(item)"
        >
          <!-- Active Dot -->
          <div v-if="activeItem?.src === item.src" class="absolute top-4 left-4 z-20">
             <div class="w-3 h-3 rounded-full bg-lime animate-pulse shadow-[0_0_10px_var(--accent)]"></div>
          </div>

          <!-- Embed Area -->
          <div class="aspect-video relative overflow-hidden bg-black">
            <!-- YouTube Embed -->
            <iframe
              v-if="item.platform === 'youtube'"
              class="w-full h-full"
              :src="`https://www.youtube.com/embed/${item.src}`"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            
            <!-- SoundCloud Embed -->
            <iframe
              v-else
              class="w-full h-full"
              scrolling="no"
              frameborder="no"
              allow="autoplay"
              :src="`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.src}&color=%23${accentHex}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
            ></iframe>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col justify-between flex-1">
            <div class="flex justify-between items-start mb-4">
              <h4 class="font-body font-bold text-lg text-text-primary group-hover:text-lime transition-colors pr-4">
                {{ item.judul || item.type + ' Track' }}
              </h4>
              <div v-if="item.bpm" class="px-2.5 py-1 rounded-md font-mono text-[10px] bg-lime/10 text-lime border border-lime/20 shrink-0">
                {{ item.bpm }} BPM
              </div>
              <div v-else class="px-2.5 py-1 rounded-md font-mono text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0 uppercase tracking-tighter">
                {{ item.platform }}
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] text-text-muted uppercase tracking-widest">{{ item.type }}</span>
              <span class="w-1 h-1 rounded-full bg-text-muted opacity-30"></span>
              <span class="font-mono text-[10px] text-text-muted uppercase tracking-widest">ALdMF</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button (Mobile Optimized) -->
      <div v-if="filteredItems.length > displayLimit && !showAllItems" class="mt-12 text-center">
        <button
          @click="showAllItems = true"
          class="px-10 py-5 bg-[var(--bg-surface)] border border-white/10 text-text-primary font-mono text-xs uppercase tracking-widest rounded-full hover:bg-white/5 transition-all duration-300"
        >
          Show All Tracks ({{ filteredItems.length }})
        </button>
      </div>

      <!-- CTA -->
      <div class="mt-24 text-center">
        <a
          href="https://www.youtube.com/@ALdMFbeat"
          target="_blank"
          class="group inline-flex items-center gap-4 px-12 py-6 bg-lime text-dark font-body font-black text-sm tracking-[0.2em] rounded-full hover:bg-lime/90 hover:scale-105 transition-all duration-300"
        >
          HEAR MY BEATS ON YOUTUBE →
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const pianoRoll = ref(null)
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
  // YouTube Data
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
  
  // SoundCloud Data
  { src: "1184667226", type: "Trap",      platform: 'soundcloud' },
  { src: "476601726",  type: "Trap",      platform: 'soundcloud' },
  { src: "882811474",  type: "Trap",      platform: 'soundcloud' },
  { src: "882811156",  type: "Trap",      platform: 'soundcloud' },
  { src: "882810868",  type: "Trap",      platform: 'soundcloud' },
  { src: "882810076",  type: "Trap",      platform: 'soundcloud' },
  { src: "576378918",  type: "Orchestra", platform: 'soundcloud' },
  { src: "576379527",  type: "Orchestra", platform: 'soundcloud' },
  { src: "615512247",  type: "Remix",     platform: 'soundcloud' },
  { src: "616400406",  type: "Remix",     platform: 'soundcloud' },
  { src: "616415394",  type: "Remix",     platform: 'soundcloud' },
  { src: "616400958",  type: "Remix",     platform: 'soundcloud' },
  { src: "616400973",  type: "Remix",     platform: 'soundcloud' },
  { src: "616400799",  type: "Remix",     platform: 'soundcloud' },
]

const filteredItems = computed(() => {
  if (activeTab.value === 'ALL') return musicData
  if (activeTab.value === 'SoundCloud') return musicData.filter(i => i.platform === 'soundcloud')
  return musicData.filter(i => i.type === activeTab.value)
})

function selectItem(item) {
  activeItem.value = item
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
const accentDimColor = ref('#8FB850')
const glowColor = ref('rgba(200, 245, 128, 0.2)')

const accentHex = computed(() => {
  return accentColor.value.replace('#', '')
})

function parseColor(val, opacity = 1) {
  if (!val) return 'rgba(0,0,0,0)'
  if (val.includes(' ') && !val.includes('(')) {
    return `rgba(${val.split(' ').join(',')}, ${opacity})`
  }
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
    const rawAccentDim = style.getPropertyValue('--accent-dim').trim() || '#8FB850'
    accentColor.value = parseColor(rawAccent)
    accentDimColor.value = parseColor(rawAccentDim, 0.26)
    glowColor.value = parseColor(rawAccent, 0.2)
  }
}

// Piano Roll Logic
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
    const x = note.x
    const y = note.row * rowH + rowH * 0.1
    const h = rowH * 0.75
    ctx.shadowColor = accent
    ctx.shadowBlur = activeItem.value ? 6 : 2
    ctx.fillStyle = parseColor(accent, note.opacity)
    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(x, y, note.width, h, 3)
    else ctx.rect(x, y, note.width, h)
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
    if (!isBlack) {
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fillRect(2, y + 1, KEYBOARD_W - 6, rowH - 2)
    }
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
      scrollTrigger: {
        trigger: '#music',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    })
  }

  window.addEventListener('resize', () => {
    if (pianoRoll.value) {
      pianoRoll.value.width = pianoRoll.value.offsetWidth
    }
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 10px;
}
</style>
