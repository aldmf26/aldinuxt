<template>
  <div>
    <HeroSection />
    <div class="section-divider"></div>
    <DualIdentity />
    <div class="section-divider"></div>
    <SkillsMarquee />
    <div class="section-divider"></div>
    <!-- Core Expertise -->
    <section class="py-24 md:py-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span class="section-label block mb-6">CORE EXPERTISE</span>
        <p class="text-xl md:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          5 years across full-stack development, systems design, network infrastructure, and music production.
        </p>
      </div>
      <OrbitSkills />
    </section>
    <div class="section-divider"></div>
    <WorksGrid />
    <div class="section-divider relative flex items-center justify-center my-0 h-12">
      <span class="section-divider-label">◈ &nbsp; studio switch &nbsp; ◈</span>
    </div>
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
  title: 'Aldi Fahrizaldi — Full-Stack Developer & Beat Producer',
  meta: [
    { name: 'description', content: 'Full-stack developer (Nuxt, Laravel, Tailwind) and beat producer (FL Studio) based in Banjarmasin, Indonesia. Building web apps and producing beats since 2020.' },
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
