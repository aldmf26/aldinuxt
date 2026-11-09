<template>
  <NuxtLink :to="localePath(`/projects/${project.slug}`)" class="card" :class="{ lead }">
    <div class="shot">
      <img
        :src="project.image"
        :alt="project.name"
        :loading="lead ? 'eager' : 'lazy'"
        decoding="async"
        width="1600"
        height="1000"
      />
    </div>
    <div class="meta">
      <h3>{{ project.name }}</h3>
      <p class="desc">{{ shortDesc }}</p>
      <p class="stack">{{ project.stack.join(' · ') }}</p>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  lead: { type: Boolean, default: false },
})
const localePath = useLocalePath()
const { t, te } = useI18n()
const shortDesc = computed(() => {
  const key = `projects.${props.project.slug}.short`
  return te(key) ? t(key) : props.project.shortDesc
})
</script>

<style scoped>
.card { display: block; text-decoration: none; color: var(--text-primary); }
.shot {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-elevated);
  box-shadow: var(--shadow);
}
.shot img {
  width: 100%; height: 100%; object-fit: cover; object-position: top center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover .shot img { transform: scale(1.03); }
.meta { padding: 18px 4px 0; }
h3 {
  font-family: var(--font-display); font-weight: 800; letter-spacing: -0.03em;
  font-size: clamp(1.5rem, 2.6vw, 2rem); line-height: 1.05;
}
.card:hover h3 { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 3px; text-underline-offset: 6px; }
.desc { margin-top: 8px; color: var(--text-secondary); font-size: 1.05rem; line-height: 1.5; max-width: 60ch; }
.stack { margin-top: 10px; color: var(--text-muted); font-size: 0.95rem; }
.lead h3 { font-size: clamp(2rem, 4vw, 3rem); }
@media (prefers-reduced-motion: reduce) { .shot img { transition: none; } }
</style>
