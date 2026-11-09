<template>
  <section id="hero" class="hero">
    <h1 class="hero-name">Aldi<br>Fahrizaldi</h1>
    <p class="hero-line">
      <b>{{ side === 'dev' ? $t('hero.roleDev') : $t('hero.roleProducer') }}</b>
      {{ side === 'dev' ? $t('hero.lineDev') : $t('hero.lineProducer') }}
    </p>

    <DuoDevice />

    <div class="hero-controls">
      <div class="side-switch" role="group" :aria-label="$t('hero.sideLabel')">
        <button
          v-for="s in (['dev', 'producer'] as const)"
          :key="s"
          type="button"
          :aria-pressed="side === s"
          @click="setSide(s, $event)"
        >
          {{ s === 'dev' ? $t('hero.sideDev') : $t('hero.sideProducer') }}
        </button>
      </div>
      <div class="hero-cta">
        <a class="btn btn-primary" :href="side === 'dev' ? '#works' : '#music'">
          {{ side === 'dev' ? $t('hero.workCta') : $t('hero.musicCta') }}
        </a>
        <a class="btn btn-ghost" :href="waLink" target="_blank" rel="noopener">{{ $t('contact.whatsapp') }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { side, setSide } = useSide()
const waLink = 'https://wa.me/6289541311053'
</script>

<style scoped>
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 76px 16px 32px;
}
.hero-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.25rem, min(10vw, 11svh), 6rem);
  line-height: 0.86;
  letter-spacing: -0.04em;
  text-wrap: balance;
}
.hero-line {
  margin-top: 14px;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  color: var(--text-muted);
}
.hero-line b { color: var(--text-primary); font-weight: 600; }
.hero :deep(.duo-stage) { margin-top: 4px; }
.hero-controls { margin-top: 8px; }
.side-switch {
  display: inline-flex;
  padding: 5px;
  border-radius: 999px;
  background: var(--bg-elevated);
}
.side-switch button {
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font: 600 1.05rem var(--font-body);
  padding: 12px 22px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s;
}
.side-switch button:hover { color: var(--text-primary); }
.side-switch button[aria-pressed='true'] { background: var(--text-primary); color: var(--bg-primary); }
.hero-cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 18px;
}
</style>
