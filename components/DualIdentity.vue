<template>
  <section id="dual-identity" class="relative py-32 md:py-56 overflow-hidden bg-[var(--bg-primary)]">
    <div class="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
      <div class="rounded-[3rem] overflow-hidden border border-[var(--border-strong)] shadow-[0_0_100px_rgba(0,0,0,0.18)] bg-[var(--bg-surface)]">

        <!-- Two-Column Spectrum (NO DIVIDER) -->
        <div ref="panelsRef" class="grid grid-cols-1 md:grid-cols-2">
          <!-- DEV SIDE -->
          <div ref="devPanel" class="relative p-10 md:p-16 space-y-8 bg-[var(--bg-surface)] transition-colors duration-700 hover:bg-[var(--text-primary)]/[0.01]">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                <span class="font-mono text-lg text-[var(--accent)]">&lt;/&gt;</span>
              </div>
              <div>
                <h3 class="font-display text-2xl font-bold text-[var(--text-primary)]">{{ $t('identity.engineer') }}</h3>
                <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]/70">{{ $t('identity.architecture') }}</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span v-for="t in devStack" :key="t" class="px-4 py-2 bg-[var(--bg-primary)] ring-1 ring-[var(--border)] rounded-lg font-mono text-[11px] tracking-wider text-[var(--text-primary)]/50 hover:ring-[var(--accent)]/40 hover:text-[var(--accent)] transition-all cursor-default">
                {{ t }}
              </span>
            </div>
          </div>

          <!-- MUSIC SIDE (Same visual weight, no border divider) -->
          <div
            ref="musicPanel"
            class="relative p-10 md:p-16 space-y-8 bg-[var(--bg-surface)] transition-all duration-700 hover:bg-[var(--text-primary)]/[0.01]"
            :style="{ 
              boxShadow: isPlaying 
                ? '0 0 30px var(--border-accent)' 
                : 'none'
            }"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                <span class="font-mono text-lg text-[var(--accent)]">♪</span>
              </div>
              <div>
                <h3 class="font-display text-2xl font-bold text-[var(--text-primary)]">{{ $t('identity.producer') }}</h3>
                <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]/70">{{ $t('identity.sculpting') }}</p>
              </div>
            </div>

            <!-- Studio UI — Simplified Transport -->
            <div class="bg-[var(--bg-elevated)] rounded-2xl overflow-hidden border border-[var(--border)]">
              <div class="bg-[var(--bg-surface)] px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
                <div class="flex items-center gap-4">
                  <button 
                    @click="togglePlay" 
                    class="w-9 h-9 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-[var(--accent)] border border-[var(--border)]"
                    :class="{ 'btn-pulse': isPlaying }"
                  >
                    <span class="text-sm" :style="{ marginLeft: isPlaying ? '0' : '1px' }">
                      {{ isPlaying ? '■' : '▶' }}
                    </span>
                  </button>
                  <div class="font-mono text-[11px] tracking-widest text-[var(--text-secondary)]"
                       :style="{ color: (currentStep % 4 === 0 && isPlaying) ? 'var(--accent)' : '' }">
                    {{ bpm }}.00 BPM
                  </div>
                </div>
              </div>

              <!-- Piano Roll Grid -->
              <div class="p-5 grid gap-0.5 h-24" style="grid-template-columns: repeat(16, minmax(0, 1fr))">
                <template v-for="row in ROWS" :key="`row-${row}`">
                  <div 
                    v-for="step in STEPS" :key="`cell-${row}-${step}`"
                    class="rounded-sm transition-all duration-75"
                    :style="{
                      background: activeCells[`${row-1}-${step-1}`]
                        ? (currentStep === step-1 && isPlaying 
                            ? 'var(--accent)' 
                            : 'var(--accent-dim)')
                        : 'var(--text-primary)',
                      opacity: activeCells[`${row-1}-${step-1}`]
                        ? 1
                        : (currentStep === step-1 && isPlaying ? 0.35 : 0.06)
                    }"
                  ></div>
                </template>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <span v-for="s in musicStack" :key="s" class="px-4 py-2 bg-[var(--bg-primary)] ring-1 ring-[var(--border)] rounded-lg font-mono text-[11px] tracking-wider text-[var(--text-primary)]/50 hover:ring-[var(--accent)]/40 hover:text-[var(--accent)] transition-all cursor-default">
                {{ s }}
              </span>
            </div>
          </div>

          <!-- Gradient line divider (subtle) -->
          <div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent opacity-50 pointer-events-none"></div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const panelsRef = ref(null)
const devPanel = ref(null)
const musicPanel = ref(null)

// Music Engine State
const isPlaying = ref(false)
const bpm = ref(140)
const ROWS = 8
const STEPS = 16
const currentStep = ref(-1)
const activeCells = ref({})

let stepInterval = null

const devStack = ['Nuxt JS', 'Laravel', 'Tailwind', 'PostgreSQL', 'MySQL', 'Git', 'Docker']
const musicStack = ['FL Studio', 'Serum', 'FabFilter', 'Mixing', 'Arrangement', 'Sound Design', 'Capcut']

function generateRandomPattern() {
  const pattern = {}
  ;[0, 4, 8, 12].forEach(s => { pattern[`0-${s}`] = true })
  ;[4, 12].forEach(s => { pattern[`2-${s}`] = true })
  for (let s = 0; s < STEPS; s += 2) pattern[`4-${s}`] = true
  for (let s = 0; s < STEPS; s++) {
    if (Math.random() > 0.7) pattern[`${5 + Math.floor(Math.random() * 3)}-${s}`] = true
  }
  return pattern
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startPlayback()
  } else {
    stopPlayback()
  }
}

function startPlayback() {
  const msPerStep = (60 / bpm.value) * 1000 / 4
  currentStep.value = 0
  activeCells.value = generateRandomPattern()
  stepInterval = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % STEPS
  }, msPerStep)
}

function stopPlayback() {
  clearInterval(stepInterval)
  stepInterval = null
  currentStep.value = -1
}

onMounted(() => {
  if (typeof window === 'undefined') return

  gsap.fromTo(
    panelsRef.value,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: panelsRef.value,
        start: 'top 88%',
        once: true,
      },
    }
  )

  // Stagger the two panels
  gsap.fromTo(
    [devPanel.value, musicPanel.value],
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: panelsRef.value,
        start: 'top 85%',
        once: true,
      },
    }
  )
})

onUnmounted(() => {
  stopPlayback()
})
</script>

<style scoped>

.dual-panel {
  animation: panelRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes panelRise {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.btn-pulse {
  animation: buttonPulse 0.5s ease-in-out infinite alternate;
}

@keyframes buttonPulse {
  from { box-shadow: 0 0 0px var(--accent); }
  to   { box-shadow: 0 0 12px var(--accent); }
}
</style>
