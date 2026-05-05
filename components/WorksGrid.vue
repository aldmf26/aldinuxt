<template>
  <section id="works" class="relative py-24 md:py-40 px-6 md:px-16 overflow-hidden">
    <!-- Background "WORKS" text -->
    <div
      ref="bgText"
      class="absolute top-20 left-1/2 -translate-x-1/2 font-display italic text-works text-text-primary opacity-[0.02] select-none pointer-events-none z-0 whitespace-nowrap"
    >
      WORKS
    </div>

    <div class="max-w-[1600px] mx-auto relative z-10">
      <!-- Section header -->
      <div ref="sectionHeader" class="mb-24 opacity-0">
        <span class="font-mono text-xs text-lime tracking-[0.3em] uppercase block mb-6">Selected Projects</span>
        <h2 class="font-display italic text-section text-text-primary leading-none">Works</h2>
      </div>

      <!-- Projects Grid - Simplified 2-column grid for cleaner text-only cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <ProjectCard 
          v-for="(project, index) in projects" 
          :key="project.slug || index" 
          :project="project" 
          :index="index" 
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { projects } from '~/data/project'

const bgText = ref(null)
const sectionHeader = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Header animation
  gsap.to(sectionHeader.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionHeader.value,
      start: 'top 80%',
    },
  })
  gsap.from(sectionHeader.value, {
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionHeader.value,
      start: 'top 80%',
    },
  })

  // Background text parallax
  gsap.to(bgText.value, {
    yPercent: -20,
    scrollTrigger: {
      trigger: '#works',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    },
  })
})
</script>

<style scoped>
.text-works {
  font-size: clamp(120px, 15vw, 220px);
}

.text-section {
  font-size: clamp(60px, 8vw, 140px);
}
</style>
