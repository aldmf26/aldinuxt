<template>
  <div class="app-root">
    <!-- Interactive Cursor -->
    <ClientOnly>
      <AppCursor />
    </ClientOnly>

    <!-- Theme Switcher -->
    <ClientOnly>
      <AppThemeSwitcher />
    </ClientOnly>

    <!-- Preloader -->
    <Transition name="fade-overlay">
      <AppPreloader v-if="showPreloader" @complete="onPreloaderComplete" />
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const showPreloader = ref(true)

const onPreloaderComplete = () => {
  showPreloader.value = false
  if (process.client) {
    document.body.style.overflow = 'auto'
  }
}

onMounted(() => {
  if (process.client) {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden'
    
    // Safety unlock
    setTimeout(() => {
      showPreloader.value = false
      document.body.style.overflow = 'auto'
    }, 4500)
  }
})
</script>

<style>
/* Global site background to prevent white flashes */
html, body {
  background-color: var(--bg-primary);
  margin: 0;
  padding: 0;
}

.fade-overlay-leave-active {
  transition: opacity 0.8s ease-in-out;
}
.fade-overlay-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
