<template>
  <section id="hero" class="relative min-h-screen overflow-hidden flex flex-col justify-center">
    <!-- Cinematic Entrance Line -->
    <div class="hero-line"></div>

    <!-- Three.js Canvas Background -->
    <div
      ref="threeContainer"
      class="absolute inset-0 z-0"
    ></div>

    <!-- Content -->
    <div class="relative z-10 px-6 md:px-16 lg:px-24 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center max-w-[1700px] mx-auto w-full">
        <!-- Left Column: Display Text -->
        <div class="overflow-hidden">
          <h1 class="hero-headline font-display leading-[0.85] tracking-tighter">
            <span class="hero-word block text-text-primary font-light">Crafting</span>
            <span class="hero-word block text-lime font-bold">Digital</span>
            <span class="hero-word block text-text-primary font-light">Code &</span>
            <span class="hero-word block text-text-primary font-bold">Sonic</span>
            <span class="hero-word block text-text-primary font-display italic">Rhythms</span>
          </h1>
        </div>

        <!-- Right Column: Bio + CTAs -->
        <div class="hero-right lg:pl-12 space-y-10">
          <div class="space-y-6">
            <p class="text-xl md:text-2xl text-text-primary font-body leading-relaxed">
              I'm <span class="text-lime font-semibold">Aldi Fahrizaldi</span> — a web developer 
              who composes code like music, and a music producer who structures beats like software.
            </p>
            <p class="text-base md:text-lg text-text-primary/60 font-body leading-relaxed max-w-lg">
              Building digital experiences with Nuxt, Laravel, and Tailwind by day. 
              Crafting beats and rhythms in FL Studio by night.
            </p>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-5">
            <a
              href="#works"
              class="group inline-flex items-center gap-4 px-10 py-5 bg-lime text-dark font-mono text-xs uppercase tracking-[0.2em] rounded-full hover:bg-lime/90 transition-all duration-300"
              data-cursor-hover
            >
              View Projects
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#music"
              class="group inline-flex items-center gap-4 px-10 py-5 border border-lime/30 text-lime font-mono text-xs uppercase tracking-[0.2em] rounded-full hover:bg-lime/10 transition-all duration-300"
              data-cursor-hover
            >
              Listen to Beats
            </a>
          </div>

          <!-- Location -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-px bg-lime/30"></div>
            <span class="font-mono text-xs text-text-primary/40 tracking-[0.3em] uppercase">
              📍 Banjarmasin, ID
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div ref="scrollIndicator" class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 z-10">
      <span class="font-mono text-[10px] text-text-primary/40 tracking-[0.4em] uppercase">Scroll</span>
      <div class="w-px h-20 bg-text-primary/10 relative overflow-hidden">
        <div class="absolute top-0 w-full h-8 bg-lime rounded-full scroll-dot"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const threeContainer = ref(null)
const scrollIndicator = ref(null)

// Three.js setup
if (process.client) {
  useThree({ container: threeContainer })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const tl = gsap.timeline({ delay: 0.5 })

  // Step 1: A single horizontal line draws across
  tl.fromTo('.hero-line', 
    { scaleX: 0, transformOrigin: 'left center', opacity: 1 },
    { scaleX: 1, duration: 0.8, ease: 'power4.inOut' }
  )

  // Step 2: Words crash in
  tl.fromTo('.hero-word',
    { clipPath: 'inset(0 0 100% 0)', y: 60 },
    { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, stagger: 0.1, ease: 'expo.out' },
    '-=0.4'
  )

  // Step 3: Right column content
  tl.fromTo('.hero-right > *',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
    '-=0.6'
  )

  // Step 4: Line fades
  tl.to('.hero-line', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.2')

  // Scroll indicator
  tl.to(scrollIndicator.value, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  }, '+=0.2')
})
</script>

<style scoped>
.hero-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--accent);
  z-index: 20;
  pointer-events: none;
  opacity: 0;
}

.hero-headline {
  font-size: clamp(72px, 11vw, 160px);
}

.scroll-dot {
  animation: scrollDot 2.5s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

@keyframes scrollDot {
  0% { transform: translateY(-100%); }
  50% { transform: translateY(150%); }
  100% { transform: translateY(-100%); }
}
</style>
