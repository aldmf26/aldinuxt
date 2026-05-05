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
          Prj. {{ project.number }}
        </div>

        <h3 class="font-display italic text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-[0.9] tracking-tighter">
          {{ project.name }}
        </h3>
        
        <p class="text-text-primary/50 text-sm md:text-base max-w-md font-body leading-relaxed mb-8">
          {{ project.shortDesc }}
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

    <!-- Image Area: Branded Visual (REBUILT) -->
    <div class="flex-1 relative overflow-hidden bg-[var(--bg-surface)] flex items-center justify-center">
       <!-- Branded Mockup -->
       <div class="project-visual-card">
          <!-- Colored accent top bar -->
          <div class="accent-bar" :style="{ background: project.color }"></div>

          <!-- Giant project number ghost -->
          <span class="ghost-number" :style="{ color: project.color }">{{ project.number }}</span>

          <!-- Diagonal grid lines -->
          <div class="diagonal-grid" :style="{ 
            backgroundImage: `repeating-linear-gradient(45deg, ${project.color}15 0px, ${project.color}15 1px, transparent 1px, transparent 28px)` 
          }"></div>

          <!-- Center Content -->
          <div class="relative z-10 text-center p-5">
             <p class="visual-type" :style="{ color: project.color }">{{ project.type }}</p>
             <div class="flex flex-wrap gap-2 justify-center">
                <span
                  v-for="tech in project.stack.slice(0, 3)"
                  :key="tech"
                  class="tech-pill"
                  :style="{
                    border: `1px solid ${project.color}60`,
                    color: project.color,
                    background: `${project.color}10`,
                  }"
                >{{ tech }}</span>
             </div>
          </div>
       </div>
    </div>

    <!-- Arrow Indicator (Top Right) -->
    <div class="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
       <svg class="w-6 h-6 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
       </svg>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})

const isWide = computed(() => {
  return props.index === 0 || props.index === 4
})
</script>

<style scoped>
.project-visual-card {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
}

.accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  width: 100%;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.group:hover .accent-bar {
  width: 103%;
}

.ghost-number {
  position: absolute;
  right: -8px;
  bottom: -16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 120px;
  font-weight: 900;
  opacity: 0.07;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  transition: opacity 0.4s;
}
.group:hover .ghost-number {
  opacity: 0.12;
}

.diagonal-grid {
  position: absolute;
  inset: 0;
  opacity: 1;
  transition: opacity 0.4s;
}
.group:hover .diagonal-grid {
  opacity: 1; /* Keep it consistent as per instruction opacity is 1 already but lines could vary */
}

.visual-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.8;
}

.tech-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
  white-space: nowrap;
}
</style>
