/**
 * audioUnlock.client.ts
 * Nuxt client-only plugin: Registers global audio unlock listeners
 * after hydration is complete. This guarantees Web Audio API works
 * on Vercel SSR deployments where module-level window access fails.
 *
 * The `.client.ts` suffix ensures this NEVER runs on the server.
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  let isSetup = false

  const setup = async () => {
    if (isSetup) return
    isSetup = true

    try {
      // Dynamically import to avoid any SSR evaluation of Web Audio API code
      const { unlockMobileAudio } = await import('~/utils/producerAudio')

      const onInteraction = () => {
        unlockMobileAudio()
      }

      window.addEventListener('touchstart', onInteraction, { passive: true })
      window.addEventListener('touchend', onInteraction, { passive: true })
      window.addEventListener('pointerdown', onInteraction, { passive: true })
      window.addEventListener('click', onInteraction, { passive: true })
      window.addEventListener('keydown', onInteraction, { passive: true })
    } catch (e) {
      // Audio not available — silent fail
    }
  }

  // Run after first user interaction OR after a short delay as fallback
  const earlyEvents = ['touchstart', 'pointerdown', 'keydown', 'click']
  earlyEvents.forEach(evt => {
    window.addEventListener(evt, setup, { passive: true, once: true })
  })

  // Fallback: also try after Nuxt app is fully mounted
  if (document.readyState === 'complete') {
    setup()
  } else {
    window.addEventListener('load', setup, { once: true })
  }
})

