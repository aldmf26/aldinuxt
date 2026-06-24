<template>
  <section id="dual-identity" class="relative py-32 md:py-56 overflow-hidden bg-[var(--bg-primary)]">
    <!-- Section Label -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2 z-20">
       <span class="section-label opacity-40">WHAT I DO</span>
    </div>

    <div class="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 rounded-[3rem] overflow-hidden border border-[var(--border-strong)] shadow-[0_0_100px_rgba(0,0,0,0.18)]">

        <!-- DEV SIDE -->
        <div ref="devSide" class="dual-panel relative group p-10 md:p-24 bg-[var(--bg-surface)] transition-colors duration-700 hover:bg-[var(--text-primary)]/[0.01] border-b lg:border-b-0 lg:border-r border-[var(--border-strong)]">
          <div class="relative z-10 space-y-12">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] transition-all duration-500 shadow-lg shadow-[var(--accent)]/5">
                  <span class="font-mono text-xl">&lt;/&gt;</span>
               </div>
               <div>
                  <h3 class="font-display italic text-3xl text-[var(--text-primary)]">Software Engineer</h3>
                  <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-primary)]/30">Logical Architecture</p>
               </div>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 rounded-2xl overflow-hidden font-mono border border-[var(--border-strong)] divide-x divide-y divide-[var(--border-strong)]">
              <div class="bg-[var(--bg-primary)] p-8 flex flex-col items-center text-center group">
                <span class="text-[var(--accent)] text-5xl md:text-6xl font-black tabular-nums">5+</span>
                <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--text-primary)]/40 mt-3">Years Building</span>
              </div>
              <div class="bg-[var(--bg-primary)] p-8 flex flex-col items-center text-center group">
                <span class="text-[var(--accent)] text-5xl md:text-6xl font-black tabular-nums">20+</span>
                <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--text-primary)]/40 mt-3">Projects Shipped</span>
              </div>
              <div class="bg-[var(--bg-primary)] p-8 flex flex-col items-center text-center group">
                <span class="text-[var(--accent)] text-5xl md:text-6xl font-black tabular-nums">12+</span>
                <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--text-primary)]/40 mt-3">Stack Mastered</span>
              </div>
              <div class="bg-[var(--bg-primary)] p-8 flex flex-col items-center text-center group">
                <span class="text-[var(--accent)] text-5xl md:text-6xl font-black tabular-nums">100%</span>
                <span class="text-[10px] uppercase tracking-[0.25em] text-[var(--text-primary)]/40 mt-3">Client Sat.</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
               <span v-for="t in devStack" :key="t" class="px-4 py-2 bg-[var(--bg-primary)] ring-1 ring-[var(--border)] rounded-lg font-mono text-[11px] tracking-wider text-[var(--text-primary)]/50 hover:ring-[var(--accent)]/40 hover:text-[var(--accent)] transition-all cursor-default">
                  {{ t }}
               </span>
            </div>
          </div>
        </div>

        <!-- STUDIO SIDE (REBUILT INTERACTION) -->
        <div 
          ref="studioSide" 
          class="dual-panel relative group p-10 md:p-24 bg-[var(--bg-surface)] transition-all duration-700 border-t lg:border-t-0 lg:border-l border-[var(--border)]"
          :style="{ 
            boxShadow: isPlaying 
              ? '0 0 30px var(--border-accent)' 
              : 'none'
          }"
        >
          <div class="relative z-10 space-y-12">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] transition-all duration-500 shadow-lg shadow-[var(--accent)]/5">
                  <span class="font-mono text-xl">♪</span>
               </div>
               <div>
                  <h3 class="font-display italic text-3xl text-[var(--text-primary)]">Music Producer</h3>
                  <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-primary)]/30">Sonic Sculpting</p>
               </div>
            </div>

            <!-- Studio UI -->
            <div class="bg-[var(--bg-elevated)] rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl">
               <!-- Transport -->
               <div class="bg-[var(--bg-surface)] px-8 py-5 flex items-center justify-between border-b border-[var(--border)]">
                  <div class="flex items-center gap-6">
                     <button 
                       @click="togglePlay" 
                       class="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-[var(--accent)] shadow-lg border border-[var(--border)]"
                       :class="{ 'btn-pulse': isPlaying }"
                     >
                        <span class="text-xl" :style="{ marginLeft: isPlaying ? '0' : '2px' }">
                          {{ isPlaying ? '■' : '▶' }}
                        </span>
                     </button>
                     <div class="hidden md:block w-32">
                        <div class="text-[10px] font-mono text-[var(--text-primary)]/30 uppercase mb-1">Master Volume</div>
                        <div class="h-[3px] bg-[var(--bg-primary)] rounded-full overflow-hidden">
                           <div 
                             class="h-full bg-[var(--accent)] transition-all duration-150"
                             :style="{ width: volumeLevel + '%' }"
                           ></div>
                        </div>
                     </div>
                  </div>
                  <div class="font-mono text-xs tracking-widest bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--border)] transition-colors duration-75"
                       :style="{ color: (currentStep % 4 === 0 && isPlaying) ? 'var(--accent)' : 'var(--text-primary)' }">
                     {{ bpm }}.00 BPM
                  </div>
               </div>

               <!-- Piano Roll Grid -->
               <div class="p-8 grid gap-1 h-32" style="grid-template-columns: repeat(16, minmax(0, 1fr))">
                  <template v-for="row in ROWS" :key="`row-${row}`">
                    <div 
                      v-for="step in STEPS" :key="`cell-${row}-${step}`"
                      class="rounded-[2px] transition-all duration-75"
                      :style="{
                        background: activeCells[`${row-1}-${step-1}`]
                          ? (currentStep === step-1 && isPlaying 
                              ? 'var(--accent)' 
                              : 'var(--accent-dim)')
                          : 'var(--text-primary)',
                        opacity: activeCells[`${row-1}-${step-1}`]
                          ? 1
                          : (currentStep === step-1 && isPlaying ? 0.35 : 0.08)
                      }"
                    ></div>
                  </template>
               </div>
            </div>

            <div class="flex flex-wrap gap-3">
               <span v-for="s in musicStack" :key="s" class="px-4 py-2 bg-[var(--bg-primary)] ring-1 ring-[var(--border)] rounded-lg font-mono text-[11px] tracking-wider text-[var(--text-primary)]/50 hover:ring-[var(--accent)]/40 hover:text-[var(--accent)] transition-all cursor-default">
                  {{ s }}
               </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>

