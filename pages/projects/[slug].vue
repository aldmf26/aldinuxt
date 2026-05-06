<template>
  <main v-if="project" class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
    
    <!-- Hero Block -->
    <section class="relative h-[90vh] w-full flex items-center px-6 md:px-16 lg:px-24 overflow-hidden">
      <!-- Background Ghost Number -->
      <div class="absolute -bottom-10 -left-10 z-0 opacity-[0.05] pointer-events-none select-none" style="font-size: clamp(200px, 40vw, 600px); line-height: 1; font-weight: 900; font-family: 'JetBrains Mono'; color: var(--accent);">
        {{ project.number || '01' }}
      </div>

      <div class="max-w-[1600px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div class="lg:col-span-8">
           <span class="section-label block mb-8 animate-fade-up">Case Study</span>
           <h1 class="font-display italic leading-[0.85] tracking-tighter mb-8" style="font-size: clamp(64px, 12vw, 180px)">
              {{ project.title }}
           </h1>
        </div>
        <div class="lg:col-span-4 pb-6">
           <p class="font-body text-xl md:text-2xl text-text-primary/60 leading-relaxed animate-fade-up delay-100">
             {{ project.subtitle }}
           </p>
        </div>
      </div>
    </section>

    <!-- Meta Grid -->
    <section class="py-20 border-y border-text-primary/10 px-6 md:px-16 lg:px-24 bg-text-primary/[0.02]">
       <div class="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Role</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.role || 'Fullstack Dev' }}</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Year</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.year || '2024' }}</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Stack</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.techs.join(', ') }}</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Impact</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.impact || 'Delivered' }}</p>
          </div>
       </div>
    </section>

    <!-- Content Area -->
    <section class="py-40 px-6 md:px-16 lg:px-24">
       <div class="max-w-[1200px] mx-auto space-y-40">
          
          <!-- Challenge & Solution -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div class="space-y-8 p-12 rounded-[2rem] bg-red-500/5 border border-red-500/10">
              <span class="font-mono text-xs text-red-500 uppercase tracking-widest">Challenge</span>
              <h3 class="text-3xl font-display italic text-text-primary">The Problem</h3>
              <p class="text-lg text-text-primary/70 leading-relaxed">{{ project.problem }}</p>
            </div>
            <div class="space-y-8 p-12 rounded-[2rem] bg-lime/5 border border-lime/10">
              <span class="font-mono text-xs text-lime uppercase tracking-widest">Solution</span>
              <h3 class="text-3xl font-display italic text-text-primary">The Outcome</h3>
              <p class="text-lg text-text-primary/70 leading-relaxed">{{ project.solution }}</p>
            </div>
          </div>

          <!-- Showcase Screenshots -->
          <div v-for="(img, i) in project.screenshots" :key="i" class="space-y-12">
            <div class="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-[var(--bg-surface)]">
              <img :src="img.image" :alt="img.title" class="w-full h-auto" />
            </div>
            <div class="max-w-2xl">
              <h4 class="text-2xl font-bold text-text-primary mb-4">{{ img.title }}</h4>
              <p class="text-lg text-text-muted leading-relaxed">{{ img.description }}</p>
            </div>
          </div>

          <!-- Recommended Section -->
          <section class="mt-40 pt-20 border-t border-white/5">
            <p class="section-label mb-12">More Projects</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NuxtLink
                v-for="proj in recommendedProjects"
                :key="proj.slug"
                :to="`/projects/${proj.slug}`"
                class="group block no-underline"
              >
                <div class="bg-[var(--bg-surface)] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[var(--accent)]">
                  <!-- Mini Visual -->
                  <div class="h-32 flex items-center justify-center relative overflow-hidden border-b border-white/5"
                       :style="{ background: `linear-gradient(135deg, var(--bg-surface), ${proj.color}20)` }">
                    <span class="absolute right-2 -bottom-2 font-mono font-black text-6xl text-text-primary opacity-[0.05]">
                      {{ proj.number }}
                    </span>
                    <div :style="{ width: '100%', height: '2px', background: proj.color, position: 'absolute', top: 0 }" />
                    <span class="relative z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
                      {{ proj.type }}
                    </span>
                  </div>

                  <!-- Info -->
                  <div class="p-6">
                    <p class="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-2">{{ proj.number }}</p>
                    <h4 class="text-xl font-bold text-text-primary mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {{ proj.name }}
                    </h4>
                    <p class="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {{ proj.shortDesc }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </section>

        </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { projects } from '~/data/project'
import { projectsData } from '~/data/project-detail'

// Disable SSR for this page to avoid hydration mismatches with GSAP/Animations
definePageMeta({
  ssr: false
})

const route = useRoute()

const project = computed(() => {
  const slug = route.params.slug as string
  if (!slug) return null
  
  // Find match in projectsData
  const detail = projectsData[slug as keyof typeof projectsData]
  if (detail) {
    // Merge with basic info from projects array (like number, color)
    const basic = projects.find(p => p.slug === slug)
    return { ...basic, ...detail }
  }
  return null
})

// Server & Client 404 handling
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project Not Found', fatal: true })
}

const recommendedProjects = computed(() => {
  if (!project.value) return []
  return projects
    .filter(p => p.slug !== route.params.slug)
    .filter(p => !p.private)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
})

useHead({
  title: project.value ? `${project.value.title} — Case Study` : 'Project Not Found',
})
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.delay-100 { animation-delay: 0.1s; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
