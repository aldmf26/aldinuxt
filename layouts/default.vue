<template>
  <div class="min-h-screen text-[var(--text-primary)] relative overflow-x-hidden transition-colors duration-500" style="background-color: var(--bg-primary);">
    <!-- Noise Overlay -->
    <div class="noise-overlay"></div>

    <!-- Custom Cursor -->
    <ClientOnly>
      <AppCursor />
    </ClientOnly>

    <!-- Theme Switcher -->
    <ClientOnly>
      <AppThemeSwitcher />
    </ClientOnly>

    <!-- Preloader -->
    <ClientOnly>
      <AppPreloader v-if="showPreloader" @complete="onPreloaderComplete" />
    </ClientOnly>

    <!-- Main Content -->
    <main
      :class="{ 'opacity-0': showPreloader, 'opacity-100': !showPreloader }"
      class="transition-opacity duration-700"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
const showPreloader = ref(true)

const onPreloaderComplete = () => {
  showPreloader.value = false
}
</script>
