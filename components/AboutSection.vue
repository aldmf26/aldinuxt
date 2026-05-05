<template>
  <section id="about" class="relative py-16 md:py-24 px-6 md:px-16 overflow-x-hidden">
    <div class="max-w-[1600px] mx-auto">
      <!-- Pull Quote -->
      <div ref="quoteRef" class="max-w-3xl mx-auto text-center mb-24 opacity-0">
        <blockquote class="font-display italic text-2xl md:text-4xl lg:text-5xl text-primary leading-snug">
          "I don't just build websites. I compose digital experiences
          where every interaction has rhythm, every animation has purpose."
        </blockquote>
      </div>

      <!-- Stats -->
      <div ref="statsRef" class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto mb-24 opacity-0">
        <div class="text-center p-8 border border-primary/10 rounded-2xl">
          <span class="font-mono text-sm text-lime/80 tracking-[0.3em] uppercase block mb-3">Year Started</span>
          <span class="font-display italic text-5xl md:text-6xl text-lime">2019</span>
          <span class="font-body text-base text-secondary block mt-3">Web Development</span>
        </div>
        <div class="text-center p-8 border border-primary/10 rounded-2xl">
          <span class="font-mono text-sm text-lime/80 tracking-[0.3em] uppercase block mb-3">Year Started</span>
          <span class="font-display italic text-5xl md:text-6xl text-lime">2021</span>
          <span class="font-body text-base text-secondary block mt-3">Music Production</span>
        </div>
      </div>

      <!-- Horizontal scroll strip -->
      <div class="py-12 md:py-24 border-y border-primary/10 overflow-hidden">
        <div class="flex animate-marquee-left whitespace-nowrap">
          <span v-for="n in 6" :key="n" class="inline-flex items-center flex-shrink-0">
            <span class="font-mono text-base text-secondary tracking-[0.2em] uppercase mx-12">Based in Banjarmasin</span>
            <span class="text-lime mx-4">·</span>
            <span class="font-mono text-base text-secondary tracking-[0.2em] uppercase mx-12">Open to Remote</span>
            <span class="text-lime mx-4">·</span>
            <span class="font-mono text-base text-secondary tracking-[0.2em] uppercase mx-12">Available for Projects</span>
            <span class="text-lime mx-4">·</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const quoteRef = ref(null)
const statsRef = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Quote animation
  gsap.to(quoteRef.value, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: quoteRef.value, start: 'top 90%' },
  })
  gsap.from(quoteRef.value, {
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: quoteRef.value, start: 'top 90%' },
  })

  // Stats
  gsap.to(statsRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: statsRef.value, start: 'top 90%' },
  })
  gsap.from(statsRef.value, {
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: statsRef.value, start: 'top 90%' },
  })
})
</script>
