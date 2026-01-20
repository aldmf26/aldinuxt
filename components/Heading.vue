<template>
  <section class="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 bg-bg transition-colors duration-500">
    <!-- Background Accents -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-warna1/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-24 w-80 h-80 bg-warnaHijau/5 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col items-center text-center">
        <div 
          v-motion
          :initial="{ opacity: 0, scale: 0.8, y: 30 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }"
          class="relative mb-12"
        >
          <div class="w-32 h-32 md:w-40 md:h-40 bg-bg rounded-[2.5rem] shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-all duration-500 border border-primary/10 cursor-pointer group">
            <span class="text-6xl md:text-7xl font-black text-warna1 select-none group-hover:scale-110 transition-transform">A</span>
            
            <!-- Floating Indicators -->
            <div class="absolute -top-4 -right-4 w-14 h-14 bg-warnaHijau rounded-2xl shadow-lg flex items-center justify-center -rotate-12 animate-bounce">
              <span class="text-2xl">🎹</span>
            </div>
            <div class="absolute -bottom-2 -left-6 w-12 h-12 bg-warna1 rounded-2xl shadow-lg flex items-center justify-center rotate-12 animate-pulse">
              <span class="text-xl">💻</span>
            </div>
          </div>
        </div>

        <!-- Typography Heading -->
        <div class="max-w-4xl">
          <h1 
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 800 } }"
            class="text-6xl md:text-8xl font-black text-primary tracking-tighter acorn leading-[1.1] mb-8"
          >
            Crafting digital <span class="text-warna1">code</span> & sonic <span class="text-warnaHijau italic">rhythms</span>.
          </h1>
          
          <p 
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 800 } }"
            class="text-xl md:text-2xl text-secondary font-medium leading-relaxed mb-12"
          >
            I'm <span class="text-primary font-bold">Aldi</span> — a multidisciplinary creator blending 
            <span class="inline-flex items-center px-3 py-1 bg-warna1/10 text-warna1 rounded-full text-lg font-bold mx-1">Web Development</span> 
            with professional 
            <span class="inline-flex items-center px-3 py-1 bg-warnaHijau/10 text-warnaHijau rounded-full text-lg font-bold mx-1">Music Production</span>.
          </p>

          <!-- Action Buttons -->
          <div 
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 800 } }"
            class="flex flex-wrap justify-center gap-6"
          >
            <a href="#projects" class="px-10 py-5 bg-primary text-bg rounded-2xl font-bold text-lg hover:bg-warna1 hover:-translate-y-1 transition-all shadow-xl shadow-primary/10">
              Explore Projects
            </a>
            <NuxtLink to="/music" class="px-10 py-5 bg-bg text-primary border-2 border-primary/10 rounded-2xl font-bold text-lg hover:border-warna1 hover:text-warna1 hover:-translate-y-1 transition-all shadow-sm">
              Listen to Beats
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Decorative Wave (Bottom) -->
    <div class="absolute bottom-0 left-0 w-full opacity-5 pointer-events-none">
       <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#255BA6" fill-opacity="1" d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,144C672,149,768,139,864,122.7C960,107,1056,85,1152,80C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    </div>
  </section>
</template>

<script setup>
// No complex logic needed for the hero section yet
</script>

<style scoped>
.acorn {
  font-family: 'Fredoka', sans-serif; /* Fallback to Fredoka as seen in app.vue */
}
</style>
