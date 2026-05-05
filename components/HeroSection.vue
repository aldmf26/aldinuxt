<template>
  <section id="hero" class="relative min-h-screen overflow-hidden">
    <!-- Three.js Canvas Background -->
    <div
      ref="threeContainer"
      class="absolute inset-0 z-0"
    ></div>

    <!-- CSS fallback gradient for mobile -->
    <div class="absolute inset-0 z-0 md:hidden bg-gradient-radial"></div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-[1600px] mx-auto w-full">
        <!-- Left Column: Display Text -->
        <div class="space-y-2 md:space-y-4">
          <div ref="heroWords" class="overflow-hidden">
            <h1 class="hero-headline font-display leading-[0.9] tracking-tight">
              <span ref="word1" class="block text-primary font-light opacity-0 translate-y-[40px]">Crafting</span>
              <span ref="word2" class="block text-lime font-bold opacity-0 translate-y-[40px]">Digital</span>
              <span ref="word3" class="block text-primary font-light opacity-0 translate-y-[40px]">Code &</span>
              <span ref="word4" class="block text-primary font-bold opacity-0 translate-y-[40px]">Sonic</span>
              <span ref="word5" class="block text-primary font-display italic opacity-0 translate-y-[40px]">Rhythms</span>
            </h1>
          </div>
        </div>

        <!-- Right Column: Bio + CTAs -->
        <div class="lg:pl-8 space-y-8">
          <div ref="bioText" class="space-y-6">
            <p
              ref="bioLine1"
              class="text-lg md:text-xl text-primary/90 font-body leading-relaxed opacity-0 translate-y-[30px]"
            >
              I'm <span class="text-lime font-semibold">Aldi Fahrizaldi</span> — a web developer 
              who composes code like music, and a music producer who structures beats like software.
            </p>
            <p
              ref="bioLine2"
              class="text-base md:text-lg text-primary/70 font-body leading-relaxed opacity-0 translate-y-[30px]"
            >
              Building digital experiences with Nuxt, Laravel, and Tailwind by day. 
              Crafting beats, soundscapes, and rhythms in FL Studio by night.
            </p>
          </div>

          <!-- CTAs -->
          <div ref="ctaRef" class="flex flex-wrap gap-4 opacity-0 translate-y-[30px]">
            <a
              href="#works"
              class="group inline-flex items-center gap-3 px-8 py-4 bg-lime text-dark font-body font-semibold text-sm tracking-wide rounded-full hover:bg-lime/90 transition-all duration-300"
              data-cursor-hover
            >
              View Projects
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#music"
              class="group inline-flex items-center gap-3 px-8 py-4 border border-lime/30 text-lime font-body font-semibold text-sm tracking-wide rounded-full hover:bg-lime/10 transition-all duration-300"
              data-cursor-hover
            >
              Listen to Beats
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </a>
          </div>

          <!-- Location -->
          <div ref="locationRef" class="opacity-0 translate-y-[20px]">
            <span class="font-mono text-sm text-text-primary/60 tracking-wider">
              📍 Banjarmasin, Indonesia
            </span>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div ref="scrollIndicator" class="relative md:absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 z-10 mt-12 md:mt-0">
        <span class="font-mono text-xs text-text-primary/60 tracking-[0.3em] uppercase">Scroll</span>
        <div class="w-px h-12 md:h-16 bg-text-primary/20 relative overflow-hidden">
          <div class="absolute top-0 w-full h-3 bg-lime animate-pulse-slow rounded-full scroll-dot"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const threeContainer = ref(null)
const word1 = ref(null)
const word2 = ref(null)
const word3 = ref(null)
const word4 = ref(null)
const word5 = ref(null)
const bioLine1 = ref(null)
const bioLine2 = ref(null)
const ctaRef = ref(null)
const locationRef = ref(null)
const scrollIndicator = ref(null)

// Three.js setup
if (process.client) {
  useThree({ container: threeContainer })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const tl = gsap.timeline({ delay: 2.8 }) // After preloader

  // Words stagger in
  const words = [word1.value, word2.value, word3.value, word4.value, word5.value]
  tl.to(words, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
  }, 0)

  // Bio lines
  tl.to(bioLine1.value, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: 'power3.out',
  }, 0.6)

  tl.to(bioLine2.value, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: 'power3.out',
  }, 0.8)

  // CTAs
  tl.to(ctaRef.value, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
  }, 1.0)

  // Location
  tl.to(locationRef.value, {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: 'power3.out',
  }, 1.1)

  // Scroll indicator
  tl.to(scrollIndicator.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, 1.3)

  // Parallax on scroll
  gsap.to(word1.value?.parentElement?.parentElement, {
    yPercent: -15,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  })
})
</script>

<style scoped>
.hero-headline {
  font-size: clamp(48px, 10vw, 140px);
}

.bg-gradient-radial {
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 70%);
}

.scroll-dot {
  animation: scrollDot 2s ease-in-out infinite;
}

@keyframes scrollDot {
  0% { top: 0; }
  50% { top: calc(100% - 12px); }
  100% { top: 0; }
}
</style>
