<template>
  <main v-if="project" class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
    <!-- Hero Block -->
    <section class="relative h-[90vh] w-full flex items-center px-6 md:px-16 lg:px-24 overflow-hidden">
      <!-- Background Ghost Number -->
      <div class="absolute -bottom-10 -left-10 z-0 opacity-[0.05] pointer-events-none select-none" style="font-size: clamp(200px, 40vw, 600px); line-height: 1; font-weight: 900; font-family: 'JetBrains Mono';">
        {{ String(projects.indexOf(project) + 1).padStart(2, '0') }}
      </div>

      <div class="max-w-[1600px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div class="lg:col-span-8">
           <span class="section-label block mb-8 animate-fade-up">Case Study</span>
           <h1 class="font-display italic leading-[0.85] tracking-tighter mb-8" style="font-size: clamp(64px, 12vw, 180px)">
              {{ project.name }}
           </h1>
        </div>
        <div class="lg:col-span-4 pb-6">
           <p class="font-body text-xl md:text-2xl text-text-primary/60 leading-relaxed animate-fade-up delay-100">
             {{ project.description }}
           </p>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2">
         <div class="w-px h-16 bg-lime/30 relative overflow-hidden">
            <div class="absolute top-0 w-full h-8 bg-lime animate-scroll-line"></div>
         </div>
      </div>
    </section>

    <!-- Meta Grid -->
    <section class="py-20 border-y border-text-primary/10 px-6 md:px-16 lg:px-24 bg-text-primary/[0.02]">
       <div class="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Role</span>
             <p class="font-mono text-sm uppercase tracking-widest">Fullstack Dev</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Year</span>
             <p class="font-mono text-sm uppercase tracking-widest">2024</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Stack</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.stack.join(', ') }}</p>
          </div>
          <div class="space-y-4">
             <span class="section-label text-text-primary/40">Status</span>
             <p class="font-mono text-sm uppercase tracking-widest">{{ project.private ? 'Internal' : 'Public' }}</p>
          </div>
       </div>
    </section>

    <!-- Content Area -->
    <section class="py-40 px-6 md:px-16 lg:px-24">
       <div class="max-w-[1200px] mx-auto space-y-40">
          <!-- Main Image -->
          <div class="aspect-video w-full bg-[var(--bg-surface)] rounded-3xl overflow-hidden border border-text-primary/10 group shadow-2xl">
             <img 
               v-if="project.image" 
               :src="project.image" 
               class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-105 hover:scale-100"
             />
             <div v-else class="w-full h-full flex items-center justify-center font-mono text-text-primary/20">
                Media Preview
             </div>
          </div>

          <!-- Editorial Layout -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-20">
             <div class="md:col-span-5">
                <h2 class="font-display italic text-5xl md:text-7xl text-text-primary leading-tight">
                   The Vision <br/> & Strategy
                </h2>
             </div>
             <div class="md:col-span-7 space-y-8 text-lg md:text-xl text-text-primary/70 font-body leading-relaxed">
                <p>
                  Every project is a composition of logic and aesthetics. For {{ project.name }}, we focused on creating a technical foundation that supports a high-fidelity user interface without compromising on performance.
                </p>
                <p>
                  The architecture leverages {{ project.stack[0] }} to ensure a seamless experience, while the visual design follows an editorial-first philosophy that prioritizes content and typography.
                </p>
             </div>
          </div>
       </div>
    </section>

    <!-- Next Project CTA -->
    <section v-if="nextProject" class="py-40 border-t border-text-primary/10 px-6 md:px-16 lg:px-24 overflow-hidden">
       <NuxtLink :to="`/projects/${nextProject.slug}`" class="group block max-w-[1600px] mx-auto text-center" data-cursor-hover>
          <span class="section-label block mb-8 group-hover:text-lime transition-colors">Next Project</span>
          <h2 class="font-display italic text-text-primary leading-none group-hover:text-lime transition-all duration-700" style="font-size: clamp(60px, 15vw, 240px)">
             {{ nextProject.name }}
          </h2>
       </NuxtLink>
    </section>
  </main>
</template>

<script setup>
import { projects } from '~/data/project'

const route = useRoute()

const project = computed(() => {
  if (!route.params.slug) return null
  return projects.find(p => p.slug === route.params.slug) ?? null
})

// Throw 404 if not found to prevent 500
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const nextProject = computed(() => {
  const index = projects.indexOf(project.value)
  return projects[(index + 1) % projects.length]
})

useHead({
  title: `${project.value?.name} — Case Study`,
})
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scroll-line {
  animation: scrollLine 2s infinite;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scrollLine {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.delay-100 { animation-delay: 0.1s; }
</style>
