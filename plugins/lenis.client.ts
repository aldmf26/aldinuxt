// Lenis smooth scroll for mouse wheels only: phones scroll natively and
// reduced-motion visitors keep the browser's own scrolling.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time: number) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  nuxtApp.provide('lenis', lenis)
})
