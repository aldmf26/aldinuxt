<template>
    <div v-motion-fade class="min-h-screen py-8 md:py-16">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Back Button -->
            <button @click="goBack" aria-label="Go back"
                class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-12 group">
                <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-sm font-medium">Back</span>
            </button>

            <!-- Project Header - Centered -->
            <div class="mb-16 text-center">
                <div v-if="project.title === 'AgaFood'">
                    <img src="\public\projects\tkmr.png" class="inline" width="120" alt="Project Logo" />
                    <img src="\public\projects\sdb.png" class="inline" width="120" alt="Project Logo" />
                </div>
                <div v-else>
                    <img :src="project.logoUrl" class="inline" :width="project.width" alt="Project Logo" />
                </div>

                <h1 class="acorn500 text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    {{ project.title }}
                </h1>
                <p class="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto mb-12">
                    {{ project.subtitle }}

                <div class="flex flex-wrap gap-3 mt-2 justify-center">
                    <span v-for="tech in project.techs" :key="tech"
                        class="px-3 py-1 bg-slate-600 text-sm text-white rounded-lg">
                        {{ tech }}
                    </span>
                </div>
                </p>
                <!-- Visit Link -->
                <a v-if="project.link && project.link.trim() !== ''" :href="project.link" target="_blank"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all hover:scale-105 group text-lg font-medium">
                    <span>Visit Project</span>
                    <svg class="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>

                <p v-else class="text-center text-gray-600">
                    Private Project
                </p>
            </div>

            <!-- Overview - Centered -->
            <!-- <section class="mb-16">
                <h2 class="acorn500 text-3xl font-bold text-gray-900 text-center">
                    Overview
                </h2>

                <p class="text-gray-700 leading-relaxed text-xl text-center max-w-2xl mx-auto">
                    {{ project.description }}
                </p>
            </section> -->



            <!-- Project Screenshots with Descriptions -->
            <section class="space-y-20 mb-20">
  <div 
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :visible="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 150 } }" 
    v-for="(screenshot, index) in project.screenshots" 
    :key="index" 
    class="space-y-6"
  >
    <div 
      class="relative -mx-6 md:-mx-12 lg:-mx-20 overflow-hidden rounded-3xl shadow-2xl cursor-pointer group"
      @click="openLightbox(screenshot)"
    >
      <img 
        :src="screenshot.image" 
        :alt="screenshot.title" 
        class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 px-4 md:px-0" 
      />
      <!-- Overlay hover effect -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
        <UIcon 
          name="i-heroicons-magnifying-glass-plus" 
          class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
    <div class="text-center max-w-2xl mx-auto">
      <h3 class="acorn500 text-3xl font-bold text-gray-900 mb-3">
        {{ screenshot.title }}
      </h3>
      <p class="text-gray-600 leading-relaxed text-lg">
        {{ screenshot.description }}
      </p>
    </div>
  </div>
</section>

<!-- Lightbox Modal -->
<Teleport to="body">
  <div 
    v-if="lightboxOpen"
    v-motion
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1, transition: { duration: 300 } }"
    :leave="{ opacity: 0, transition: { duration: 300 } }"
    class="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
    @click="closeLightbox"
  >
    <!-- Close button -->
    <button
      class="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 hover:text-white transition-colors z-10"
      @click="closeLightbox"
    >
      <UIcon name="i-heroicons-x-mark" class="w-8 h-8 md:w-10 md:h-10" />
    </button>

    <!-- Image container -->
    <div 
      v-motion
      :initial="{ scale: 0.8, y: 50 }"
      :enter="{ scale: 1, y: 0, transition: { duration: 500, type: 'spring', stiffness: 100 } }"
      :leave="{ scale: 0.8, y: 50, transition: { duration: 300 } }"
      class="max-w-7xl w-full"
      @click.stop
    >
      <!-- Image -->
      <div class="relative rounded-2xl overflow-hidden shadow-2xl mb-6">
        <img 
          :src="currentImage" 
          :alt="currentTitle" 
          class="w-full h-auto max-h-[80vh] mx-10 object-contain"
        />
      </div>

      <!-- Caption -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400, delay: 200 } }"
        class="text-center text-white space-y-2"
      >
      </div>
    </div>

    <!-- Hint text -->
    <div 
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { duration: 400, delay: 400 } }"
      class="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs md:text-sm"
    >
      Klik di luar atau tekan ESC untuk menutup
    </div>
  </div>
</Teleport>
            <!-- Divider -->
            <div class="border-t border-gray-300 my-16"></div>

            <!-- Recommended Projects -->
            <div class="mw-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
                <h3 class="acorn500 text-2xl font-bold text-gray-900 mb-4">
                    Recommended Projects
                </h3>
                <!-- Grid Projects -->
                <div v-motion
                    :initial="{ opacity: 0, y: 60 }"
                    :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }" class="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <ProjectCard
                    v-for="project in recommendedProjects"
                    :key="project.judul"
                    :project="project"
                    />
                </div>

                <NuxtLink to="/" aria-label="Go back Home"
                class="inline-flex mt-4 items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-12 group">
                <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-sm font-medium">Back to Home</span>
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

const goBack = () => window.history.length > 1 
                        ? router.back() 
                        : router.push('/')
                        
const projectDetail = route.params.detail as keyof typeof projectsData
// Lightbox state
const lightboxOpen = ref(false);
const currentImage = ref('');
const currentTitle = ref('');
const currentDescription = ref('');

const openLightbox = (screenshot: { image: string; title: string; description: string }) => {
  currentImage.value = screenshot.image;
  currentTitle.value = screenshot.title;
  currentDescription.value = screenshot.description;
  lightboxOpen.value = true;
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};
if (!projectsData[projectDetail]) {
    throw createError({ statusCode: 404 })
}

const project = computed(() => {
    return projectsData[projectDetail] ?? projectsData.teory
})

const recommendedProjects = computed(() => {
    if (!project.value) return []

    return projects
        // exclude current project
        .filter(p => p.detail !== projectDetail)
        // similarity by tech
        .map(p => {
            const commonTech = p.techs.filter(t =>
                project.value.techs.includes(t)
            )

            return {
                ...p,
                score: commonTech.length,
            }
        })
        // urutkan dari paling relevan
        .sort((a, b) => b.score - a.score)
        // ambil 3 teratas
        .slice(0, 2)
})


onMounted(() => {
  // ... kode yang sudah ada ...

  // ESC key to close lightbox
  const handleEsc = (e) => {
    if (e.key === 'Escape' && lightboxOpen.value) {
      closeLightbox();
    }
  };
  window.addEventListener('keydown', handleEsc);
  
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc);
  });
});
</script>
