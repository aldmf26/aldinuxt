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
                <p class="text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
                    {{ project.subtitle }}

                <div class="flex flex-wrap gap-3 mt-2 justify-center">
                    <span v-for="tech in project.techs" :key="tech"
                        class="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg">
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
            <section class="mb-16">
                <h2 class="acorn500 text-3xl font-bold text-gray-900 text-center">
                    Overview
                </h2>

                <p class="text-gray-700 leading-relaxed text-xl text-center max-w-2xl mx-auto">
                    {{ project.description }}
                </p>
            </section>



            <!-- Project Screenshots with Descriptions -->
            <section class="space-y-20 mb-20">
                <div v-for="(screenshot, index) in project.screenshots" :key="index" class="space-y-6">
                    <div class="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
                        <img :src="screenshot.image" :alt="screenshot.title" class="w-full h-auto object-cover" />
                    </div>
                    <div class="text-center max-w-2xl mx-auto">
                        <h3 class="acorn500 text-2xl font-bold text-gray-900 mb-3">
                            {{ screenshot.title }}
                        </h3>
                        <p class="text-gray-600 leading-relaxed text-lg">
                            {{ screenshot.description }}
                        </p>
                    </div>
                </div>
            </section>
            <!-- Divider -->
            <div class="border-t border-gray-300 my-16"></div>

            <!-- Recommended Projects -->
            <div class="mw-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
                <h3 class="acorn500 text-2xl font-bold text-gray-900 mb-4">
                    Recommended Projects
                </h3>
                <!-- Grid Projects -->
                <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}
const projectDetail = route.params.detail as keyof typeof projectsData

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

</script>
