<template>
  <section id="contact" class="relative py-16 md:py-40 px-6 md:px-16 min-h-[70vh] md:min-h-screen flex items-center overflow-x-hidden">
    <div class="max-w-[1600px] mx-auto w-full">
      <!-- Giant text -->
      <div ref="contactText" class="mb-12">
        <a
          href="mailto:aldimf26@gmail.com?subject=Let's%20Talk!"
          class="block group"
          data-cursor-hover
        >
          <h2 class="font-display italic leading-[0.85] tracking-tight contact-headline text-text-primary group-hover:text-lime transition-colors duration-700">
            <span ref="line1" class="block opacity-0 translate-y-[60px]">LET'S</span>
            <span ref="line2" class="block opacity-0 translate-y-[60px]">TALK.</span>
          </h2>
        </a>
      </div>

      <!-- Email -->
      <div ref="emailRef" class="mb-16 opacity-0">
        <a
          href="mailto:aldimf26@gmail.com"
          class="font-mono text-base md:text-lg text-text-primary/70 hover:text-lime transition-colors link-underline"
          data-cursor-hover
        >
          → aldimf26@gmail.com
        </a>
      </div>

      <!-- Footer / Social Links -->
      <div ref="footerRef" class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-12 border-t border-text-primary/10 opacity-0">
        <div>
          <p class="font-mono text-sm text-text-primary/60">
            © 2025 Fahrizaldi · Crafted with code & rhythm · Banjarmasin 🇮🇩
          </p>
        </div>

        <div class="flex items-center gap-8">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="font-mono text-sm text-text-primary/70 hover:text-lime transition-colors link-underline tracking-wider uppercase"
            data-cursor-hover
          >
            {{ link.name }}
          </a>

          <button
            @click="scrollToTop"
            class="font-mono text-sm text-text-primary/70 hover:text-lime transition-colors tracking-wider uppercase"
            data-cursor-hover
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const line1 = ref(null)
const line2 = ref(null)
const emailRef = ref(null)
const footerRef = ref(null)

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/aldiiimf' },
  { name: 'Github', url: 'https://github.com/aldmf26' },
  { name: 'Youtube', url: 'https://www.youtube.com/@ALdMFbeat' },
]

const scrollToTop = () => {
  const { $lenis } = useNuxtApp()
  if ($lenis) {
    $lenis.scrollTo(0)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  // Giant text reveal
  gsap.to(line1.value, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 90%' },
  })

  gsap.to(line2.value, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 90%' },
  })

  gsap.to(emailRef.value, {
    opacity: 1,
    duration: 0.6,
    delay: 0.3,
    scrollTrigger: { trigger: '#contact', start: 'top 90%' },
  })

  gsap.to(footerRef.value, {
    opacity: 1,
    duration: 0.6,
    delay: 0.4,
    scrollTrigger: { trigger: '#contact', start: 'top 90%' },
  })
})
</script>

<style scoped>
.contact-headline {
  font-size: clamp(80px, 18vw, 280px);
}
</style>
