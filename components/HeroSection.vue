<template>
  <section ref="heroRef" id="hero" class="hero relative overflow-hidden">
    <div class="mx-auto max-w-[1480px] px-5 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-16 lg:px-12">
      <div class="hero-copy relative z-10">
        <div class="mb-8 flex items-center justify-between gap-5 border-b border-[var(--border-strong)] pb-3">
          <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Banjarmasin, Indonesia</p>
          <p class="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] sm:block">{{ $t('hero.availability') }}</p>
        </div>

        <h1 class="max-w-[1300px] font-display text-[clamp(3.4rem,9.5vw,9.6rem)] font-extrabold leading-[0.87] tracking-[-0.075em] text-[var(--text-primary)]">
          {{ $t('hero.line1') }}
          <span class="block">
            {{ $t('hero.line2') }}
            <span class="relative inline-block text-[var(--accent)]">
              {{ $t('hero.accent') }}
              <svg class="absolute -bottom-2 left-0 h-3 w-full text-[var(--accent)]" viewBox="0 0 420 18" fill="none" aria-hidden="true">
                <path d="M2 10C48 2 69 17 110 9C151 1 177 17 218 9C259 1 293 17 335 9C369 3 392 9 418 6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </span>
          </span>
        </h1>

        <div class="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p class="max-w-xl text-base font-medium leading-relaxed text-[var(--text-secondary)] md:col-span-6 md:text-lg">
            {{ $t('hero.intro') }}
          </p>
          <div class="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <a href="#works" class="hero-button hero-button-primary" data-cursor-hover>{{ $t('hero.workCta') }} <span aria-hidden="true">↘</span></a>
            <a href="#music" class="hero-button hero-button-secondary" data-cursor-hover>{{ $t('hero.musicCta') }}</a>
          </div>
        </div>
      </div>

      <div class="tools-heading mt-20 flex items-end justify-between gap-6 md:mt-28">
        <div>
          <p class="font-hand text-xl text-[var(--accent)] md:text-2xl">{{ $t('hero.toolsNote') }}</p>
          <h2 class="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)] md:text-4xl">{{ $t('hero.toolsTitle') }}</h2>
        </div>
        <p class="hidden max-w-xs text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[var(--text-muted)] md:block">
          {{ $t('hero.toolsHelp') }}
        </p>
      </div>

      <div class="tools-grid mt-7 grid gap-4 lg:grid-cols-2 lg:gap-6">
        <article class="tool-card">
          <div class="tool-card-meta"><span>01 / {{ $t('hero.code') }}</span><span>{{ $t('hero.keyboard') }}</span></div>
          <CodeKeyboard />
        </article>
        <article class="tool-card">
          <div class="tool-card-meta"><span>02 / {{ $t('hero.sound') }}</span><span>{{ $t('hero.piano') }}</span></div>
          <PianoVisual />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const heroRef = ref(null)

onMounted(() => {
  const hero = heroRef.value
  if (!hero) return

  const ctx = gsap.context(() => {
    gsap.from('.hero-copy > *', { y: 28, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
  }, hero)

  onUnmounted(() => ctx.revert())
})
</script>

<style scoped>
.hero {
  min-height: 100dvh;
  background: radial-gradient(circle at 80% 14%, rgba(var(--accent-rgb), 0.10), transparent 24rem), var(--bg-primary);
}
.hero-button {
  display: inline-flex; align-items: center; justify-content: center; gap: .75rem;
  min-height: 3.25rem; border-radius: 9999px; padding: .75rem 1.35rem;
  font-family: var(--font-body); font-size: .86rem; font-weight: 750;
  transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
}
.hero-button:hover { transform: translateY(-2px); }
.hero-button:active { transform: translateY(1px) scale(.98); }
.hero-button-primary { background: var(--accent); color: var(--bg-primary); }
.hero-button-secondary { border: 1px solid var(--border-strong); background: var(--bg-surface); color: var(--text-primary); }
.tool-card {
  overflow: hidden; border: 1px solid var(--border-strong); border-radius: 2rem;
  background: var(--bg-surface); padding: .8rem;
}
.tool-card-meta {
  display: flex; justify-content: space-between; gap: 1rem; padding: .3rem .55rem .9rem;
  font-family: var(--font-mono); font-size: .58rem; letter-spacing: .15em;
  text-transform: uppercase; color: var(--text-secondary);
}
.tool-card :deep(.kb-shell), .tool-card :deep(.piano-shell) {
  max-width: none; border-radius: 1.35rem; border-color: var(--border); box-shadow: none;
}
@media (prefers-reduced-motion: reduce) { .hero-button { transition: none; } }
</style>
