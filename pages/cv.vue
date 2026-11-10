<template>
  <article class="cv wrap" :lang="lang">
    <header class="cv-top">
      <p class="track-tag no-print"><i />{{ $t('cv.tag') }}</p>
      <h1 class="display cv-name">{{ c.name }}</h1>
      <p class="cv-headline">{{ c.headline }}</p>
      <ul class="cv-contact">
        <li v-for="x in c.contact" :key="x.label">
          <span>{{ x.label }}:</span>
          <a v-if="x.href" :href="x.href" class="link">{{ x.value }}</a>
          <template v-else>{{ x.value }}</template>
        </li>
      </ul>
      <div class="cv-actions no-print">
        <a class="btn btn-primary" :href="cvPdf(lang)" download><span>{{ $t('cv.download') }}</span></a>
        <NuxtLink class="btn" :to="localePath('/')"><span>{{ $t('cv.back') }}</span></NuxtLink>
      </div>
    </header>

    <section>
      <h2>{{ c.headings.summary }}</h2>
      <p>{{ c.summary }}</p>
    </section>

    <section>
      <h2>{{ c.headings.experience }}</h2>
      <div v-for="j in c.jobs" :key="j.org" class="cv-block">
        <h3>{{ j.role }}</h3>
        <p class="cv-meta">{{ j.org }} · {{ j.place }} · <span class="num">{{ j.period }}</span></p>
        <p v-if="j.intro" class="cv-intro">{{ j.intro }}</p>
        <ul><li v-for="p in j.points" :key="p">{{ p }}</li></ul>
      </div>
    </section>

    <section>
      <h2>{{ c.headings.education }}</h2>
      <div class="cv-block">
        <h3>{{ c.education.degree }}</h3>
        <p class="cv-meta">{{ c.education.school }} · {{ c.education.place }} · <span class="num">{{ c.education.period }}</span></p>
        <p>{{ c.education.note }}</p>
      </div>
    </section>

    <section>
      <h2>{{ c.headings.projects }}</h2>
      <div v-for="p in c.projects" :key="p.name" class="cv-block">
        <h3>{{ p.name }}<template v-if="p.url"> · <a :href="p.url" class="link">{{ p.url.replace(/^https?:\/\//, '').replace(/\/$/, '') }}</a></template></h3>
        <p>{{ p.text }}</p>
      </div>
    </section>

    <section>
      <h2>{{ c.headings.skills }}</h2>
      <ul class="cv-skills">
        <li v-for="s in c.skills" :key="s.group"><strong>{{ s.group }}:</strong> {{ s.items }}</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import { cv, cvPdf, type CvLang } from '~/data/cv'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'id') as CvLang)
const c = computed(() => cv[lang.value])

useHead(() => ({
  title: `${c.value.name} · CV`,
  meta: [{ name: 'description', content: t('cv.meta') }],
}))
</script>

<style scoped>
.cv { max-width: 820px; padding-top: calc(var(--bar-h) + 48px); padding-bottom: 96px; }
.cv-top { display: grid; gap: 14px; padding-bottom: 32px; border-bottom: 1px solid var(--line); }
.cv-name { font-size: var(--t-xl); }
.cv-headline { font-size: var(--t-m); color: var(--text-secondary); }
.cv-contact { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 20px; font-size: var(--t-s); }
.cv-contact span { color: var(--text-secondary); margin-right: 4px; }
.cv-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
section { padding: 28px 0; border-bottom: 1px solid var(--line); }
h2 { font: 800 var(--t-l)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.03em; margin-bottom: 18px; }
h3 { font-size: 1.1rem; font-weight: 700; }
.cv-block + .cv-block { margin-top: 22px; }
.cv-meta { color: var(--text-secondary); font-size: var(--t-s); margin: 4px 0 8px; }
.cv-intro { margin-bottom: 8px; }
ul { padding-left: 1.1rem; display: grid; gap: 6px; }
.cv-skills { list-style: none; padding: 0; }
p { max-width: 68ch; }

/* ATS / print: one column, black on white, no chrome */
@media print {
  @page { size: A4; margin: 16mm 16mm; }
  :global(nav), :global(.skip-link), .no-print { display: none !important; }
  :global(html), :global(body) { background: #fff !important; color: #000 !important; }
  .cv { padding: 0; max-width: none; color: #000; font: 10.5pt/1.45 Arial, Helvetica, sans-serif; }
  .cv-name { font: 700 22pt/1.1 Arial, Helvetica, sans-serif; letter-spacing: 0; }
  .cv-headline { font-size: 12pt; color: #000; }
  .cv-contact { font-size: 9.5pt; }
  .cv-contact span, .cv-meta { color: #333; }
  h2 { font: 700 13pt/1.2 Arial, Helvetica, sans-serif; letter-spacing: 0; margin-bottom: 8px; }
  h3 { font-size: 11pt; }
  section { padding: 12px 0; border-color: #bbb; break-inside: auto; }
  .cv-top { padding-bottom: 12px; border-color: #bbb; }
  .cv-block { break-inside: avoid; }
  .link { color: #000; text-decoration: none; }
  .num { font-family: inherit; letter-spacing: 0; }
  p { max-width: none; }
  .cv-block ul { list-style: disc; }
}
</style>