const devSide = ref(null)
const studioSide = ref(null)

// Music Engine State
const isPlaying = ref(false)
const bpm = ref(140)
const volumeLevel = ref(60)
const ROWS = 8
const STEPS = 16
const currentStep = ref(-1)
const activeCells = ref({})

let stepInterval = null
let volumeInterval = null

const devStack = ['Nuxt JS', 'Laravel', 'PostgreSQL', 'Docker', 'GSAP']
const musicStack = ['FL Studio', 'Serum', 'FabFilter', 'Mixing', 'Arrangement']

function generateRandomPattern() {
  const pattern = {}
  // Kick: row 0, steps 0, 4, 8, 12
  ;[0, 4, 8, 12].forEach(s => { pattern[`0-${s}`] = true })
  // Snare: row 2, steps 4, 12
  ;[4, 12].forEach(s => { pattern[`2-${s}`] = true })
  // Hi-hat: row 4, every 2 steps
  for (let s = 0; s < STEPS; s += 2) pattern[`4-${s}`] = true
  // Melody: random notes on rows 5-7
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
  const msPerStep = (60 / bpm.value) * 1000 / 4 // 16th notes
  currentStep.value = 0
  activeCells.value = generateRandomPattern()
  
  stepInterval = setInterval(() => {
    currentStep.value = (currentStep.value + 1) % STEPS
  }, msPerStep)

  volumeInterval = setInterval(() => {
    volumeLevel.value = 45 + Math.random() * 35
  }, 150)
}

function stopPlayback() {
  clearInterval(stepInterval)
  clearInterval(volumeInterval)
  stepInterval = null
  volumeInterval = null
  currentStep.value = -1
  volumeLevel.value = 60
}

onMounted(() => {
  // no GSAP needed — CSS handles entrance
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
