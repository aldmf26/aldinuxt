<template>
  <article v-if="project" class="case">
    <header class="case-hero wrap">
      <p class="track-tag"><i />APPS · BAR {{ String(Number(project.year) - FIRST_YEAR + 1).padStart(2, '0') }} · {{ project.year }}</p>
      <div v-if="projectLogos.length" class="logos">
        <img
          v-for="(logo, index) in projectLogos"
          :key="logo"
          :src="logo"
          :alt="projectLogos.length > 1 ? `${project.title} brand ${index + 1}` : `${project.title} logo`"
          height="56"
        />
      </div>
      <h1 class="display">{{ project.title }}</h1>
      <div class="lede-row">
        <p class="lede">{{ localized('subtitle') }}</p>
        <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="btn btn-primary"><span>{{ $t('project.live') }} ↗</span></a>
      </div>
      <dl class="meta">
        <div><dt>{{ $t('project.role') }}</dt><dd>{{ localized('role') }}</dd></div>
        <div><dt>{{ $t('project.year') }}</dt><dd class="num">{{ project.year }}</dd></div>
        <div><dt>{{ $t('project.stack') }}</dt><dd>{{ project.techs.join(', ') }}</dd></div>
        <div v-if="localized('impact')"><dt>{{ $t('project.impact') }}</dt><dd>{{ localized('impact') }}</dd></div>
      </dl>
    </header>

    <section class="story wrap">
      <div>
        <h2>{{ $t('project.problem') }}</h2>
        <p>{{ localized('problem') }}</p>
      </div>
      <div>
        <h2>{{ $t('project.outcome') }}</h2>
        <p>{{ localized('solution') }}</p>
      </div>
    </section>

    <section class="shots wrap">
      <figure v-for="(img, i) in project.screenshots" :key="i" :class="{ wide: i % 3 === 0 }">
        <img :src="img.image" :alt="localizedScreenshot(i, 'title', img.title)" :loading="i ? 'lazy' : 'eager'" decoding="async" width="1600" height="1000" />
        <figcaption>
          <strong>{{ localizedScreenshot(i, 'title', img.title) }}</strong>
          {{ localizedScreenshot(i, 'description', img.description) }}
        </figcaption>
      </figure>
    </section>

    <NuxtLink v-if="next" class="next wrap" :to="localePath(`/projects/${next.slug}`)">
      <span class="track-tag"><i />{{ $t('project.more') }}</span>
      <span class="next-name display">{{ next.name }}</span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { projects } from '~/data/project'
import { projectsData } from '~/data/project-detail'
import { FIRST_YEAR } from '~/data/timeline'

const route = useRoute()
const localePath = useLocalePath()
const { t, te } = useI18n()

const project = computed(() => {
  const slug = route.params.slug as string
  if (!slug) return null
  
  // Find match in projectsData
  const detail = projectsData[slug as keyof typeof projectsData]
  if (detail) {
    // Merge with basic info from projects array (like number, color)
    const basic = projects.find(p => p.slug === slug)
    return { ...basic, ...detail }
  }
  return null
})

const projectLogos = computed<string[]>(() => {
  if (!project.value) return []
  if ('logoUrls' in project.value && Array.isArray(project.value.logoUrls)) {
    return [...project.value.logoUrls]
  }
  if ('logoUrl' in project.value && typeof project.value.logoUrl === 'string') {
    return [project.value.logoUrl]
  }
  return []
})

const localized = (field: string) => {
  if (!project.value) return ''
  const key = `projects.${route.params.slug}.${field}`
  return te(key) ? t(key) : (project.value as Record<string, any>)[field]
}

const localizedScreenshot = (index: number, field: string, fallback: string) => {
  const key = `projects.${route.params.slug}.screenshots.${index}.${field}`
  return te(key) ? t(key) : fallback
}

// Server & Client 404 handling
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project Not Found', fatal: true })
}

// next project in list order, wrapping around, so the reading never dead-ends
const next = computed(() => {
  const list = projects.filter(p => !p.private)
  const i = list.findIndex(p => p.slug === route.params.slug)
  return list[(i + 1) % list.length]
})

useHead({
  title: project.value ? `${project.value.title} · Aldi Fahrizaldi` : 'Project Not Found',
  meta: [
    { name: 'description', content: project.value?.subtitle || '' },
  ],
})
</script>

<style scoped>
.case-hero { display: grid; gap: 22px; padding-top: calc(var(--bar-h) + clamp(48px, 10vh, 120px)); padding-bottom: clamp(40px, 7vh, 80px); }
.logos { display: flex; gap: 12px; }
.logos img { height: 56px; width: auto; padding: 8px 12px; background: #fff; border-radius: var(--clip-r); }
h1 { font-size: var(--t-mega); margin-left: -0.05em; overflow-wrap: anywhere; }
.lede-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 20px 40px; }
.lede { font-size: var(--t-m); line-height: 1.35; max-width: 38rem; }
.meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px 32px; padding-top: 20px; border-top: 1px solid var(--line); }
.meta dt { font: 400 var(--t-xs)/1.6 var(--font-mono); color: var(--text-secondary); }
.meta dd { font-size: var(--t-s); font-weight: 600; }
.story { display: grid; grid-template-columns: 1fr 1fr; gap: 32px clamp(32px, 6vw, 96px); padding-block: clamp(48px, 8vh, 96px); }
.story h2 { font: 800 var(--t-l)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.03em; margin-bottom: 16px; }
.story p { color: var(--text-secondary); max-width: 60ch; }
.shots { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 4vw, 48px); padding-bottom: clamp(64px, 10vh, 120px); }
.shots figure.wide { grid-column: 1 / -1; }
.shots img { width: 100%; height: auto; border-radius: var(--clip-r); border: 1px solid var(--line); }
figcaption { margin-top: 12px; font-size: var(--t-s); color: var(--text-secondary); max-width: 60ch; }
figcaption strong { display: block; color: var(--text-primary); margin-bottom: 2px; }
.next {
  position: relative; isolation: isolate; display: grid; gap: 12px; padding-block: clamp(48px, 10vh, 120px);
  border-top: 1px solid var(--line); text-decoration: none;
}
.next::before {
  content: ''; position: absolute; inset: 0; z-index: -1; background: var(--clip-code);
  clip-path: inset(0 100% 0 0); transition: clip-path 0.6s var(--ease);
}
.next:hover::before, .next:focus-visible::before { clip-path: inset(0 0 0 0); }
.next:hover, .next:focus-visible { color: var(--clip-code-ink); }
.next-name { font-size: var(--t-xl); transition: translate 0.6s var(--ease); }
.next:hover .next-name { translate: 16px 0; }
@media (max-width: 760px) {
  .meta { grid-template-columns: 1fr 1fr; }
  .story, .shots { grid-template-columns: 1fr; }
}
</style>
