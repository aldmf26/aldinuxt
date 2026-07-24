<template>
  <div>
    <HeroSection />
    <div class="section-divider"></div>
    <DualIdentity />
    <!-- <div class="section-divider"></div>
    <SkillsMarquee /> -->
    <div class="section-divider"></div>
    <WorksGrid />
    <div class="section-divider relative my-0"></div>
    <MusicSection />
    <div class="section-divider"></div>
    <AboutSection />
    <div class="section-divider"></div>
    <ContactSection />
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

onMounted(() => {
  // Animate dividers on scroll
  document.querySelectorAll('.section-divider').forEach(el => {
    gsap.fromTo(el, 
      { scaleX: 0, opacity: 0 },
      { 
        scaleX: 1, 
        opacity: 0.15, 
        duration: 1.5, 
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
        }
      }
    )
  })
})

const { t, locale } = useI18n()
useHead(() => ({
  title: t('meta.homeTitle'),
  htmlAttrs: { lang: locale.value },
  meta: [{ name: 'description', content: t('meta.homeDescription') }],
}))
</script>

<style scoped>
.section-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right, 
    transparent 0%, 
    var(--accent) 20%, 
    var(--accent) 80%, 
    transparent 100%
  );
  opacity: 0;
  margin: 0;
  transform-origin: center;
}

.section-divider-label {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: var(--bg-primary);
  padding: 0 16px;
  white-space: nowrap;
  opacity: 0.4;
  z-index: 1;
}

.section-divider:not(:has(.section-divider-label)) .section-divider-label {
  display: none;
}
</style>
