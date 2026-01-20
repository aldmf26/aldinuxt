<template>
  <div class="bg-bg min-h-screen transition-colors duration-500">
    <Heading />
    
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