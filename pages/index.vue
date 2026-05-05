<template>
  <div>
    <HeroSection />
    <div class="section-divider"></div>
    <DualIdentity />
    <div class="section-divider"></div>
    <SkillsMarquee />
    <div class="section-divider"></div>
    <WorksGrid />
    <div class="section-divider"></div>
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

useHead({
  title: 'Aldi Fahrizaldi — Web Developer × Music Producer',
  meta: [
    { name: 'description', content: 'Crafting digital code & sonic rhythms. Web Developer (Nuxt, Laravel, Tailwind) and Music Producer based in Banjarmasin, Indonesia.' },
  ],
})
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
</style>