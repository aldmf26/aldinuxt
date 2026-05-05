<template>
  <section id="about" class="relative py-32 md:py-56 px-6 md:px-16 overflow-hidden">
    <!-- Ghost Background Word -->
    <div class="absolute bottom-20 right-0 z-0 pointer-events-none select-none opacity-[0.04] text-text-muted font-black tracking-tighter leading-none" style="font-size: clamp(100px, 15vw, 220px);">
      STUDIO
    </div>

    <div class="max-w-[1400px] mx-auto">
      <!-- Pull Quote -->
      <div ref="quoteRef" class="max-w-4xl mx-auto text-center mb-32 opacity-0">
        <span class="section-label block mb-12">Vision</span>
        <blockquote class="font-display italic text-3xl md:text-5xl lg:text-7xl text-text-primary leading-[1.1] tracking-tight">
          "I don't just build websites. I compose digital experiences
          where every interaction has rhythm, every animation has purpose."
        </blockquote>
      </div>

      <!-- Stats / Years -->
      <div ref="statsRef" class="grid grid-cols-1 md:grid-cols-2 gap-px bg-text-primary/10 max-w-5xl mx-auto opacity-0 border border-text-primary/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="bg-[var(--bg-surface)] p-12 md:p-20 flex flex-col items-center text-center group">
          <span class="section-label mb-8 group-hover:text-lime transition-colors">Web Development</span>
          <div class="relative">
             <span class="ghost-number absolute -top-8 -left-12 opacity-5">2019</span>
             <span ref="year1" class="font-display italic text-7xl md:text-9xl text-lime relative z-10">2019</span>
          </div>
          <p class="font-mono text-xs text-text-primary/40 uppercase tracking-[0.2em] mt-8">Engineering Digital Solutions</p>
        </div>
        
        <div class="bg-[var(--bg-surface)] p-12 md:p-20 flex flex-col items-center text-center group">
          <span class="section-label mb-8 group-hover:text-lime transition-colors">Music Production</span>
          <div class="relative">
             <span class="ghost-number absolute -top-8 -left-12 opacity-5">2021</span>
             <span ref="year2" class="font-display italic text-7xl md:text-9xl text-lime relative z-10">2021</span>
          </div>
          <p class="font-mono text-xs text-text-primary/40 uppercase tracking-[0.2em] mt-8">Crafting Sonic Landscapes</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const quoteRef = ref(null)
const statsRef = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Quote reveal
  gsap.to(quoteRef.value, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: { trigger: quoteRef.value, start: 'top 85%' },
  })

  // Stats
  gsap.to(statsRef.value, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: statsRef.value, start: 'top 85%' },
  })
})
</script>
