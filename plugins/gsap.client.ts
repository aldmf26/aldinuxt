// GSAP Client Plugin — Register all plugins client-side only
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)

    // Global GSAP defaults for the DARK SIGNAL aesthetic
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    })

    // ScrollTrigger global config
    ScrollTrigger.config({
      ignoreMobileResize: true,
    })
  }
})