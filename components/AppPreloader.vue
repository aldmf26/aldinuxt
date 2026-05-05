<template>
  <div
    ref="preloaderRef"
    class="fixed inset-0 z-[9998] bg-[var(--bg-primary)] flex items-center justify-center transition-colors duration-500"
  >
    <!-- Waveform SVG -->
    <div class="absolute inset-0 flex items-center justify-center">
      <svg
        ref="waveformSvg"
        class="w-[80%] max-w-[600px] h-24 opacity-30"
        viewBox="0 0 600 100"
        fill="none"
      >
        <path
          ref="waveformPath"
          :d="waveformD"
          style="stroke: var(--accent)"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="1200"
          stroke-dashoffset="1200"
        />
      </svg>
    </div>

    <!-- Counter -->
    <div class="relative z-10 text-center">
      <div class="font-mono text-5xl md:text-7xl tracking-wider text-text-muted mb-8">
        <span ref="counterRef">000</span>
      </div>

      <!-- Name reveal -->
      <div class="overflow-hidden">
        <h1
          ref="nameRef"
          class="font-display text-6xl md:text-8xl italic text-lime opacity-0 tracking-tight"
        >
          ALDI
        </h1>
      </div>
    </div>

    <!-- Skip button -->
    <button
      @click="skipPreloader"
      class="absolute bottom-8 right-8 font-mono text-xs text-text-muted hover:text-lime transition-colors tracking-widest uppercase"
    >
      Skip →
    </button>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const emit = defineEmits(['complete'])

const preloaderRef = ref(null)
const waveformPath = ref(null)
const counterRef = ref(null)
const nameRef = ref(null)

// Generate waveform path
const generateWaveform = () => {
  let d = 'M 0 50'
  for (let i = 0; i <= 600; i += 3) {
    const y = 50 + Math.sin(i * 0.05) * 20 + Math.sin(i * 0.02) * 15 + (Math.random() - 0.5) * 10
    d += ` L ${i} ${y}`
  }
  return d
}
const waveformD = generateWaveform()

let tl = null

const animatePreloader = () => {
  tl = gsap.timeline({
    onComplete: () => {
      completePreloader()
    },
  })

  // Waveform draws in
  tl.to(waveformPath.value, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.inOut',
  }, 0)

  // Counter counts up
  const counter = { value: 0 }
  tl.to(counter, {
    value: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (counterRef.value) {
        counterRef.value.textContent = String(Math.floor(counter.value)).padStart(3, '0')
      }
    },
  }, 0)

  // Name fades in
  tl.to(nameRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, 1.4)

  // Scale down and fade out
  tl.to(preloaderRef.value, {
    scale: 0.95,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  }, 2.2)
}

const completePreloader = () => {
  emit('complete')
}

const skipPreloader = () => {
  if (tl) tl.kill()
  gsap.to(preloaderRef.value, {
    opacity: 0,
    duration: 0.3,
    onComplete: completePreloader,
  })
}

onMounted(() => {
  animatePreloader()
})
</script>
