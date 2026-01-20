<template>
  <div class="bg-bg min-h-screen transition-colors duration-500">
    <Heading />
    
    <!-- Seamless Marquee Section -->
    <div class="py-12 bg-primary/5 border-y border-primary/5 overflow-hidden whitespace-nowrap marquee-container relative z-10">
      <div class="flex items-center gap-12 marquee-content px-12">
        <span v-for="i in 4" :key="i" class="flex items-center gap-12">
          <span class="text-4xl md:text-6xl font-black text-primary/20 uppercase tracking-tighter acorn">Web Development</span>
          <span class="w-3 h-3 rounded-full bg-warna1"></span>
          <span class="text-4xl md:text-6xl font-black text-primary/20 uppercase tracking-tighter acorn">Music Production</span>
          <span class="w-3 h-3 rounded-full bg-warnaHijau"></span>
          <span class="text-4xl md:text-6xl font-black text-primary/20 uppercase tracking-tighter acorn">UI/UX Design</span>
          <span class="w-3 h-3 rounded-full bg-primary/20"></span>
        </span>
      </div>
    </div>

    <!-- Skills Section -->
    <section class="py-20 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 class="text-3xl md:text-5xl font-black text-primary acorn mb-4">Core Expertise</h2>
        <p class="text-lg text-secondary font-medium tracking-tight">Interactive visualization of my technical and creative stack.</p>
      </div>
      <OrbitSkills />
    </section>

    <div id="projects">
      <Project />
    </div>

    
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

onMounted(() => {
  const marquee = document.querySelector('.marquee-content')
  const totalWidth = marquee.scrollWidth / 4 // Since we repeated it 4 times
  
  gsap.to(marquee, {
    x: -totalWidth,
    duration: 20,
    ease: 'none',
    repeat: -1
  })
})

useHead({
  title: `Aldi - Web Developer & Music Producer`
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>