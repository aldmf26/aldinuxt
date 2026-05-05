<template>
  <NuxtLink
    v-if="project.slug"
    :to="`/projects/${project.slug}`"
    class="group relative overflow-hidden bg-[var(--bg-surface)] border border-text-primary/5 flex flex-col transition-all duration-700"
    :class="[
      isWide ? 'md:flex-row aspect-auto md:h-[450px]' : 'aspect-[4/5] md:aspect-[3/4]'
    ]"
    data-cursor-hover
  >
    <!-- Content Area -->
    <div 
      class="flex-1 p-8 md:p-12 flex flex-col justify-between z-10 relative bg-[var(--bg-surface)] transition-transform duration-700 group-hover:translate-x-2"
      :class="{ 'md:max-w-[40%] border-r border-text-primary/5': isWide }"
    >
      <div>
        <div class="font-mono text-[10px] text-lime tracking-[0.3em] uppercase mb-10 flex items-center gap-4">
          <span class="w-8 h-px bg-lime/30"></span>
          Prj. {{ formattedIndex }}
        </div>

        <h3 class="font-display italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-[0.9] tracking-tighter">
          {{ project.name }}
        </h3>
        
        <p class="text-text-primary/50 text-sm md:text-base max-w-md font-body leading-relaxed mb-8">
          {{ project.description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mt-auto">
        <span
          v-for="tech in project.stack"
          :key="tech"
          class="font-mono text-[9px] uppercase tracking-wider text-text-primary/30 px-2 py-1 border border-text-primary/10 rounded-sm"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <!-- Image Area -->
    <div class="flex-1 relative overflow-hidden bg-black/20">
       <div v-if="!project.image" class="w-full h-full flex items-center justify-center">
          <span class="ghost-number opacity-5 text-9xl">{{ formattedIndex }}</span>
       </div>
       <img 
          v-else 
          :src="project.image" 
          :alt="project.name" 
          class="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" 
       />
       
       <!-- Accent Overlay -->
       <div class="absolute inset-0 bg-lime/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    </div>

    <!-- Arrow Indicator (Top Right) -->
    <div class="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
       <svg class="w-6 h-6 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
       </svg>
    </div>
  </NuxtLink>

  <!-- Private Variant -->
  <div
    v-else
    class="relative overflow-hidden bg-[var(--bg-surface)] border border-text-primary/5 flex flex-col p-8 md:p-12 opacity-40 h-full min-h-[300px]"
  >
    <div class="font-mono text-[10px] text-text-primary/20 tracking-widest uppercase mb-8">
      / Restricted Access
    </div>
    <div class="mt-auto">
      <h3 class="font-display italic text-4xl md:text-5xl text-text-primary/20 leading-none tracking-tighter">
        {{ project.name }}
      </h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})

const isWide = computed(() => {
  return props.index === 0 || props.index === 4
})

const formattedIndex = computed(() => {
  return String(props.index + 1).padStart(2, '0')
})
</script>

<style scoped>
/* Scoped styles for high-fidelity transitions */
.group:hover img {
  filter: grayscale(0%);
}
</style>
