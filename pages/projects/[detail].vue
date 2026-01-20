<template>
    <div v-motion-fade class="min-h-screen bg-bg transition-colors duration-500 pt-32 pb-24 selection:bg-warna1 selection:text-bg">
        <div class="max-w-4xl mx-auto px-6">
            <!-- Back Button -->
            <button @click="goBack" aria-label="Go back"
                class="inline-flex items-center gap-2 text-secondary hover:text-warna1 transition-all mb-16 group">
                <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-warna1 group-hover:text-bg transition-colors">
                  <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span class="text-sm font-black uppercase tracking-widest">Back</span>
            </button>

            <!-- Project Identity Header -->
            <div class="mb-20 text-center">
                <div class="mb-12 flex justify-center gap-8 items-center flex-wrap">
                    <template v-if="project.title === 'AgaFood'">
                        <img src="/projects/tkmr.png" class="h-20 w-auto object-contain drop-shadow-xl" alt="Takemori Logo" />
                        <div class="w-px h-12 bg-primary/10"></div>
                        <img src="/projects/sdb.png" class="h-20 w-auto object-contain drop-shadow-xl" alt="Soondobu Logo" />
                    </template>
                    <img v-else :src="project.logoUrl" class="h-24 w-auto object-contain drop-shadow-2xl" alt="Project Logo" />
                </div>

                <h1 class="text-5xl md:text-8xl font-black text-primary acorn tracking-tighter mb-8 italic">
                    {{ project.title }}
                </h1>
                
                <p class="text-2xl md:text-3xl text-secondary font-medium leading-relaxed max-w-3xl mx-auto mb-12">
                    {{ project.subtitle }}
                </p>

                <div class="flex flex-wrap gap-2 justify-center mb-16">
                    <span v-for="tech in project.techs" :key="tech"
                        class="px-5 py-2.5 bg-primary/[0.05] text-primary/70 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {{ tech }}
                    </span>
                </div>

                <!-- Action Link -->
                <a v-if="project.link && project.link.trim() !== ''" :href="project.link" target="_blank"
                    class="inline-flex items-center gap-4 px-10 py-5 bg-warna1 text-bg rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 shadow-2xl shadow-warna1/20 group font-black uppercase tracking-widest">
                    <span>Visit Live Project</span>
                    <svg class="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
                <p v-else class="text-secondary font-black uppercase tracking-[0.3em] opacity-40">
                  Private Project
                </p>
            </div>

            <!-- Showcase Section -->
            <section class="space-y-32 mb-32">
              <div 
                v-for="(screenshot, index) in project.screenshots" 
                :key="index" 
                v-motion
                :initial="{ opacity: 0, y: 50 }"
                :visible="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
                class="space-y-12"
              >
                <div 
                  class="relative -mx-2 md:-mx-12 lg:-mx-24 rounded-[3rem] overflow-hidden bg-primary/[0.02] border border-primary/5 shadow-2xl cursor-pointer group"
                  @click="openLightbox(screenshot)"
                >
                  <img 
                    :src="screenshot.image" 
                    :alt="screenshot.title" 
                    class="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div class="absolute inset-0 bg-primary/0 group-hover:bg-warna1/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="w-20 h-20 bg-bg/90 rounded-full flex items-center justify-center text-warna1 shadow-2xl">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
                    </div>
                  </div>
                </div>
                
                <div class="text-center max-w-2xl mx-auto space-y-4">
                  <h3 class="text-3xl font-black text-primary acorn tracking-tighter italic">
                    {{ screenshot.title }}
                  </h3>
                  <p class="text-lg text-secondary font-medium leading-relaxed">
                    {{ screenshot.description }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Lightbox -->
            <Teleport to="body">
              <div v-if="lightboxOpen" 
                   class="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-20"
                   @click="closeLightbox">
                <button class="absolute top-10 right-10 text-bg/60 hover:text-bg transition-colors" @click="closeLightbox">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <img :src="currentImage" class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain shadow-black/50" />
              </div>
            </Teleport>

            <!-- Recommended Footer -->
            <div class="pt-32 border-t border-primary/5">
                <h3 class="text-3xl font-black text-primary acorn tracking-tighter mb-12 italic">Recommended Projects</h3>
                <div v-motion
                    :initial="{ opacity: 0, y: 60 }"
                    :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }" class="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <ProjectCard
                      v-for="(p, i) in recommendedProjects"
                      :key="p.judul"
                      :project="p"
                      :index="i"
                    />
                </div>

                <NuxtLink to="/" class="flex flex-col items-center group gap-4">
                  <div class="w-16 h-16 bg-primary/[0.03] border border-primary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-warna1 group-hover:text-bg transition-all duration-300">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a2 2 0 01-2 2h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  </div>
                  <span class="text-sm font-black uppercase tracking-[0.3em] text-secondary group-hover:text-primary transition-colors">Back to Selection</span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { projects } from '~/data/project'
import { projectsData } from '~/data/project-detail'

const route = useRoute()
const router = useRouter()
const projectDetail = route.params.detail as string

const lightboxOpen = ref(false)
const currentImage = ref('')

const openLightbox = (screenshot: any) => {
  currentImage.value = screenshot.image
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const goBack = () => router.push('/')

const project = computed(() => projectsData[projectDetail as keyof typeof projectsData] || projectsData.teory)

const recommendedProjects = computed(() => {
  return projects
    .filter(p => p.detail !== projectDetail)
    .slice(0, 2)
})

useHead({ title: `${project.value.title} - Project Detail` })

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox()
  })
})
</script>

<style scoped>
.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>
