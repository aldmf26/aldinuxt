<template>
  <!-- Card as NuxtLink -->
  <NuxtLink
    v-if="project.slug"
    :to="`/projects/${project.slug}`"
    ref="cardRefLink"
    class="group relative bg-[var(--bg-surface)] rounded-2xl overflow-hidden transition-all duration-500 hover:bg-[var(--bg-surface)] opacity-0 translate-y-[60px] cursor-pointer block flex flex-col border border-white/5 hover:border-lime/30"
    data-cursor-hover
  >
    <!-- Lime left border on hover -->
    <div class="absolute left-0 top-0 bottom-0 w-0 bg-lime group-hover:w-[3px] transition-all duration-500 z-20"></div>

    <!-- Content Area -->
    <div class="p-8 md:p-10 flex-1 flex flex-col justify-between relative z-10">
      <div>
        <div class="flex items-center gap-6 mb-6">
          <span class="font-mono text-2xl text-text-primary opacity-20 font-bold">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display italic text-3xl md:text-4xl text-text-primary group-hover:text-lime transition-colors duration-500">
            {{ project.name }}
          </h3>
        </div>

        <p class="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          {{ project.description }}
        </p>
      </div>

      <div class="flex items-end justify-between">
        <div class="flex flex-wrap gap-3">
          <span
            v-for="tech in project.stack"
            :key="tech"
            class="px-4 py-1.5 bg-text-primary/5 border border-text-primary/10 rounded-full font-mono text-xs text-text-primary uppercase tracking-wider"
          >
            {{ tech }}
          </span>
        </div>

        <div class="w-12 h-12 shrink-0 rounded-full border border-text-muted opacity-50 flex items-center justify-center group-hover:border-lime/50 group-hover:bg-lime/10 transition-all duration-500 cursor-pointer hover:opacity-100">
          <svg
            class="w-5 h-5 text-text-muted group-hover:text-lime transition-all duration-500 group-hover:rotate-[-45deg]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  </NuxtLink>

  <!-- Card as Div (Private) -->
  <div
    v-else
    ref="cardRefDiv"
    class="group relative bg-[var(--bg-surface)] rounded-2xl overflow-hidden transition-all duration-500 hover:bg-[var(--bg-surface)] opacity-0 translate-y-[60px] flex flex-col border border-white/5"
    data-cursor-hover
  >
    <div class="absolute left-0 top-0 bottom-0 w-0 bg-text-muted/20 group-hover:w-[3px] transition-all duration-500 z-20"></div>

    <!-- Content Area -->
    <div class="p-8 md:p-10 flex-1 flex flex-col justify-between relative z-10">
      <div>
        <div class="flex items-center gap-6 mb-6">
          <span class="font-mono text-2xl text-text-primary opacity-20 font-bold">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display italic text-3xl md:text-4xl text-text-primary opacity-50">
            {{ project.name }}
          </h3>
        </div>

        <p class="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          {{ project.description }}
        </p>
      </div>

      <div class="flex items-end justify-between">
        <div class="flex flex-wrap gap-3">
          <span
            v-for="tech in project.stack"
            :key="tech"
            class="px-4 py-1.5 bg-text-primary/5 border border-text-primary/10 rounded-full font-mono text-xs text-text-primary uppercase tracking-wider"
          >
            {{ tech }}
          </span>
        </div>

        <div v-if="project.private" class="px-5 py-2.5 shrink-0 rounded-full border border-text-muted/20 flex items-center justify-center bg-text-muted/10">
           <span class="font-mono text-xs text-text-muted uppercase tracking-wider flex items-center gap-2">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             Private Project
           </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
  tall: { type: Boolean, default: false },
})

const cardRefLink = ref(null)
const cardRefDiv = ref(null)

onMounted(async () => {
  if (typeof window === 'undefined') return

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const target = cardRefLink.value || cardRefDiv.value
  if (!target) return

  const el = target.$el || target

  gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  })
})
</script>
