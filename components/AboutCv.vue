<template>
  <section id="about" class="about wrap">
    <p class="statement display">{{ $t('about.statement') }}</p>

    <div class="cols">
      <dl class="facts">
        <div v-for="f in facts" :key="f.when">
          <dt class="num">{{ f.when }}</dt>
          <dd>{{ $t(f.key) }}</dd>
        </div>
      </dl>

      <div class="cv">
        <p>{{ $t('about.cvLine') }}</p>
        <div class="btns">
          <a class="btn btn-primary" :href="cvPdf(lang)" download>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6V3zM4 19h16v2H4z" /></svg>
            <span>{{ $t('cv.download') }}</span>
          </a>
          <NuxtLink class="btn" :to="localePath('/cv')"><span>{{ $t('about.cvPage') }}</span></NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { cvPdf, type CvLang } from '~/data/cv'

const { locale } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'id') as CvLang)

// real dates from the CV
const facts = [
  { when: '2017 → 2021', key: 'about.f1' },
  { when: '2020', key: 'about.f2' },
  { when: '2022', key: 'about.f3' },
  { when: 'FL Studio', key: 'about.f4' },
]
</script>

<style scoped>
.about { padding-block: clamp(96px, 16vh, 200px) clamp(64px, 10vh, 120px); display: grid; gap: clamp(40px, 7vw, 96px); }
.statement { font-size: var(--t-xl); max-width: 16ch; line-height: 0.95; }
.cols { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 40px clamp(32px, 6vw, 96px); align-items: start; }
.facts { display: grid; border-top: 1px solid var(--line); }
.facts div { display: grid; grid-template-columns: 9rem 1fr; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--line); }
.facts dt { font-size: var(--t-s); color: var(--accent); }
.facts dd { font-size: var(--t-body); }
.cv { display: grid; gap: 20px; }
.cv p { font-size: var(--t-m); line-height: 1.35; color: var(--text-secondary); }
.btns { display: flex; flex-wrap: wrap; gap: 12px; }
@media (max-width: 760px) {
  .cols { grid-template-columns: 1fr; }
  .facts div { grid-template-columns: 6.5rem 1fr; }
  .btns .btn { flex: 1 1 100%; }
}
</style>
