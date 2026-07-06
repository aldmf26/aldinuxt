<template>
  <section
    ref="heroRef"
    id="hero"
    class="relative min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    style="min-height: 100dvh"
  >
    <div class="parallax-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 will-change-transform"></div>

    <div class="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <!-- <div class="hero-kicker shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-primary)]/45">
        Banjarmasin&nbsp;&nbsp;/&nbsp;&nbsp;Code &amp;&nbsp;Beats&nbsp;&nbsp;/&nbsp;&nbsp;Est.&nbsp;2020
      </div> -->

      <h1 class="sr-only">Aldi Fahrizaldi — Web Developer & Music Producer</h1>

      <div class="flex min-h-0 flex-col py-4 lg:flex-1 lg:justify-center lg:py-6">
        <div class="mx-auto grid w-full max-w-[1400px] items-center gap-4 lg:grid-cols-2 lg:gap-12">
          <div ref="codePanel" class="parallax-code flex flex-col items-center gap-2 will-change-transform">
            <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]/60">code</div>
            <CodeKeyboard />
          </div>

          <div ref="musicPanel" class="parallax-music flex flex-col items-center gap-2 will-change-transform">
            <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent-dim)]/60">music</div>
            <PianoVisual />
          </div>
        </div>
      </div>

      <div ref="headlineRef" class="mx-auto w-full max-w-[1400px] shrink-0 pb-8 lg:pb-10">
        <p class="hero-headline font-display text-[clamp(32px,7vw,110px)] font-black leading-[0.9] tracking-[-0.06em] text-[var(--text-primary)]" aria-hidden="true">
          <span class="hero-word block">I build</span>
          <span class="hero-word block">
            <span class="text-[var(--accent)]">websites</span>
            <span class="text-[var(--text-primary)]/70 mx-4 inline-block" style="font-size: 0.5em; vertical-align: middle;">&</span>
            <span class="italic text-[var(--accent-dim)]">beats.</span>
          </span>
        </p>

        <div class="hero-cta mt-4 flex flex-wrap items-center gap-3 sm:mt-6">
          <a
            href="#works"
            class="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent)]/20 transition hover:-translate-y-0.5 hover:brightness-110"
            data-cursor-hover
          >
            View Projects
            <span aria-hidden="true">-></span>
          </a>
          <a
            href="#music"
            class="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]/80 transition hover:-translate-y-0.5 hover:bg-[var(--bg-elevated)]"
            data-cursor-hover
          >
            Listen Beats
          </a>
        </div>
      </div>
    </div>

    <div ref="scrollIndicator" class="scroll-indicator pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--text-primary)]/25">
      scroll
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroRef = ref(null)
const codePanel = ref(null)
const musicPanel = ref(null)
const headlineRef = ref(null)
const scrollIndicator = ref(null)

onMounted(() => {
  const hero = heroRef.value
  if (!hero) return

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      gsap.to('.parallax-grid', {
        y: '18%',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      gsap.to(codePanel.value, {
        x: '-3vw',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      gsap.to(musicPanel.value, {
        x: '3vw',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      gsap.to(hero.querySelector('.hero-headline'), {
        y: '-6vh',
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom 50%',
          scrub: 2,
        },
      })

      gsap.to('.hero-cta', {
        y: '-3vh',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom 60%',
          scrub: 2,
        },
      })
    })

    gsap.to(scrollIndicator.value, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom 70%',
        scrub: true,
      },
    })
  }, hero)
})
</script>

<style scoped>
.hero-word,
.hero-cta,
.hero-kicker {
  animation: heroRise 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-word:nth-child(1) { animation-delay: 0.12s; }
.hero-word:nth-child(2) { animation-delay: 0.32s; }
.hero-kicker { animation-delay: 0.05s; }
.hero-cta { animation-delay: 0.6s; }

.scroll-indicator {
  animation: fadeIn 1.5s ease 1.5s both;
}

@keyframes heroRise {
  from {
    opacity: 0;
    transform: translateY(28px);
    filter: blur(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-word,
  .hero-cta,
  .hero-kicker {
    animation: none;
  }
  .parallax-grid,
  .parallax-code,
  .parallax-music {
    will-change: auto;
  }
}
</style>
