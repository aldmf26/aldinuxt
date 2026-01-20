<template>
  <div v-motion-fade class="min-h-screen bg-bg transition-colors duration-500 pt-32 pb-24">
    <!-- Header Section -->
    <section class="max-w-5xl mx-auto px-6 mb-20">
      <div v-motion-fade class="relative p-10 md:p-16 rounded-[3rem] bg-primary/[0.03] border border-primary/5 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-warna1/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div class="relative z-10">
          <h1 class="text-5xl md:text-8xl font-black text-primary acorn tracking-tighter mb-8 italic">Services</h1>
          <p class="text-xl md:text-2xl text-secondary font-medium leading-relaxed max-w-3xl">
            Build unique websites and create stunning music. Bring your vision to life with professional digital craftsmanship.
          </p>
          
          <!-- Floating mascot indicator -->
          <img
            src="/animasi/7.png"
            class="absolute -top-12 -right-12 w-32 md:w-48 animate-bounce opacity-80"
            alt="Aldi Mascot"
          />
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="max-w-5xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Web Dev Card -->
        <div class="group p-10 rounded-[2.5rem] bg-bg border border-primary/10 shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
          <div class="w-16 h-16 bg-warna1 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-warna1/20">
            <span class="text-3xl text-bg">💻</span>
          </div>
          <h2 class="text-4xl font-black text-primary acorn tracking-tighter mb-6">Web Development</h2>
          <ul class="space-y-4 mb-10">
            <li v-for="skill in ['Nuxt JS / Vue JS', 'Laravel / PHP', 'Tailwind CSS', 'Responsive Design']" 
                :key="skill"
                class="flex items-center gap-3 text-secondary font-bold"
            >
              <div class="w-2 h-2 rounded-full bg-warna1"></div>
              {{ skill }}
            </li>
          </ul>
          <img src="~/public/koding.jpg" class="w-full h-48 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Coding" />
        </div>

        <!-- Music Prod Card -->
        <div class="group p-10 rounded-[2.5rem] bg-bg border border-primary/10 shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
          <div class="w-16 h-16 bg-warnaHijau rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-warnaHijau/20">
            <span class="text-3xl text-bg">🎹</span>
          </div>
          <h2 class="text-4xl font-black text-primary acorn tracking-tighter mb-6">Music Production</h2>
          <ul class="space-y-4 mb-10">
            <li v-for="tool in ['FL Studio Professional', 'Mixing & Mastering', 'Custom HipHop Beats', 'Sound Design']" 
                :key="tool"
                class="flex items-center gap-3 text-secondary font-bold"
            >
              <div class="w-2 h-2 rounded-full bg-warnaHijau"></div>
              {{ tool }}
            </li>
          </ul>
          <img src="~/public/logo.jpg" class="w-full h-48 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Music" />
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <FaqService />
  </div>
</template>

<script setup>
useHead({
  title: `Service - Aldi`,
});
</script>

<style scoped>
.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>
