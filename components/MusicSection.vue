<template>
  <section id="music" class="relative py-24 md:py-40 px-6 md:px-16 overflow-hidden transition-colors duration-500" style="background: var(--bg-primary)">
    <!-- Audio element for local uploads -->
    <audio 
      ref="audioEl" 
      @ended="activeItem = null" 
      @timeupdate="updateAudioProgress" 
      @loadedmetadata="onAudioLoaded"
      @play="isAudioPlaying = true"
      @pause="isAudioPlaying = false"
      class="hidden"
    ></audio>

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
              : 'bg-[var(--bg-surface)] text-text-muted hover:text-text-primary border border-[var(--border)]'
          ]"
          class="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Real-Time Music Visualizer -->
      <div 
        ref="pianoRollRef" 
        class="mb-20 scroll-mt-32 visualizer-wrapper rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]/50 p-4"
        :class="{ 'is-floating': isVisualizerFloating && activeItem }"
      >
        <div class="flex justify-between items-center mb-2 px-2">
          <span class="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-text-muted uppercase truncate pr-4">
            {{ activeItem ? `${activeItem.platform === 'local' ? '▶ PLAYING' : '▶ BPM SYNC'} — ${activeItem.judul || 'Track'}` : '● LAB VISUALIZER — SELECT A BEAT' }}
          </span>
          <span class="font-mono text-[9px] text-lime opacity-60 whitespace-nowrap">
            {{ activeItem?.platform === 'local' ? 'REAL SPECTRUM' : 'FL STUDIO SYNC' }}
          </span>
        </div>
        <div class="relative rounded-xl overflow-hidden bg-black/40">
          <canvas ref="pianoRoll" class="w-full block" height="130"></canvas>
        </div>
      </div>

      <!-- Items Grid (REBUILT) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in displayedItems"
          :key="item.src"
           class="beat-card group relative rounded-[1.5rem] overflow-hidden border border-[var(--border)] transition-all duration-500 flex flex-col"
           :class="{ 'ring-1 ring-lime/50': activeItem?.src === item.src }"
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
              v-if="item.platform !== 'local'"
              :href="`https://www.youtube.com/watch?v=${item.src.split('?')[0]}`"
              target="_blank"
              class="yt-link"
            >
              Watch on YouTube ↗
            </a>
            <a 
              v-else-if="item.ytLink"
              :href="item.ytLink"
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
          class="px-10 py-5 bg-[var(--bg-surface)] border border-[var(--border)] text-text-primary font-mono text-xs uppercase tracking-widest rounded-full hover:bg-white/[0.03] transition-all duration-300"
        >
          Show All Tracks ({{ filteredItems.length }})
        </button>
      </div>
    </div>

    <!-- Mini Floating Player on Bottom-Left -->
    <transition name="slide-up-left">
      <div 
        v-if="activeItem" 
        class="fixed bottom-6 left-6 z-[999] bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl py-3 px-4 flex items-center justify-between gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-[280px] hover:scale-[1.02] transition-all duration-300"
      >
        <!-- Mini controls & Info -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <button 
            @click="togglePlayPause"
            class="w-8 h-8 rounded-full bg-lime text-dark flex items-center justify-center text-[10px] font-bold flex-shrink-0 hover:scale-105 transition-transform"
          >
            {{ isAudioPlaying ? '⏸' : '▶' }}
          </button>
          
          <div class="min-w-0 flex-1">
            <h5 class="text-text-primary text-xs font-bold truncate">
              {{ activeItem.judul }}
            </h5>
            <p class="font-mono text-[9px] text-text-muted uppercase tracking-wider truncate">
              {{ activeItem.type }} · {{ activeItem.bpm }} BPM
            </p>
          </div>
        </div>

        <!-- Close Controls -->
        <div class="flex items-center gap-2">
          <a 
            v-if="activeItem.platform !== 'local'"
            :href="`https://www.youtube.com/watch?v=${activeItem.src.split('?')[0]}`"
            target="_blank"
            class="w-6 h-6 rounded-full border border-[var(--border)] hover:border-lime text-text-muted hover:text-lime flex items-center justify-center text-[10px] transition-colors"
            title="Watch Full Video"
          >
            ↗
          </a>
          <a 
            v-else-if="activeItem.ytLink"
            :href="activeItem.ytLink"
            target="_blank"
            class="w-6 h-6 rounded-full border border-[var(--border)] hover:border-lime text-text-muted hover:text-lime flex items-center justify-center text-[10px] transition-colors"
            title="Watch Full Video"
          >
            ↗
          </a>
          <button 
            @click="toggleActive(activeItem)"
            class="w-6 h-6 rounded-full border border-[var(--border)] hover:border-red-400 text-text-muted hover:text-red-400 flex items-center justify-center text-[10px] font-mono transition-colors"
            title="Close Player"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>
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

