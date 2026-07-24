<template>
  <section id="contact" class="relative py-32 md:py-64 px-6 md:px-16 min-h-screen flex flex-col justify-end overflow-hidden">
    <!-- Background Ghost Word -->
    <div class="absolute top-20 left-0 z-0 pointer-events-none select-none opacity-[0.03] text-text-muted font-black tracking-tighter leading-none ghost-hello">
      {{ $t('contact.label') }}
    </div>

    <div class="max-w-[1800px] mx-auto w-full relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 items-end">
        <!-- Giant Editorial Headline -->
        <div ref="headlineRef">
          <span class="section-label block mb-12">{{ $t('contact.label') }}</span>
          <a
            href="mailto:aldimf26@gmail.com?subject=Let's%20Talk!"
            class="group block transition-colors duration-500"
            data-cursor-hover
          >
            <h2 class="font-display font-black leading-[0.8] tracking-tighter text-text-primary group-hover:text-lime transition-colors duration-700 contact-title">
              {{ $t('contact.title') }} <br/>
              {{ $t('contact.accent') }}
            </h2>
          </a>
        </div>

        <!-- Contact Details -->
        <div ref="detailsRef" class="space-y-16 pb-10">
           <div class="space-y-4">
              <span class="font-mono text-[10px] text-text-secondary/70 uppercase tracking-[0.3em] block">{{ $t('contact.emailLabel') }}</span>
              <a 
                href="mailto:aldimf26@gmail.com" 
                class="font-mono text-xl md:text-2xl text-text-primary hover:text-lime transition-colors border-b border-[var(--border)] pb-2 inline-block"
                data-cursor-hover
              >
                → aldimf26@gmail.com
              </a>
              <a 
                href="https://wa.me/6289541311053" 
                target="_blank"
                class="font-mono text-xl md:text-2xl text-text-primary hover:text-lime transition-colors border-b border-[var(--border)] pb-2 flex items-center gap-4 mt-4"
                data-cursor-hover
              >
                → +62 895-413111-053
              </a>
           </div>

           <div class="grid grid-cols-2 gap-12">
              <div class="space-y-4">
                 <span class="font-mono text-[10px] text-text-primary/40 uppercase tracking-[0.3em] block">{{ $t('contact.social') }}</span>
                 <ul class="space-y-3">
                   <li v-for="social in socialLinks" :key="social.name">
                     <a
                        :href="social.url"
                        target="_blank"
                        class="font-mono text-xs uppercase tracking-widest text-text-primary/60 hover:text-lime transition-colors flex items-center gap-2"
                        data-cursor-hover
                      >
                       <i :class="getSocialIcon(social.url)" class="text-lg"></i>
                       {{ social.name }}
                     </a>
                   </li>
                 </ul>
              </div>
              <div class="space-y-4">
                 <span class="font-mono text-[10px] text-text-primary/40 uppercase tracking-[0.3em] block">{{ $t('contact.location') }}</span>
                 <p class="font-mono text-xs text-text-primary/60 uppercase tracking-widest leading-relaxed">
                   Banjarmasin, ID <br/>
                   {{ localTime }}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-32 pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-center md:text-left">
          <p class="font-mono text-[10px] text-text-primary/30 uppercase tracking-[0.2em]">
            © 2025 Muhammad Fahrizaldi · Banjarmasin, Indonesia
          </p>
          <p class="font-mono text-[8px] text-text-primary/20 uppercase tracking-[0.3em] mt-2">
            Code &amp; Beats · One Human, Two Obsessions
          </p>
        </div>
        <button 
          @click="scrollToTop"
          class="font-mono text-[10px] text-lime uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
          data-cursor-hover
        >
          {{ $t('contact.backTop') }} ↑
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const headlineRef = ref(null)
const detailsRef = ref(null)
const localTime = ref('')

const socialLinks = [
  { name: '@aldiiimf', url: 'https://www.instagram.com/aldiiimf' },
  { name: 'aldmf26', url: 'https://github.com/aldmf26' },
  { name: '@ALdMFbeat', url: 'https://www.youtube.com/@ALdMFbeat' },
]

const updateTime = () => {
  const now = new Date()
  localTime.value = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZoneName: 'short' 
  })
}

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getSocialIcon = (url) => {
  const u = url.toLowerCase()
  if (u.includes('instagram.com')) return 'ri-instagram-line'
  if (u.includes('github.com')) return 'ri-github-line'
  if (u.includes('youtube.com')) return 'ri-youtube-line'
  return 'ri-share-line'
}

onMounted(() => {
  if (typeof window === 'undefined') return
  updateTime()
  setInterval(updateTime, 60000)

  gsap.fromTo(
    headlineRef.value,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headlineRef.value,
        start: 'top 90%',
        once: true,
      },
    }
  )

  gsap.fromTo(
    detailsRef.value,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: detailsRef.value,
        start: 'top 90%',
        once: true,
      },
    }
  )
})
</script>

<style scoped>
.contact-title {
  font-size: clamp(80px, 15vw, 220px);
}
.ghost-hello {
  font-size: clamp(120px, 20vw, 300px);
}
</style>
