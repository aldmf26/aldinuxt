<template>
  <NuxtLayout>
    <section class="lost wrap">
      <p class="track-tag"><i />PATTERN {{ error?.statusCode ?? 404 }}</p>
      <h1 class="display">{{ $t('notFound.title') }}</h1>
      <p class="sub">{{ $t('notFound.sub') }}</p>

      <!-- an empty piano roll: twelve rows, sixteen steps, no notes -->
      <div class="roll" aria-hidden="true">
        <span v-for="n in 12" :key="n" class="key" :class="{ black: [2, 4, 7, 9, 11].includes(n) }" />
        <span class="grid" />
      </div>

      <button type="button" class="btn btn-primary" @click="home"><span>{{ $t('notFound.back') }}</span></button>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{ error?: { statusCode?: number } }>()
const localePath = useLocalePath()
const home = () => clearError({ redirect: localePath('/') })
useHead({ title: '404 · Aldi Fahrizaldi' })
</script>

<style scoped>
.lost { min-height: 100svh; display: grid; align-content: center; gap: 24px; padding-top: calc(var(--bar-h) + 40px); padding-bottom: 64px; justify-items: start; }
h1 { font-size: var(--t-xl); max-width: 14ch; }
.sub { color: var(--text-secondary); font-size: var(--t-m); max-width: 32rem; }
.roll {
  position: relative; width: 100%; height: clamp(180px, 30vh, 280px);
  display: grid; grid-template-rows: repeat(12, 1fr); grid-template-columns: 56px 1fr;
  border: 1px solid var(--line); border-radius: var(--clip-r); overflow: hidden;
}
.key { grid-column: 1; background: var(--text-primary); opacity: 0.85; border-bottom: 1px solid var(--line); }
.key.black { background: var(--bg-primary); opacity: 1; }
.grid {
  grid-column: 2; grid-row: 1 / -1;
  background:
    repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px calc(100% / 16)),
    repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px calc(100% / 12));
}
/* the playhead keeps looping over nothing */
.grid::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: 56px; width: 2px; background: var(--accent);
  animation: loop 3.4s linear infinite;
}
@keyframes loop { to { translate: calc(100cqw - 58px) 0; } }
.roll { container-type: inline-size; }
</style>
