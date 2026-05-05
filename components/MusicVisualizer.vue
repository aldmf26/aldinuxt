<template>
  <section id="music" class="relative py-24 md:py-40 px-6 md:px-16 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500">
    <!-- Background "BEATS" text -->
    <div
      ref="bgBeats"
      class="absolute top-16 left-1/2 -translate-x-1/2 font-display italic text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap"
      style="font-size: clamp(100px, 12vw, 200px)"
    >
      BEATS
    </div>

    <div class="max-w-[1600px] mx-auto relative z-10">
      <!-- Section header -->
      <div ref="sectionHeader" class="mb-16 opacity-0">
        <span class="font-mono text-xs text-lime tracking-[0.3em] uppercase block mb-4">Sound Lab</span>
        <h2 class="font-display italic text-text-primary leading-none" style="font-size: clamp(48px, 7vw, 120px)">
          Beats &<br/>Productions
        </h2>
        <!-- Animated waveform under heading -->
        <svg class="w-full max-w-md h-8 mt-4" viewBox="0 0 400 30" fill="none">
          <path
            v-for="i in 3"
            :key="i"
            :d="generateWavePath(i)"
            style="stroke: var(--accent)"
            :stroke-width="1"
            fill="none"
            :opacity="0.3 / i"
            class="waveform-path"
            :style="{ animationDelay: i * 0.3 + 's' }"
          />
        </svg>
      </div>

      <!-- Audio Spectrum Visualizer -->
      <div ref="visualizerRef" class="relative h-32 md:h-48 mb-20 rounded-xl overflow-hidden bg-black/20 border border-white/5">
        <canvas ref="spectrumCanvas" class="w-full h-full"></canvas>
      </div>

      <!-- Featured Beats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          v-for="(beat, i) in beats"
          :key="i"
          ref="beatCards"
          class="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-lime/30 transition-all duration-500 opacity-0 translate-y-[40px]"
          data-cursor-hover
        >
          <!-- Waveform thumbnail -->
          <svg class="w-full h-16 mb-4" :viewBox="`0 0 300 60`" fill="none">
            <path
              :d="beat.waveform"
              style="stroke: var(--accent)"
              stroke-width="1.5"
              fill="none"
              opacity="0.6"
            />
          </svg>

          <h4 class="font-body font-semibold text-lg text-text-primary mb-2">{{ beat.name }}</h4>

          <div class="flex items-center gap-3 mb-4">
            <span class="font-mono text-xs text-lime/60">{{ beat.bpm }} BPM</span>
            <span class="w-1 h-1 rounded-full bg-text-muted"></span>
            <span class="font-mono text-xs text-text-muted">{{ beat.mood }}</span>
          </div>

          <a
            :href="'https://www.youtube.com/@ALdMFbeat'"
            target="_blank"
            class="group inline-flex items-center gap-2 px-4 py-2 bg-lime/10 rounded-full font-mono text-xs text-lime hover:bg-lime/20 transition-all"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Preview
          </a>
        </div>
      </div>

      <!-- YouTube CTA -->
      <div ref="ytCta" class="text-center opacity-0">
        <a
          href="https://www.youtube.com/@ALdMFbeat"
          target="_blank"
          class="group inline-flex items-center gap-4 px-10 py-5 bg-lime text-dark font-body font-bold text-base tracking-wide rounded-full hover:bg-lime/90 transition-all duration-300"
          data-cursor-hover
        >
          HEAR MY BEATS ON YOUTUBE
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionHeader = ref(null)
const spectrumCanvas = ref(null)
const visualizerRef = ref(null)
const beatCards = ref([])
const ytCta = ref(null)
const bgBeats = ref(null)

const beats = [
  {
    name: 'Midnight Signal',
    bpm: 140,
    mood: 'Dark Trap',
    waveform: generateBeatWaveform(1),
  },
  {
    name: 'Neon Drift',
    bpm: 128,
    mood: 'Lo-fi Hip Hop',
    waveform: generateBeatWaveform(2),
  },
  {
    name: 'Kalimantan Haze',
    bpm: 95,
    mood: 'Chill Boom Bap',
    waveform: generateBeatWaveform(3),
  },
]

function generateBeatWaveform(seed) {
  let d = 'M 0 30'
  for (let i = 0; i <= 300; i += 2) {
    const y = 30 + Math.sin(i * 0.08 + seed) * 15 + Math.sin(i * 0.03 + seed * 2) * 10 + (Math.sin(i * seed * 0.1) * 5)
    d += ` L ${i} ${y}`
  }
  return d
}

function generateWavePath(seed) {
  let d = 'M 0 15'
  for (let i = 0; i <= 400; i += 3) {
    const y = 15 + Math.sin(i * 0.05 + seed) * 10 + Math.sin(i * 0.02) * 5
    d += ` L ${i} ${y}`
  }
  return d
}

// Spectrum visualizer
let animId = null
const getAccentColor = () => {
  if (typeof document !== 'undefined') {
    const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    if (hex) return hex
  }
  return '#C8F580'
}

const drawSpectrum = () => {
  const canvas = spectrumCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth * 2
  canvas.height = canvas.offsetHeight * 2

  const bars = 70
  const barWidth = canvas.width / bars
  const time = performance.now() * 0.001

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < bars; i++) {
      const frequency = Math.sin(time * 2 + i * 0.3) * 0.3 +
                        Math.sin(time * 3.5 + i * 0.1) * 0.2 +
                        Math.sin(time * 1.5 + i * 0.5) * 0.15 +
                        0.35

      const height = frequency * canvas.height * 0.8
      const x = i * barWidth + 2
      const y = canvas.height - height

      // Gradient per bar
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height)
      gradient.addColorStop(0, getAccentColor() + 'cc') // 80% opacity in hex
      gradient.addColorStop(1, getAccentColor() + '1a') // 10% opacity in hex

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth - 4, height)
    }

    animId = requestAnimationFrame(draw)
  }

  draw()
}

onMounted(() => {
  if (typeof window === 'undefined') return

  // Section header
  gsap.to(sectionHeader.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: sectionHeader.value, start: 'top 80%' },
  })
  gsap.from(sectionHeader.value, {
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: sectionHeader.value, start: 'top 80%' },
  })

  // Start spectrum when visible
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      drawSpectrum()
    } else {
      if (animId) cancelAnimationFrame(animId)
    }
  }, { threshold: 0.2 })

  if (visualizerRef.value) observer.observe(visualizerRef.value)

  // Beat cards
  nextTick(() => {
    if (beatCards.value) {
      const cards = Array.isArray(beatCards.value) ? beatCards.value : [beatCards.value]
      cards.forEach((card, i) => {
        if (!card) return
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        })
      })
    }
  })

  // YT CTA
  gsap.to(ytCta.value, {
    opacity: 1,
    duration: 0.6,
    scrollTrigger: { trigger: ytCta.value, start: 'top 85%' },
  })

  // Background parallax
  gsap.to(bgBeats.value, {
    yPercent: -20,
    scrollTrigger: {
      trigger: '#music',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    },
  })
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.waveform-path {
  animation: waveMove 3s ease-in-out infinite alternate;
}

@keyframes waveMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-10px); }
}
</style>
