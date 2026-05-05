<template>
  <section id="dual-identity" class="relative py-16 md:py-40 overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-6 md:px-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-0 relative">

        <!-- LEFT: DEV MODE -->
        <div
          ref="devSide"
          class="relative p-8 md:p-16 rounded-2xl lg:rounded-l-2xl lg:rounded-r-none overflow-hidden opacity-0 bg-[var(--bg-surface)] border border-text-primary/10 lg:border-r-0"
        >
          <!-- Background symbol -->
          <div class="absolute top-8 right-8 text-[15vw] lg:text-[10vw] leading-none font-mono text-text-primary opacity-[0.03] select-none pointer-events-none">&lt;/&gt;</div>

          <div class="relative z-10">
            <h3 class="font-mono text-sm text-text-primary tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-lime"></span>
              // Dev Mode
            </h3>

            <!-- Terminal -->
            <div class="bg-black/60 rounded-xl p-6 font-mono text-sm mb-10 border border-text-primary/10 shadow-2xl">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div class="space-y-4">
                <div v-for="(line, i) in terminalLines" :key="i" class="flex items-start gap-3">
                  <span class="text-lime/60 mt-1">$</span>
                  <span ref="terminalRefs" class="text-text-primary/80 terminal-line leading-relaxed" :data-text="line.text">
                    <span class="typed-text"></span>
                    <span v-if="line.done" class="text-lime ml-2">✓</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Stack badges -->
            <div class="flex flex-wrap gap-3">
              <span
                v-for="tech in devStack"
                :key="tech"
                class="px-5 py-2.5 bg-text-primary/5 border border-text-primary/10 rounded-full font-mono text-sm text-text-primary/60 hover:border-lime/50 hover:text-lime hover:scale-105 transition-all duration-300 cursor-default"
                data-cursor-hover
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <!-- CENTER DIVIDER (Desktop Only) -->
        <div
          ref="centerDivider"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center"
        >
          <div ref="dividerLine" class="w-px bg-lime/40 h-0 transition-all"></div>
          <div class="my-6">
            <div class="w-12 h-12 rounded-full border border-lime flex items-center justify-center bg-[var(--bg-primary)]">
               <span class="text-lime text-xl">×</span>
            </div>
          </div>
          <div ref="dividerLine2" class="w-px bg-lime/40 h-0 transition-all"></div>
        </div>

        <!-- RIGHT: STUDIO MODE (FL Studio Style) -->
        <div
          ref="studioSide"
          class="relative p-8 md:p-16 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none overflow-hidden opacity-0 bg-[#1D1E22] border border-text-primary/10"
        >
          <!-- Background symbol -->
          <div class="absolute top-8 left-8 text-[15vw] lg:text-[10vw] leading-none font-display text-text-primary opacity-[0.03] select-none pointer-events-none">♪</div>

          <div class="relative z-10">
            <h3 class="font-mono text-sm text-text-primary tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-[#FF6B35]"></span>
              // Studio Mode
            </h3>

            <!-- FL Studio Inspired UI -->
            <div class="bg-[#25262B] rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-10">
               <!-- Transport Panel -->
               <div class="bg-[#313339] px-4 py-2 flex items-center gap-4 border-b border-black/40">
                  <div class="flex gap-1">
                    <div class="w-6 h-6 rounded bg-[#3B3D44] flex items-center justify-center hover:bg-lime/20 cursor-pointer transition-colors" @click="togglePlay">
                       <div :class="isPlaying ? 'w-2 h-2 bg-lime' : 'w-0 h-0 border-l-[6px] border-l-lime border-y-[4px] border-y-transparent ml-0.5'"></div>
                    </div>
                    <div class="w-6 h-6 rounded bg-[#3B3D44] flex items-center justify-center hover:bg-red-500/20 cursor-pointer">
                       <div class="w-2 h-2 bg-text-primary/40 rounded-full"></div>
                    </div>
                  </div>
                  <div class="bg-black/40 px-3 py-1 rounded font-mono text-[10px] text-lime flex gap-3">
                    <span>120.000</span>
                    <span class="opacity-40">4/4</span>
                  </div>
                  <div class="flex-1"></div>
                  <div class="font-mono text-[10px] text-text-primary/40 uppercase tracking-tighter">Pattern 1</div>
               </div>

               <!-- Piano Roll Visualization -->
               <div ref="pianoRollContainer" class="relative h-44 overflow-hidden bg-[#18191E]">
                  <div class="piano-roll-grid absolute inset-0">
                    <div
                      v-for="(note, i) in pianoNotes"
                      :key="i"
                      class="piano-note absolute rounded-sm shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]"
                      :style="{
                        left: note.left + '%',
                        top: note.top + '%',
                        width: note.width + '%',
                        height: note.height + '%',
                        background: 'var(--accent)',
                        opacity: note.opacity,
                        animationDelay: note.delay + 's',
                        animationDuration: (isPlaying ? 2 : 4) + 's'
                      }"
                    ></div>
                  </div>
                  <!-- Playhead -->
                  <div class="absolute top-0 bottom-0 w-px bg-white/20 left-1/4"></div>
               </div>
            </div>

            <!-- Music labels -->
            <div class="flex flex-wrap gap-3">
              <span
                v-for="skill in musicStack"
                :key="skill"
                class="px-5 py-2.5 bg-text-primary/5 border border-text-primary/10 rounded-full font-mono text-sm text-text-primary/60 hover:border-[#FF6B35]/50 hover:text-[#FF6B35] hover:scale-105 transition-all duration-300 cursor-default"
                data-cursor-hover
              >
                {{ skill }}
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
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const devSide = ref(null)
const studioSide = ref(null)
const dividerLine = ref(null)
const dividerLine2 = ref(null)
const terminalRefs = ref([])
const isPlaying = ref(false)

