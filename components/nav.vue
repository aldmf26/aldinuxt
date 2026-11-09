<template>
  <nav class="topbar" :class="{ scrolled }">
    <NuxtLink :to="localePath('/')" class="brand">aldmf</NuxtLink>
    <div class="right">
      <div class="swatches" role="group" :aria-label="$t('nav.accent')">
        <button
          v-for="a in ACCENTS"
          :key="a.id"
          type="button"
          class="swatch"
          :style="{ background: a.hex }"
          :aria-pressed="accent === a.id"
          :aria-label="a.label"
          :title="a.label"
          @click="setAccent(a.id, $event)"
        />
      </div>
      <div class="langs">
        <NuxtLink
          v-for="code in ['id', 'en']"
          :key="code"
          :to="switchLocalePath(code)"
          :aria-current="locale === code ? 'true' : undefined"
        >{{ code.toUpperCase() }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { accent, setAccent } = useSide()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
const scrolled = ref(false)
const onScroll = () => { scrolled.value = scrollY > 24 }
onMounted(() => addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => removeEventListener('scroll', onScroll))
</script>

<style scoped>
.topbar {
  position: fixed; inset: 0 0 auto; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px clamp(16px, 4vw, 40px);
  transition: background-color 0.3s, box-shadow 0.3s;
}
.topbar.scrolled { background: var(--bg-primary); box-shadow: 0 1px 0 var(--border); }
.brand { font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; letter-spacing: -0.03em; color: var(--text-primary); text-decoration: none; }
.right { display: flex; align-items: center; gap: 18px; }
.swatches { display: flex; gap: 6px; }
.swatch {
  width: 22px; height: 22px; border-radius: 50%; border: 0; cursor: pointer; padding: 0;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.18);
  transition: transform 0.15s;
}
.swatch:hover { transform: scale(1.12); }
.swatch[aria-pressed='true'] { outline: 2px solid var(--text-primary); outline-offset: 2px; }
.langs { display: flex; gap: 10px; font-weight: 600; }
.langs a { color: var(--text-muted); text-decoration: none; padding: 6px 2px; }
.langs a[aria-current='true'] { color: var(--text-primary); text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--accent); text-decoration-thickness: 2px; }
</style>
