<template>
  <section id="about" class="relative py-32 md:py-56 overflow-hidden">
    <!-- Ghost Background Word -->
    <div class="absolute bottom-20 right-0 z-0 pointer-events-none select-none opacity-[0.04] text-text-muted font-black tracking-tighter leading-none" style="font-size: clamp(100px, 15vw, 220px);">
      STUDIO
    </div>

    <div class="max-w-[1400px] mx-auto px-6 md:px-16">
      <!-- Unifying Statement -->
      <div ref="quoteRef" class="text-center mb-20 max-w-3xl mx-auto">
        <span class="section-label block mb-6">ONE PRACTICE</span>
        <p class="font-display italic text-3xl md:text-5xl text-text-primary leading-tight" style="font-weight: 600;">
          Composing software. <br class="md:hidden"/>
          <span class="text-text-secondary">Composing sound.</span>
        </p>
        <p class="font-mono text-xs text-text-muted/60 uppercase tracking-[0.3em] mt-6">
           Five years in. Two studios. One caffeine source.
        </p>
      </div>

      <!-- Stats / Years -->
      <div ref="statsRef" class="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] max-w-5xl mx-auto border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
        <div class="bg-[var(--bg-surface)] p-12 md:p-20 flex flex-col items-center text-center group">
          <span class="section-label mb-8 group-hover:text-lime transition-colors">Web Dev since</span>
          <div class="relative">
             <span class="ghost-number absolute -top-8 -left-12 opacity-5">2020</span>
             <span ref="year1" class="font-display italic text-7xl md:text-9xl text-lime relative z-10">2020</span>
          </div>
          <p class="font-mono text-xs text-text-primary/40 uppercase tracking-[0.2em] mt-8">Engineering Digital Solutions</p>
        </div>
        
        <div class="bg-[var(--bg-surface)] p-12 md:p-20 flex flex-col items-center text-center group">
          <span class="section-label mb-8 group-hover:text-lime transition-colors">Music since</span>
          <div class="relative">
             <span class="ghost-number absolute -top-8 -left-12 opacity-5">2017</span>
             <span ref="year2" class="font-display italic text-7xl md:text-9xl text-lime relative z-10">2017</span>
          </div>
          <p class="font-mono text-xs text-text-primary/40 uppercase tracking-[0.2em] mt-8">Crafting Sonic Landscapes</p>
        </div>
      </div>
    </div>

    <!-- Moving Strip Text -->
    <div class="mt-32 border-y border-[var(--border)] py-10 overflow-hidden whitespace-nowrap flex">
       <div class="flex animate-marquee-fast">
          <span v-for="n in 10" :key="n" class="inline-block font-mono text-xs uppercase tracking-[0.3em] text-text-primary/30 mx-12">
            OPEN TO FREELANCE · REMOTE FRIENDLY · BASED IN BANJARMASIN · FAST DELIVERY · LET'S TALK ·
          </span>
       </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const statsRef = ref(null)
const quoteRef = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Reveal quote section
  gsap.fromTo(
    quoteRef.value,
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: quoteRef.value,
        start: 'top 90%',
        once: true,
      },
    }
  )

  // Reveal stats block
  gsap.fromTo(
    statsRef.value,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: statsRef.value,
        start: 'top 85%',
        once: true,
      },
    }
  )
})
</script>

<style scoped>
.animate-marquee-fast {
  animation: marquee-fast 30s linear infinite;
}

@keyframes marquee-fast {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
