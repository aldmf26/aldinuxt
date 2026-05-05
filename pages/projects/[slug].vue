<template>
  <main class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden relative transition-colors duration-500">
    
    <!-- Hero Block -->
    <section class="relative h-screen w-full flex items-center px-6 md:px-16 lg:px-24">
      <div class="max-w-[1600px] mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Project Number -->
        <div class="hidden md:block md:col-span-3 lg:col-span-2 relative">
          <div ref="numberRef" class="font-mono font-bold leading-none select-none opacity-0 translate-y-10" 
               style="font-size: clamp(100px, 15vw, 200px); color: var(--text-muted); opacity: 0.15; margin-left: -20px;">
            01
          </div>
        </div>

        <!-- Center: Project Title and Description -->
        <div class="md:col-span-9 lg:col-span-10">
          <h1 class="hero-title font-display italic leading-[0.9] tracking-tight mb-6">
            <span ref="titleRef" class="block opacity-0 translate-y-10">
              {{ slugFormatted }}
            </span>
          </h1>
          
          <p ref="descRef" class="font-body text-lg md:text-2xl text-text-muted max-w-2xl opacity-0 translate-y-10">
            A comprehensive digital experience crafting the perfect blend of form and function.
          </p>
        </div>
      </div>

      <!-- Bottom Meta Area -->
      <div class="absolute bottom-12 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 flex justify-between items-end border-t border-text-muted/20 pt-8">
        <div ref="metaLeftRef" class="opacity-0">
          <NuxtLink to="/#works" class="group inline-flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-text-muted hover:text-lime transition-colors" data-cursor-hover>
            <svg class="w-4 h-4 rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Back to Works
          </NuxtLink>
        </div>
        
        <div ref="metaRightRef" class="opacity-0 flex gap-12 text-sm font-mono tracking-widest uppercase text-text-muted">
          <div>
            <span class="block text-text-muted opacity-60 text-[10px] mb-2">Role</span>
            <span class="text-text-primary">Development</span>
          </div>
          <div>
            <span class="block text-text-muted opacity-60 text-[10px] mb-2">Year</span>
            <span class="text-text-primary">2024</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Block (Placeholder for editorial content) -->
    <section class="py-32 px-6 md:px-16 lg:px-24 max-w-[1200px] mx-auto">
      <div class="aspect-video w-full bg-[var(--bg-surface)] rounded-2xl mb-24 border border-text-muted/20 relative overflow-hidden group">
        <div class="absolute inset-0 bg-lime opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="font-mono text-text-muted opacity-50 tracking-widest text-sm">Project Media</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-16">
        <div class="md:col-span-4">
          <h2 class="font-display italic text-4xl text-text-primary mb-6">The Challenge</h2>
        </div>
        <div class="md:col-span-8 text-text-muted leading-relaxed font-body text-lg space-y-6">
          <p>
            Building a seamless digital experience requires a deep understanding of both aesthetics and performance. 
            For this project, the goal was to create an interactive journey that captivates users from the first scroll.
          </p>
          <p>
            We utilized modern web technologies, pushing the boundaries of what's possible in the browser while maintaining 
            strict performance budgets and accessibility standards.
          </p>
        </div>
      </div>
    </section>

    <!-- Recommended Projects -->
    <section v-if="recommendedProjects.length > 0" class="py-24 px-6 md:px-16 lg:px-24 border-t border-text-muted/20">
      <div class="max-w-[1600px] mx-auto">
        <h3 class="font-display italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-12">More Projects</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="proj in recommendedProjects" 
            :key="proj.detail"
            :to="`/projects/${proj.detail}`"
            class="block cursor-pointer group"
          >
            <div class="rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02]" style="background: var(--bg-surface); border: 1px solid var(--text-muted); opacity: 0.8">
              <img 
                v-if="proj.logoUrl" 
                :src="proj.logoUrl" 
                :alt="proj.judul"
                style="width:100%; aspect-ratio:16/9; object-fit:cover;"
              />
              <div class="p-6">
                <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 8px;">{{ String(proj.id).padStart(2, '0') }}</p>
                <h4 style="color: var(--text-primary); font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">{{ proj.judul }}</h4>
                <p style="color: var(--text-muted); font-size: 13px; line-height: 1.5;">{{ proj.deskripsi.substring(0, 80) }}...</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { gsap } from 'gsap'
import { projects } from '~/data/project'

const route = useRoute()
const currentSlug = computed(() => route.params.slug)

const currentProject = computed(() => 
  projects.find(p => p.detail === currentSlug.value)
)

// Recommended: exclude current project AND exclude private projects
const recommendedProjects = computed(() => {
  return projects
    .filter(p => p.detail !== currentSlug.value)
    .filter(p => !p.isPrivate)
    .slice(0, 3)
})

// Simple title formatting for demo
const slugFormatted = computed(() => {
  if (!currentSlug.value) return 'Project Name'
  return String(currentSlug.value).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

useHead({
  title: `${slugFormatted.value} — Aldi Fahrizaldi`,
})

const numberRef = ref(null)
const titleRef = ref(null)
const descRef = ref(null)
const metaLeftRef = ref(null)
const metaRightRef = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return
  
  // Give page transition time to finish
  setTimeout(() => {
    const tl = gsap.timeline()
    
    tl.to(numberRef.value, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out'
    }, 0.2)
    
    tl.to(titleRef.value, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out'
    }, 0.3)
    
    tl.to(descRef.value, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power4.out'
    }, 0.5)
    
    tl.to([metaLeftRef.value, metaRightRef.value], {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0.8)
    
  }, 500) // Match the 0.5s CSS clip-path transition
})
</script>

<style scoped>
.hero-title {
  font-size: clamp(60px, 10vw, 160px);
}
</style>
