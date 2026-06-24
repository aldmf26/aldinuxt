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
        <span class="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)]/20 text-sm font-black text-[var(--accent)]">
          A
        </span>
        <span class="font-display text-2xl font-black italic tracking-[-0.04em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
          AldiMF
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-primary)]/55 transition-colors hover:text-[var(--text-primary)]"
          data-cursor-hover
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <NuxtLink
          to="/service"
          class="hidden font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]/70 underline-offset-4 hover:text-[var(--accent)] transition md:inline-flex"
          data-cursor-hover
        >
          Hire Me
        </NuxtLink>
        <button
          class="relative z-[110] rounded-full bg-[var(--bg-surface)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-primary)] ring-1 ring-[var(--border)] md:hidden"
          data-cursor-hover
          @click="isMenuOpen = !isMenuOpen"
        >
          {{ isMenuOpen ? 'Close' : 'Menu' }}
        </button>
      </div>
    </div>

    <Transition name="menu-fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[105] flex flex-col items-center justify-center bg-[var(--bg-primary)] p-10">
        <div class="flex flex-col gap-8 text-center">
          <NuxtLink
            v-for="link in mobileLinks"
            :key="link.path"
            :to="link.path"
            class="font-display text-4xl italic text-[var(--text-primary)] transition-all hover:text-[var(--accent)] md:text-6xl"
            @click="isMenuOpen = false"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <div
      class="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)] opacity-0 transition-opacity duration-500"
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
