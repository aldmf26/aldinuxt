<template>
  <main class="min-h-screen bg-[var(--bg-primary)] transition-colors duration-500">
    <!-- Back Navigation -->
    <div class="fixed top-8 left-6 md:left-16 z-50">
      <NuxtLink 
        :to="localePath('/')"
        class="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-surface)] border border-white/5 rounded-full font-mono text-[10px] text-text-muted hover:text-lime hover:border-lime/30 transition-all duration-300"
        data-cursor-hover
      >
        <svg class="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        {{ $t('musicPage.back') }}
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <MusicSection />
    
    <!-- Custom Footer for Music Page -->
    <footer class="py-20 px-6 md:px-16 border-t border-white/5 bg-[var(--bg-primary)] text-center">
       <p class="font-mono text-[10px] text-text-muted tracking-widest uppercase">
         © {{ new Date().getFullYear() }} ALDMF — {{ $t('musicPage.copyright') }}
       </p>
    </footer>
  </main>
</template>

<script setup>
const localePath = useLocalePath()
useHead({
  title: 'Music & Productions — Aldi Fahrizaldi',
  meta: [
    { name: 'description', content: 'Beats, soundscapes, and sonic experiments by Aldi Fahrizaldi.' },
  ],
})
</script>

<style scoped>
/* Page-specific styles if needed */
</style>
