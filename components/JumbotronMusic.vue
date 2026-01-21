<template>
  <div v-motion-fade class="acorn py-10 transition-colors duration-500 pt-28">
    <!-- Mobile Title -->
    <div class="max-w-5xl mx-auto px-6 mb-8 block md:hidden text-left">
      <h1 class="text-primary text-6xl font-black italic tracking-tighter uppercase">Music</h1>
    </div>

    <!-- Desktop Jumbotron -->
    <section class="py-10 hidden md:block">
      <div class="w-full max-w-5xl mx-auto px-6 relative">
        <div class="relative overflow-hidden group bg-primary/[0.03] border border-primary/5 rounded-[3rem] p-12 md:p-20 shadow-2xl">
          <!-- Decorative Background -->
          <div class="absolute top-0 right-0 w-80 h-80 bg-warna1/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
          
          <div class="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div class="text-left">
              <h1 class="text-6xl md:text-8xl font-black text-primary tracking-tighter italic mb-8 leading-tight">
                Enjoÿ mÿ <span class="text-warna1">musÎc</span>
              </h1>
              <a 
                href="https://youtube.com/@ALdMFbeat" 
                target="_blank" 
                class="inline-flex items-center gap-4 px-8 py-4 bg-warna1 text-bg rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:-translate-y-1 transition-all shadow-xl shadow-warna1/20"
              >
                <img class="w-8 h-8" src="https://img.icons8.com/doodle/48/youtube--v1.png" alt="Youtube" />
                <span>Visit YouTube</span>
              </a>
            </div>
            
            <div class="relative group-hover:scale-105 transition-transform duration-700">
              <img 
                class="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)]" 
                src="~/public/mpc.png" 
                alt="MPC Controller" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No extra logic needed
</script>

<style scoped>
.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>