// Audio Elements & State
const audioEl = ref(null)
let audioCtx = null
let analyser = null
let sourceNode = null
let animFrame = null
const uploadedBeats = ref([])

const currentTime = ref(0)
const duration = ref(0)
const isAudioPlaying = ref(false)
const isVisualizerFloating = ref(false)

const tabs = ['ALL', 'Trap Beat', 'Free FLP', 'EDM', 'SoundCloud']

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

const fetchUploadedBeats = async () => {
  try {
    const res = await fetch('/api/beats')
    if (res.ok) {
      uploadedBeats.value = await res.json()
    }
  } catch (e) {
    console.log('No uploaded beats yet or error loading them')
  }
}

const allBeats = computed(() => {
  return [...uploadedBeats.value, ...musicData]
})

const filteredItems = computed(() => {
  if (activeTab.value === 'ALL') return allBeats.value
  return allBeats.value.filter(i => i.type === activeTab.value || (activeTab.value === 'SoundCloud' && i.platform === 'soundcloud'))
})

const displayedItems = computed(() => {
  if (showAllItems.value) return filteredItems.value
  return filteredItems.value.slice(0, displayLimit.value)
})

function setupAudioContext() {
  if (!process.client) return
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 128
    sourceNode = audioCtx.createMediaElementSource(audioEl.value)
    sourceNode.connect(analyser)
    analyser.connect(audioCtx.destination)
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

function onAudioLoaded() {
  if (audioEl.value) {
    duration.value = audioEl.value.duration
  }
}

function updateAudioProgress() {
  if (audioEl.value) {
    currentTime.value = audioEl.value.currentTime
  }
}

function togglePlayPause() {
  if (audioEl.value) {
    if (audioEl.value.paused) {
      audioEl.value.play().catch(err => console.log(err))
      isAudioPlaying.value = true
    } else {
      audioEl.value.pause()
      isAudioPlaying.value = false
    }
  }
}

function toggleActive(item) {
  if (activeItem.value?.src === item.src) {
    activeItem.value = null
    isAudioPlaying.value = false
    if (audioEl.value) {
      audioEl.value.pause()
    }
  } else {
    activeItem.value = item
    currentTime.value = 0
    duration.value = 30
    if (item.platform === 'local') {
      isAudioPlaying.value = true
      nextTick(() => {
        if (audioEl.value) {
          audioEl.value.src = item.src
          audioEl.value.play()
            .then(() => {
              isAudioPlaying.value = true
            })
            .catch(e => {
              console.log('Audio playback block:', e)
              isAudioPlaying.value = false
            })
          setupAudioContext()
        }
      })
    } else {
      isAudioPlaying.value = true
      if (audioEl.value) {
        audioEl.value.pause()
      }
    }
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

function drawVisualizer() {
  const canvas = pianoRoll.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth || 800
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  
  const style = getComputedStyle(document.documentElement)
  const accent = accentColor.value
  const bgSurface = style.getPropertyValue('--bg-surface').trim() || '#1A1A1A'
  
  ctx.fillStyle = bgSurface
  ctx.fillRect(0, 0, W, H)

  const barsCount = 64
  const barWidth = W / barsCount
  const time = performance.now() * 0.001
  const active = activeItem.value
  const bpm = active?.bpm || 120

  // Draw technological background grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y < H; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  let dataArray = new Uint8Array(0)
  if (active && active.platform === 'local' && analyser) {
    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
  }

  const pulseFactor = Math.abs(Math.sin(time * Math.PI * (bpm / 60)))
  const isPlayingLocal = active && active.platform === 'local' && dataArray.length > 0

  for (let i = 0; i < barsCount; i++) {
    let rawHeight = 0

    if (isPlayingLocal) {
      const dataIndex = Math.floor((i / barsCount) * dataArray.length)
      rawHeight = (dataArray[dataIndex] / 255) * H * 0.95
    } else if (active) {
      const waveFreq = Math.sin(time * 5 + i * 0.25) * 0.25 + 0.35
      const beatImpact = Math.pow(pulseFactor, 4) * 0.5 + 0.1
      rawHeight = (waveFreq + beatImpact) * H * 0.65
    } else {
      const waveFreq = Math.sin(time * 2.0 + i * 0.15) * 0.15 + 0.1
      rawHeight = waveFreq * H * 0.4
    }

    if (active) {
      rawHeight += Math.random() * 2
    }

    const height = Math.max(4, rawHeight)
    const x = i * barWidth
    const y = H - height

    const grad = ctx.createLinearGradient(x, y, x, H)
    grad.addColorStop(0, accent)
    grad.addColorStop(1, parseColor(accent, 0.05))

    ctx.fillStyle = grad
    ctx.shadowColor = accent
    ctx.shadowBlur = active ? 8 : 2

    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(x + 2, y, barWidth - 4, height, 4)
      ctx.fill()
    } else {
      ctx.fillRect(x + 2, y, barWidth - 4, height)
    }
    ctx.shadowBlur = 0
  }

  animFrame = requestAnimationFrame(drawVisualizer)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  updateColors()
  fetchUploadedBeats()
  drawVisualizer()

  const observer = new MutationObserver(updateColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Parallax: background BEATS text
  if (bgBeats.value) {
    gsap.to(bgBeats.value, {
      yPercent: -20,
      scrollTrigger: { trigger: '#music', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    })
  }

  // ScrollTrigger to detach visualizer and make it float in 3D perspective on the left
  ScrollTrigger.create({
    trigger: '#music',
    start: 'bottom 10%',
    onEnter: () => {
      isVisualizerFloating.value = true
    },
    onLeaveBack: () => {
      isVisualizerFloating.value = false
    }
  })

  // Visualizer parallax (only active when not floating)
  if (pianoRollRef.value) {
    gsap.to(pianoRollRef.value, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#music',
        start: 'top bottom',
        end: 'center top',
        scrub: 1.8,
      }
    })
  }

  window.addEventListener('resize', () => {
    if (pianoRoll.value) pianoRoll.value.width = pianoRoll.value.offsetWidth
  })
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  if (audioEl.value) {
    audioEl.value.pause()
  }
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
  border-bottom: 1px solid var(--border);
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

/* Floating Visualizer Apple Style 3D on the Left */
.visualizer-wrapper {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              width 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s,
              background 0.4s,
              box-shadow 0.6s;
}

.visualizer-wrapper.is-floating {
  position: fixed;
  bottom: 84px;
  left: 24px;
  right: auto;
  width: 280px;
  z-index: 998;
  margin-bottom: 0;
  transform: perspective(1200px) rotateY(20deg) rotateX(12deg) scale(0.9);
  transform-style: preserve-3d;
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(200, 245, 128, 0.25);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8),
              0 0 20px rgba(200, 245, 128, 0.05);
}

.visualizer-wrapper.is-floating::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--accent), transparent 60%);
  pointer-events: none;
  z-index: -1;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .visualizer-wrapper.is-floating {
    width: calc(100% - 32px);
    left: 16px;
    bottom: 104px;
    transform: perspective(1000px) rotateY(10deg) rotateX(8deg) scale(0.95);
  }
}

/* Slide Up Left Animation */
.slide-up-left-enter-active,
.slide-up-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
}
.slide-up-left-enter-from,
.slide-up-left-leave-to {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}
</style>
