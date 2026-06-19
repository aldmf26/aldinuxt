<template>
  <nav
    class="fixed left-0 top-0 z-[100] w-full transition-transform duration-500 ease-in-out"
    :class="{ '-translate-y-full': isHidden }"
  >
    <div class="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-4 sm:px-6 md:px-12 md:py-5">
      <NuxtLink
        to="/"
        class="group flex items-center gap-3"
        data-cursor-hover
      >
        <span class="grid h-9 w-9 place-items-center rounded-full bg-orange-400/20 text-sm font-black text-orange-300">
          A
        </span>
        <span class="font-display text-2xl font-black italic tracking-[-0.04em] text-white transition-colors group-hover:text-orange-300">
          AldiMF
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-1 rounded-full bg-[#0a0a0a] px-1.5 py-1.5 ring-1 ring-white/[0.06] md:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/65 transition-all hover:bg-white/[0.04] hover:text-white"
          data-cursor-hover
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <NuxtLink
          to="/service"
          class="hidden rounded-full bg-white px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-orange-300 md:inline-flex"
          data-cursor-hover
        >
          Hire Me
        </NuxtLink>
        <button
          class="relative z-[110] rounded-full bg-[#0a0a0a] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white ring-1 ring-white/[0.08] md:hidden"
          data-cursor-hover
          @click="isMenuOpen = !isMenuOpen"
        >
          {{ isMenuOpen ? 'Close' : 'Menu' }}
        </button>
      </div>
    </div>

    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[105] flex flex-col items-center justify-center bg-[#050608] p-10">
        <div class="flex flex-col gap-8 text-center">
          <NuxtLink
            v-for="link in mobileLinks"
            :key="link.path"
            :to="link.path"
            class="font-display text-4xl italic text-white transition-all hover:text-orange-300 md:text-6xl"
            @click="isMenuOpen = false"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <div
      class="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-0 transition-opacity duration-500"
      :class="{ 'opacity-100': isScrolled && !isMenuOpen }"
    ></div>
  </nav>
</template>

<script setup>
const isHidden = ref(false)
const isScrolled = ref(false)
const isMenuOpen = ref(false)
let lastScroll = 0

const navLinks = [
  { name: 'Web', path: '/#works' },
  { name: 'Music', path: '/#music' },
  { name: 'Projects', path: '/#works' },
  { name: 'Contact', path: '/#contact' },
]

const mobileLinks = [
  ...navLinks,
  { name: 'Hire Me', path: '/service' },
]

function onScroll() {
  const currentScroll = window.pageYOffset
  isHidden.value = currentScroll > lastScroll && currentScroll > 120
  isScrolled.value = currentScroll > 40
  lastScroll = currentScroll
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}
</style>
