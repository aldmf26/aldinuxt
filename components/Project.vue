<template>
  <div class="py-24 bg-bg transition-colors duration-500">
    <!-- Section Header -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="max-w-7xl mx-auto px-6 mb-16 text-center"
    >
      <h2 class="text-4xl md:text-6xl font-black text-primary acorn mb-6">
        Selected Works
      </h2>
      <p class="text-xl text-secondary font-medium max-w-2xl mx-auto">
        Bridging the gap between code and design through intentional digital experiences.
      </p>
    </div>

    <!-- Project Grid -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.judul"
          :project="project"
          :index="index"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 800,
              delay: index * 100,
              ease: 'easeOut',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { projects } from "~/data/project";
</script>

<style scoped>
/* Scoped styles if needed, but Tailwind handles most things */
</style>
