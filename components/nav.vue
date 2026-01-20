<template>
  <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-6 md:right-6 md:translate-x-0 z-[100] flex gap-1.5 p-1.5 bg-bg/80 backdrop-blur-xl rounded-full border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] items-center transition-all duration-500">
    <NuxtLink
      v-for="link in navigation"
      :key="link.to"
      :to="link.to"
      class="px-5 py-2.5 md:px-6 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center whitespace-nowrap"
      :class="[
        $route.path === link.to || ($route.name === 'projects-detail' && link.to === '/')
          ? 'bg-warna1 text-bg shadow-lg shadow-warna1/20' 
          : 'text-primary/60 hover:text-primary hover:bg-primary/5'
      ]"
    >
      {{ link.name }}
    </NuxtLink>
  </nav>
</template>

<script setup>
const navigation = [
  { name: 'Web', to: '/' },
  { name: 'Music', to: '/music' },
  { name: 'Service', to: '/service' }
]
</script>

<style scoped>
/* Scoped styles if needed */
</style>
