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
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="font-mono text-[11px] uppercase tracking-[0.1em] text-lime z-[110] relative" 
          data-cursor-hover
        >
          {{ isMenuOpen ? 'Close' : 'Menu' }}
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="fixed inset-0 bg-[var(--bg-primary)] z-[105] flex flex-col items-center justify-center p-10">
        <div class="flex flex-col gap-8 text-center">
          <NuxtLink 
            v-for="(link, i) in navLinks" 
            :key="link.path"
            :to="link.path"
            @click="isMenuOpen = false"
            class="text-4xl md:text-6xl font-display italic text-text-primary hover:text-lime transition-all"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Subtle Blur Background -->
    <div class="absolute inset-0 -z-10 backdrop-blur-md bg-[var(--bg-primary)]/10 opacity-0 transition-opacity duration-500" :class="{ 'opacity-100': isScrolled && !isMenuOpen }"></div>
  </nav>

</template>

<script setup>
const isHidden = ref(false)
const isScrolled = ref(false)
const isMenuOpen = ref(false)
let lastScroll = 0


const navLinks = [
  { name: 'Work', path: '/#works' },
  { name: 'Music', path: '/#music' },
  { name: 'Hire Me', path: '/service' },
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

/* Menu Transition */
.menu-fade-enter-active, .menu-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-fade-enter-from, .menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

