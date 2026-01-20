<template>
  <NuxtLink
    :to="`/projects/${project.detail}`"
    class="group block relative bg-bg rounded-[3rem] p-8 md:p-14 hover:shadow-[0_60px_100px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-4 border border-primary/5 h-full overflow-hidden"
  >
    <!-- Background Gradient (Awwwards Style) -->
    <div class="absolute inset-0 bg-gradient-to-br from-warna1/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <!-- Index Number -->
    <div class="absolute top-8 left-8 md:top-12 md:left-12">
      <span class="text-[10px] font-black tracking-[0.5em] text-primary/20 group-hover:text-warna1/40 transition-colors uppercase">
        Project {{ (index + 1).toString().padStart(2, '0') }}
      </span>
    </div>

    <div class="relative z-10 flex flex-col h-full mt-8 md:mt-12">
      <!-- Feature Visual Area (Cinematic) -->
      <div class="mb-12 w-full aspect-video rounded-3xl bg-primary/[0.02] border border-primary/[0.05] overflow-hidden flex items-center justify-center p-6 md:p-16 group-hover:bg-primary/[0.04] transition-all duration-700 relative">
        <!-- Floating Shine Layer -->
        <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div v-if="project.judul === 'AgaFood'" class="flex gap-6 md:gap-10 items-center flex-wrap justify-center relative z-10 w-full">
          <img src="/projects/tkmr.png" class="h-20 md:h-28 w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" alt="Takemori" />
          <div class="w-px h-12 md:h-16 bg-primary/10"></div>
          <img src="/projects/sdb.png" class="h-20 md:h-28 w-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" alt="Soondobu" />
        </div>
        <img 
          v-else 
          :src="project.logoUrl" 
          class="max-h-[85%] max-w-[85%] md:max-h-full md:max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-700 relative z-10" 
          :alt="project.judul" 
        />
      </div>

      <!-- Text Content -->
      <div class="space-y-4">
        <h3 class="text-3xl md:text-5xl font-black text-primary acorn tracking-tighter group-hover:text-warna1 transition-colors italic leading-none">
          {{ project.judul }}
        </h3>
        
        <p class="text-secondary text-lg font-medium leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {{ project.deskripsi }}
        </p>
      </div>

      <!-- Tech Stack Badges (Minimalist) -->
      <div class="flex flex-wrap gap-2 mt-12">
        <span
          v-for="tech in project.techs"
          :key="tech"
          class="px-4 py-1.5 bg-primary/[0.03] text-primary/40 text-[9px] font-black uppercase tracking-[0.25em] rounded-full border border-primary/5 group-hover:border-warna1/20 group-hover:text-warna1 transition-all duration-300"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  index: number;
  project: {
    id: number;
    detail: string;
    judul: string;
    deskripsi: string;
    logoUrl?: string;
    techs: readonly any[];
    link: string;
  };
}>();
</script>
