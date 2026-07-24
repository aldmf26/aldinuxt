<template>
  <nav
    class="fixed left-0 top-0 z-[100] w-full transition-transform duration-500 ease-in-out"
    :class="{ '-translate-y-full': isHidden }"
  >
    <div
      class="mx-auto mt-3 flex max-w-[1480px] items-center justify-between rounded-full border border-transparent px-5 py-3 transition-all sm:px-6 md:mt-4 md:px-7"
      :class="{ 'border-[var(--border-strong)] bg-[var(--bg-primary)]/90 shadow-lg backdrop-blur-xl': isScrolled && !isMenuOpen }"
    >
      <NuxtLink
        :to="localePath('/')"
        class="group flex items-center gap-3"
        data-cursor-hover
      >
        <span class="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-xs font-black text-[var(--bg-primary)]">
          AF
        </span>
          <div>
            <span class="font-display text-xl font-extrabold tracking-[-0.05em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
              Aldi Fahrizaldi
            </span>
            <p class="-mt-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">{{ $t('nav.tagline') }}</p>
          </div>
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
          :to="localePath('/service')"
          class="hidden rounded-full bg-[var(--accent)] px-5 py-2.5 font-body text-xs font-bold text-[var(--bg-primary)] transition hover:-translate-y-0.5 md:inline-flex"
          data-cursor-hover
        >
          {{ $t('nav.hire') }}
        </NuxtLink>
        <div class="hidden items-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] p-1 md:flex">
          <NuxtLink
            v-for="code in ['id', 'en']"
            :key="code"
            :to="switchLocalePath(code)"
            class="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition"
            :class="locale === code ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'"
          >
            {{ code }}
          </NuxtLink>
        </div>
        <button
          class="relative z-[110] rounded-full bg-[var(--bg-surface)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-primary)] ring-1 ring-[var(--border)] md:hidden"
          data-cursor-hover
          @click="isMenuOpen = !isMenuOpen"
        >
          {{ isMenuOpen ? $t('nav.close') : $t('nav.menu') }}
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
          <div class="mt-5 flex justify-center gap-3">
            <NuxtLink
              v-for="code in ['id', 'en']"
              :key="code"
              :to="switchLocalePath(code)"
              class="rounded-full border border-[var(--border)] px-5 py-2 font-mono text-xs font-bold uppercase"
              :class="locale === code ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'text-[var(--text-primary)]'"
              @click="isMenuOpen = false"
            >
              {{ code }}
            </NuxtLink>
          </div>
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
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale, t } = useI18n()
let lastScroll = 0

const navLinks = computed(() => [
  { name: t('nav.work'), path: localePath('/#works') },
  { name: t('nav.beats'), path: localePath('/#music') },
  { name: t('nav.about'), path: localePath('/#about') },
  { name: t('nav.contact'), path: localePath('/#contact') },
])

const mobileLinks = computed(() => [
  ...navLinks.value,
  { name: t('nav.hire'), path: localePath('/service') },
])

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
