<template>
  <div class="min-h-screen bg-bg transition-colors duration-500 fredoka selection:bg-warna1 selection:text-bg relative overflow-hidden">
    <!-- Editorial Noise Overlay -->
    <div class="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035] noise-overlay"></div>
    
    <Nav />

    <main>
      <slot />
    </main>

    <!-- Refined Footer -->
    <footer class="pt-24 pb-12 border-t border-primary/5 bg-primary/[0.02]">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-3 gap-12 items-start text-left">
          <!-- Logo & Copyright -->
          <div class="space-y-6">
            <div class="w-16 h-16 bg-bg border border-primary/10 rounded-2xl flex items-center justify-center text-3xl font-black text-warna1 shadow-xl">
              A
            </div>
            <p class="text-secondary font-medium italic">
              © 2024 Fahrizãldi. <br> 
              Banjarmasin, Indonesia
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-primary font-black uppercase tracking-widest text-sm mb-6">Elsewhere</h3>
            <ul class="space-y-4">
              <li v-for="link in socialLinks" :key="link.name">
                <a :href="link.url" target="_blank" class="text-secondary hover:text-warna1 transition-colors font-bold flex items-center gap-2">
                  <span>{{ link.name }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-primary font-black uppercase tracking-widest text-sm mb-6">Contact</h3>
            <a href="mailto:aldimf26@gmail.com?subject=Aldi,aku%20butuh%20bantuan!" class="group inline-flex items-center gap-4 p-6 bg-bg border border-primary/10 rounded-[2rem] hover:border-warna1 transition-all duration-300">
              <div class="w-12 h-12 bg-warna1/10 rounded-xl flex items-center justify-center text-warna1 group-hover:bg-warna1 group-hover:text-bg transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <span class="block text-xs font-black text-secondary uppercase tracking-widest">Email me at</span>
                <span class="text-primary font-bold">aldimf26@gmail.com</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>

    
  </div>
</template>

<script setup>
const scrollY = ref(0)
const onScroll = () => scrollY.value = window.scrollY
const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/aldiiimf' },
  { name: 'Github', url: 'https://github.com/aldmf26' },
  { name: 'Youtube', url: 'https://www.youtube.com/@ALdMFbeat' }
]

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style>
/* Global styles for smooth theme transition */
.noise-overlay {
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  filter: contrast(150%) brightness(100%);
}

@keyframes noise {
  0% { transform: translate(0,0) }
  10% { transform: translate(-5%,-5%) }
  20% { transform: translate(-10%,5%) }
  32% { transform: translate(5%,-10%) }
  45% { transform: translate(-5%,20%) }
  58% { transform: translate(15%,-5%) }
  70% { transform: translate(-15%,10%) }
  82% { transform: translate(10%,5%) }
  92% { transform: translate(5%,15%) }
  100% { transform: translate(0,0) }
}

* {
  @apply transition-colors duration-300;
}
</style>
