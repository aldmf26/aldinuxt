<style>
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1e1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #255ba6;
  border-radius: 5px;
  border-width: 1px;
}
</style>
<template>
  <div class="mt-16 py-8 md:py-16">
    <!-- Hero Section Title -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      <h2 class="acorn500 text-4xl md:text-6xl font-bold text-gray-800">
        My Projects
      </h2>
      <p class="text-lg md:text-xl text-gray-600">
        Crafted with passion and precision
      </p>
    </div>

    <div class="mw-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
      <!-- Grid Projects -->
      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ProjectCard
          v-for="project in projects"
          :key="project.judul"
          :project="project"
          v-motion
          :initial="{ opacity: 0, y: 60 }"
          :visible="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 600,
              delay: index * 100 + 200, // stagger: card ke-2 delay 100ms lebih, dst
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
