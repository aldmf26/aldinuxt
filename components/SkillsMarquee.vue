<template>
  <section ref="container" class="py-10 md:py-16 overflow-hidden border-y border-text-primary/10">
    <!-- Row 1: Left to Right -->
    <div class="relative flex flex-col gap-2">
      <div class="flex animate-marquee-left whitespace-nowrap marquee-row-1">
        <span v-for="n in 6" :key="'r1-' + n" class="flex items-center">
          <span v-for="(item, i) in row1Items" :key="i" class="inline-flex items-center">
            <span class="font-black uppercase tracking-tighter text-marquee text-text-primary">{{ item }}</span>
            <span class="mx-10 text-lime text-marquee">•</span>
          </span>
        </span>
      </div>

      <!-- Row 2: Right to Left -->
      <div class="flex animate-marquee-right whitespace-nowrap marquee-row-2">
        <span v-for="n in 6" :key="'r2-' + n" class="flex items-center">
          <span v-for="(item, i) in row2Items" :key="i" class="inline-flex items-center">
            <span class="font-black italic uppercase tracking-tighter text-marquee text-text-muted">{{ item }}</span>
            <span class="mx-10 text-lime text-marquee">•</span>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'

const row1Items = ['WEB DEVELOPER', 'NUXT JS', 'LARAVEL', 'MYSQL', 'FULL STACK', 'TAILWIND', 'GIT']
const row2Items = ['MUSIC PRODUCER', 'FL STUDIO', 'BEATMAKER', 'SOUND DESIGN', 'BANJARMASIN', 'KALIMANTAN']

const container = ref(null)

onMounted(() => {
  if (typeof window === 'undefined') return
  
  gsap.from('.marquee-row-1', {
    x: -200,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: container.value,
      start: 'top 95%',
    }
  })

  gsap.from('.marquee-row-2', {
    x: 200,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: container.value,
      start: 'top 95%',
    }
  })
})
</script>

<style scoped>
.text-marquee {
  font-size: clamp(48px, 7vw, 96px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.animate-marquee-left {
  animation: marqueeLeft 40s linear infinite;
}

.animate-marquee-right {
  animation: marqueeRight 55s linear infinite;
}

@keyframes marqueeLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marqueeRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
</style>
