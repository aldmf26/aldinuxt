<template>
  <section id="dual-identity" class="relative py-32 md:py-56 overflow-hidden bg-[var(--bg-primary)]">
    <!-- Section Label -->
    <div class="absolute top-10 left-1/2 -translate-x-1/2 z-20">
       <span class="section-label opacity-40">Creative Duality</span>
    </div>

    <div class="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-px bg-text-primary/10 rounded-[3rem] overflow-hidden border border-text-primary/10 shadow-[0_0_100px_rgba(0,0,0,0.3)]">

        <!-- DEV SIDE -->
        <div ref="devSide" class="relative group p-10 md:p-24 bg-[var(--bg-surface)] transition-colors duration-700 hover:bg-text-primary/[0.02]">
          <div class="relative z-10 space-y-12">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 rounded-2xl bg-lime/10 flex items-center justify-center border border-lime/20 group-hover:bg-lime group-hover:text-dark transition-all duration-500 shadow-lg shadow-lime/5">
                  <span class="font-mono text-xl">&lt;/&gt;</span>
               </div>
               <div>
                  <h3 class="font-display italic text-3xl text-text-primary">Software Engineer</h3>
                  <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-text-primary/30">Logical Architecture</p>
               </div>
            </div>

            <!-- Terminal -->
            <div class="bg-[#08090D] rounded-3xl p-10 font-mono text-sm border border-white/5 shadow-2xl relative overflow-hidden">
               <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime/0 via-lime/40 to-lime/0"></div>
               <div class="flex gap-2 mb-10">
                  <div v-for="c in ['#FF5F56', '#FFBD2E', '#27C93F']" :key="c" class="w-3 h-3 rounded-full" :style="{ backgroundColor: c, opacity: 0.5 }"></div>
               </div>
               <div class="space-y-6">
                  <div v-for="(line, i) in terminalLines" :key="i" class="flex gap-4">
                     <span class="text-lime/30">$</span>
                     <span class="text-text-primary/70 leading-relaxed">{{ line.text }}</span>
                  </div>
                  <div class="flex gap-4 animate-pulse">
                     <span class="text-lime/30">$</span>
                     <span class="w-2 h-5 bg-lime/60"></span>
                  </div>
               </div>
            </div>

            <div class="flex flex-wrap gap-3">
               <span v-for="t in devStack" :key="t" class="px-6 py-3 bg-text-primary/[0.03] border border-text-primary/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-text-primary/40 hover:border-lime/40 hover:text-lime transition-all cursor-default">
                  {{ t }}
               </span>
            </div>
          </div>
        </div>

        <!-- STUDIO SIDE (REBUILT INTERACTION) -->
        <div 
          ref="studioSide" 
          class="relative group p-10 md:p-24 bg-[#0F1015] transition-all duration-700 hover:bg-[#15171E]"
          :style="{ 
            boxShadow: isPlaying 
              ? '0 0 0 1px var(--accent)40, 0 0 30px var(--accent)15' 
              : 'none'
          }"
        >
          <div class="relative z-10 space-y-12">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center border border-[#FF6B35]/20 group-hover:bg-[#FF6B35] group-hover:text-dark transition-all duration-500 shadow-lg shadow-[#FF6B35]/5">
                  <span class="font-mono text-xl">♪</span>
               </div>
               <div>
                  <h3 class="font-display italic text-3xl text-text-primary">Music Producer</h3>
                  <p class="font-mono text-[10px] uppercase tracking-[0.3em] text-text-primary/30">Sonic Sculpting</p>
               </div>
            </div>

            <!-- Studio UI -->
            <div class="bg-[#181A21] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
               <!-- Transport -->
               <div class="bg-[#21242D] px-8 py-5 flex items-center justify-between border-b border-black/40">
                  <div class="flex items-center gap-6">
                     <button 
                       @click="togglePlay" 
                       class="w-12 h-12 rounded-full bg-[#2D313D] flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-lime shadow-lg"
                       :class="{ 'btn-pulse': isPlaying }"
                     >
                        <span class="text-xl" :style="{ marginLeft: isPlaying ? '0' : '2px' }">
                          {{ isPlaying ? '■' : '▶' }}
                        </span>
                     </button>
                     <div class="hidden md:block w-32">
                        <div class="text-[10px] font-mono text-text-primary/30 uppercase mb-1">Master Volume</div>
                        <div class="h-[3px] bg-black/40 rounded-full overflow-hidden">
                           <div 
                             class="h-full bg-lime transition-all duration-150"
                             :style="{ width: volumeLevel + '%' }"
                           ></div>
                        </div>
                     </div>
                  </div>
                  <div class="font-mono text-xs tracking-widest bg-black/30 px-4 py-2 rounded-lg border border-white/5 transition-colors duration-75"
                       :style="{ color: (currentStep % 4 === 0 && isPlaying) ? 'var(--accent)' : 'var(--text-primary)' }">
                     {{ bpm }}.00 BPM
                  </div>
               </div>

               <!-- Piano Roll Grid -->
               <div class="p-8 grid grid-cols-16 gap-1 h-32">
                  <template v-for="row in ROWS" :key="`row-${row}`">
                    <div 
                      v-for="step in STEPS" :key="`cell-${row}-${step}`"
                      class="rounded-[2px] transition-all duration-75"
                      :style="{
                        background: activeCells.has(`${row-1}-${step-1}`)
                          ? (currentStep === step-1 && isPlaying 
                              ? 'var(--accent)' 
                              : 'var(--accent-dim)')
                          : (currentStep === step-1 && isPlaying
                              ? 'rgba(255,255,255,0.12)' 
                              : 'rgba(255,255,255,0.04)')
                      }"
                    ></div>
                  </template>
               </div>
            </div>

            <div class="flex flex-wrap gap-3">
               <span v-for="s in musicStack" :key="s" class="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-text-primary/40 hover:border-[#FF6B35]/40 hover:text-[#FF6B35] transition-all cursor-default">
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
import { gsap } from 'gsap'

