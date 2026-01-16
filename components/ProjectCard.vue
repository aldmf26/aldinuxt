<template>
  <NuxtLink
    :to="`/projects/${project.detail}`"
    :class="cardClass"
    class="block group h-full"
    
  >
    <div class="p-6 flex flex-col h-full">
      <!-- Title -->
      <div v-if="project.judul === 'AgaFood'">
        <img
          src="\public\projects\tkmr.png"
          class="inline"
          width="120"
          alt="Project Logo"
        />
        <img
          src="\public\projects\sdb.png"
          class="inline"
          width="120"
          alt="Project Logo"
        />
      </div>
      <div v-else>
        <img
          :src="project.logoUrl"
          class="inline"
          width="120"
          alt="Project Logo"
        />
      </div>
      <h3
        class="acorn500 text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors"
      >
        {{ project.judul }}
      </h3>

      <!-- Description -->
      <p class="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
        {{ project.deskripsi }}
      </p>

      <!-- Tech Stack -->
      <div class="flex flex-wrap justify-center gap-2 mt-auto">
        <span
          v-for="tech in project.techs"
          :key="tech"
          class="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  project: {
    detail: string;
    judul: string;
    deskripsi: string;
    logoUrl: string;
    techs: string[];
  };
}>();

const cardClass =
  "bg-white/40 backdrop-blur-sm cursor-pointer hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-2xl border border-gray-100";
</script>
