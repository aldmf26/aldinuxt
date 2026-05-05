<template>
  <nav 
    ref="navRef"
    class="fixed top-0 left-0 w-full z-[100] transition-transform duration-500 ease-in-out"
    :class="{ '-translate-y-full': isHidden }"
  >
    <div class="max-w-[1800px] mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink 
        to="/" 
        class="font-mono text-sm tracking-[0.3em] text-text-primary hover:text-lime transition-colors"
        data-cursor-hover
      >
        ALDMF
      </NuxtLink>

      <!-- Nav Links -->
      <div class="hidden md:flex items-center gap-12">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link font-mono text-[11px] uppercase tracking-[0.2em] text-text-primary/60 hover:text-lime transition-all relative py-1"
          data-cursor-hover
        >
          {{ link.name }}
          <span class="nav-underline"></span>
        </NuxtLink>
      </div>

      <!-- Theme/Mobile Toggle -->
      <div class="flex items-center gap-6">
        <button class="font-mono text-[11px] uppercase tracking-[0.1em] text-lime" data-cursor-hover>
          Menu
        </button>
      </div>
    </div>
    
    <!-- Subtle Blur Background -->
    <div class="absolute inset-0 -z-10 backdrop-blur-md bg-[var(--bg-primary)]/10 opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': isScrolled }"></div>
  </nav>
</template>

<script setup>
const isHidden = ref(false)
const isScrolled = ref(false)
let lastScroll = 0

const navLinks = [
  { name: 'Works', path: '/#works' },
  { name: 'Sound', path: '/#music' },
  { name: 'About', path: '/#about' },
  { name: 'Contact', path: '/#contact' },
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset
    
    // Hide on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 100) {
      isHidden.value = true
    } else {
      isHidden.value = false
    }
    
    // Background blur on scroll
    isScrolled.value = currentScroll > 50
    
    lastScroll = currentScroll
  }, { passive: true })
})
</script>

<style scoped>
.nav-link .nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.nav-link:hover .nav-underline {
  width: 100%;
}

.router-link-active .nav-underline {
  width: 100%;
}
</style>
