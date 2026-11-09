<template>
  <section id="works" class="works">
    <h2 class="section-title">{{ $t('works.title') }}</h2>
    <div class="grid">
      <ProjectCard
        v-for="(project, i) in cards"
        :key="project.slug"
        :project="project"
        :lead="i === 0"
        :class="{ 'span-all': i === 0 }"
      />
    </div>
  </section>
</template>

<script setup>
import { projects } from '~/data/project'
import { projectsData } from '~/data/project-detail'

// Cards show the product itself: first case-study screenshot, falling back to the cover image (often a logo).
const cards = projects.map(p => ({ ...p, link: projectsData[p.slug]?.link, image: p.cover || projectsData[p.slug]?.screenshots?.[0]?.image || p.image }))
</script>

<style scoped>
.works { max-width: 1200px; margin: 0 auto; padding: 48px 16px 120px; }
.grid { display: grid; gap: 56px 32px; }
@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .span-all { grid-column: 1 / -1; }
}
</style>
