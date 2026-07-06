<template>
  <div class="min-h-screen text-[var(--text-primary)] relative overflow-x-hidden transition-colors duration-500" style="background-color: var(--bg-primary);">
    <!-- Noise Overlay -->
    <div class="noise-overlay"></div>

    <!-- Navigation -->
    <Nav />

    <!-- Main Content -->
    <main class="pt-[72px] md:pt-20">
      <slot />
    </main>
  </div>
</template>

<script setup>
// components/nav.vue is auto-imported as <Nav />
</script>

<style>
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  pointer-events: none;
  opacity: 0.04;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  filter: contrast(150%) brightness(1000%);
}
</style>
