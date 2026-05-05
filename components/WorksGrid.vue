<template>
  <section id="works" class="relative py-32 md:py-48 px-4 md:px-10 overflow-hidden">
    <!-- Giant Ghost Word -->
    <div class="absolute top-12 md:top-0 -left-4 z-0 pointer-events-none select-none opacity-[0.08] text-text-muted font-black tracking-tighter leading-none" style="font-size: clamp(120px, 18vw, 260px); letter-spacing: -0.04em;">
      WORKS
    </div>

    <div class="max-w-[1800px] mx-auto relative z-10">
      <!-- Section header -->
      <div ref="header" class="mb-24 px-4">
        <span class="section-label block mb-6">Selected Works</span>
        <h2 class="font-display italic text-text-primary leading-none" style="font-size: clamp(64px, 8vw, 120px)">
          Portfolio
        </h2>
      </div>

      <!-- Asymmetric Grid -->
      <div class="works-grid">
        <ProjectCard 
          v-for="(project, index) in projects" 
          :key="project.slug || index" 
          :project="project" 
          :index="index"
          class="project-card-item"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { projects } from '~/data/project'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const header = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return
  
  gsap.from(header.value, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: header.value,
      start: 'top 90%',
    }
  })
})
</script>

<style scoped>
/* Mobile: single column */
.works-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  background: transparent;
}

/* Reset all nth-child spanning on mobile */
@media (max-width: 767px) {
  .project-card-item:nth-child(n) {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}

/* Desktop: asymmetric */
@media (min-width: 1024px) {
  .works-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 32px;
  }

  .project-card-item:nth-child(1) { grid-column: 1 / -1; }
  .project-card-item:nth-child(2) { grid-column: 1; grid-row: 2 / 4; }
  .project-card-item:nth-child(3) { grid-column: 2; }
  .project-card-item:nth-child(4) { grid-column: 2; }
  .project-card-item:nth-child(5) { grid-column: 1 / -1; }
}
</style>