const devSide = ref(null)
const studioSide = ref(null)

// Music Engine State
const isPlaying = ref(false)
const bpm = ref(140)
const volumeLevel = ref(60)
const ROWS = 8
const STEPS = 16
const currentStep = ref(-1)
const activeCells = ref(new Set())

let stepInterval = null
let volumeInterval = null

const terminalLines = [
  { text: 'npm run innovate' },
  { text: 'compiling vision...' },
  { text: 'ready in 12ms' },
]

const devStack = ['Nuxt JS', 'Laravel', 'PostgreSQL', 'Docker', 'GSAP']
const musicStack = ['FL Studio', 'Serum', 'FabFilter', 'Mixing', 'Arrangement']

function generateRandomPattern() {
  const pattern = new Set()
  // Kick: row 0, steps 0, 4, 8, 12
  ;[0, 4, 8, 12].forEach(s => pattern.add(`0-${s}`))
  // Snare: row 2, steps 4, 12  
  ;[4, 12].forEach(s => pattern.add(`2-${s}`))
  // Hi-hat: row 4, every 2 steps
  for (let s = 0; s < STEPS; s += 2) pattern.add(`4-${s}`)
  // Melody: random notes on rows 5-7
  for (let s = 0; s < STEPS; s++) {
    if (Math.random() > 0.7) pattern.add(`${5 + Math.floor(Math.random() * 3)}-${s}`)
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
  if (typeof window === 'undefined') return
  
  gsap.from([devSide.value, studioSide.value], {
    opacity: 0,
    y: 100,
    duration: 1.5,
    stagger: 0.3,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#dual-identity',
      start: 'top 80%',
    }
  })
})

onUnmounted(() => {
  stopPlayback()
})
</script>

<style scoped>
.grid-cols-16 {
  grid-template-columns: repeat(16, minmax(0, 1fr));
}

.btn-pulse {
  animation: buttonPulse 0.5s ease-in-out infinite alternate;
}

@keyframes buttonPulse {
  from { box-shadow: 0 0 0px var(--accent); }
  to   { box-shadow: 0 0 12px var(--accent); }
}
</style>