const terminalLines = ref([
  { text: 'npm run dev --portfolio', done: false },
  { text: 'building optimized digital rhythms...', done: false },
  { text: 'deployment successful. live at aldimf.dev', done: false },
])

const devStack = ['Nuxt 3', 'Laravel', 'Tailwind', 'PostgreSQL', 'Three.js']
const musicStack = ['FL Studio 21', 'Mixing', 'Sound Design', 'Mastering']

// Generate piano roll notes
const pianoNotes = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 7) % 120,
  top: [10, 25, 40, 55, 70, 85][Math.floor(Math.random() * 6)],
  width: Math.random() * 10 + 5,
  height: 10,
  opacity: Math.random() * 0.4 + 0.3,
  delay: Math.random() * 3,
}))

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

// Typewriter effect
const typewriterEffect = async () => {
  for (let i = 0; i < terminalLines.value.length; i++) {
    const line = terminalLines.value[i]
    const el = terminalRefs.value[i]
    if (!el) continue

    const typedEl = el.querySelector('.typed-text')
    if (!typedEl) continue

    const text = line.text
    for (let j = 0; j <= text.length; j++) {
      typedEl.textContent = text.slice(0, j)
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 20))
    }
    line.done = true
    await new Promise((r) => setTimeout(r, 400))
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  // Entrance animations
  ScrollTrigger.create({
    trigger: '#dual-identity',
    start: 'top 85%',
    onEnter: () => {
      gsap.to(devSide.value, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from(devSide.value, {
        x: -40,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.to(studioSide.value, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      })
      gsap.from(studioSide.value, {
        x: 40,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
      })

      // Divider grows
      gsap.to(dividerLine.value, {
        height: 150,
        duration: 1.2,
        delay: 0.4,
        ease: 'power2.out',
      })
      gsap.to(dividerLine2.value, {
        height: 150,
        duration: 1.2,
        delay: 0.4,
        ease: 'power2.out',
      })

      // Start typewriter after reveal
      setTimeout(typewriterEffect, 800)
    },
    once: true,
  })
})
</script>

<style scoped>
.piano-note {
  animation: noteSlide 4s linear infinite;
}

@keyframes noteSlide {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-500%); }
}

.piano-roll-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 10% 16.66%;
}

.terminal-line {
  min-height: 1.5em;
  display: block;
}
</style>
