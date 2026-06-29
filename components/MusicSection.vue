<template>
  <section id="music" class="relative py-24 md:py-40 px-6 md:px-16 overflow-hidden transition-colors duration-500" style="background: var(--bg-primary)">
    <!-- Audio element for local uploads -->
    <audio 
      ref="audioEl" 
      crossorigin="anonymous"
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

      

      <!-- Items Grid (REBUILT) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div
          v-for="item in displayedItems"
          :key="item.src"
           class="beat-card group relative rounded-[1.5rem] overflow-hidden border border-[var(--border)] transition-all duration-500 flex flex-col hover:-translate-y-1 hover:border-[var(--border-accent)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
           :class="{ 'ring-1 ring-lime/50': activeItem?.src === item.src }"
           :style="{ 
             background: 'var(--bg-surface)',
             boxShadow: activeItem?.src === item.src ? `0 0 30px ${glowColor}` : 'none'
           }"
        >
           <!-- Color bar top (matching ProjectCard) -->
           <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); z-index: 10; opacity: 0.5; transition: opacity 0.3s;" class="group-hover:opacity-100"></div>

           <!-- TOP: BPM Visualization -->
           <div class="beat-bars" :class="{ active: activeItem?.src === item.src }">
            <div 
              v-for="i in 24" :key="i"
              :ref="(el) => { if (el) setBarRef(el, item.src, i - 1) }"
              class="beat-bar"
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
          class="fixed bottom-24 right-6 z-[99999] bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl py-3 px-4 flex items-center justify-between gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-[280px] hover:scale-[1.02] transition-all duration-300"
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
            <div v-if="isAudioPlaying" class="mini-bars">
              <div 
                v-for="i in 10" :key="i"
                :ref="(el) => { if (el) miniBarRefs[i - 1] = el }"
                class="mini-bar"
              />
            </div>
            <h5 class="text-text-primary text-xs font-bold truncate">
              {{ activeItem.judul }}
            </h5>
            <p class="font-mono text-[9px] text-text-muted uppercase tracking-wider truncate">
              {{ activeItem.type }} · {{ activeItem.bpm }} BPM
            </p>
          </div>
        </div>

        <!-- Close Controls -->
        <a 
          v-if="activeItem.ytLink"
          :href="activeItem.ytLink"
          target="_blank"
          class="w-6 h-6 rounded-full border border-[var(--border)] hover:border-lime text-text-muted hover:text-lime flex items-center justify-center text-[10px] transition-colors flex-shrink-0"
          title="Watch on YouTube"
        >
          ↗
        </a>
        <button 
          @click="toggleActive(activeItem)"
          class="w-6 h-6 rounded-full border border-[var(--border)] hover:border-red-400 text-text-muted hover:text-red-400 flex items-center justify-center text-[10px] font-mono transition-colors flex-shrink-0"
          title="Close Player"
        >
          ✕
        </button>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
const uploadedBeats = ref([])

const currentTime = ref(0)
const duration = ref(0)
const isAudioPlaying = ref(false)

const barRefsMap = {}
const miniBarRefs = []
let animFrame = null

const tabs = ['ALL', 'Trap Beat', 'Free FLP', 'EDM']

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
  return uploadedBeats.value
})

const filteredItems = computed(() => {
  if (activeTab.value === 'ALL') return allBeats.value
  return allBeats.value.filter(i => i.type === activeTab.value)
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
      startVisualizer()
    } else {
      audioEl.value.pause()
      isAudioPlaying.value = false
      stopVisualizer()
    }
  }
}

function toggleActive(item) {
  if (activeItem.value?.src === item.src) {
    stopVisualizer()
    activeItem.value = null
    isAudioPlaying.value = false
    if (audioEl.value) {
      audioEl.value.pause()
    }
  } else {
    stopVisualizer()
    activeItem.value = item
    currentTime.value = 0
    duration.value = 30
    if (item.platform === 'local') {
      isAudioPlaying.value = true
      nextTick(() => {
        if (audioEl.value) {
          audioEl.value.crossOrigin = 'anonymous'
          audioEl.value.src = item.src
          audioEl.value.play()
            .then(() => {
              isAudioPlaying.value = true
              startVisualizer()
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

function setBarRef(el, src, index) {
  if (!barRefsMap[src]) barRefsMap[src] = []
  barRefsMap[src][index] = el
}

function startVisualizer() {
  stopVisualizer()
  const update = () => {
    if (!analyser || !activeItem.value) {
      animFrame = requestAnimationFrame(update)
      return
    }
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    const bars = barRefsMap[activeItem.value.src]
    if (bars) {
      const step = bufferLength / bars.length
      for (let i = 0; i < bars.length; i++) {
        let val = 0
        for (let j = 0; j < step; j++) {
          val += dataArray[Math.floor(i * step + j)]
        }
        val = val / step / 255
        if (bars[i]) bars[i].style.height = `${Math.max(8, val * 90)}%`
      }
    }

    const mStep = bufferLength / miniBarRefs.length
    for (let i = 0; i < miniBarRefs.length; i++) {
      let val = 0
      for (let j = 0; j < mStep; j++) {
        val += dataArray[Math.floor(i * mStep + j)]
      }
      val = val / mStep / 255
      if (miniBarRefs[i]) miniBarRefs[i].style.height = `${Math.max(10, val * 100)}%`
    }

    animFrame = requestAnimationFrame(update)
  }
  animFrame = requestAnimationFrame(update)
}

function stopVisualizer() {
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame)
    animFrame = null
  }
  for (const src in barRefsMap) {
    const bars = barRefsMap[src]
    if (bars) {
      for (let i = 0; i < bars.length; i++) {
        if (bars[i]) bars[i].style.height = '20%'
      }
    }
  }
  for (let i = 0; i < miniBarRefs.length; i++) {
    if (miniBarRefs[i]) miniBarRefs[i].style.height = '20%'
  }
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

onMounted(() => {
  if (typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  updateColors()
  fetchUploadedBeats()

  const observer = new MutationObserver(updateColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Parallax: background BEATS text
  if (bgBeats.value) {
    gsap.to(bgBeats.value, {
      yPercent: -20,
      scrollTrigger: { trigger: '#music', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    })
  }
})

onUnmounted(() => {
  stopVisualizer()
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

/* Mini bars in floating player */
.mini-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  margin-bottom: 4px;
}
.mini-bar {
  flex: 1;
  background: var(--accent);
  border-radius: 1px 1px 0 0;
  height: 20%;
  opacity: 0.8;
  transition: height 0.05s ease;
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
}

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
