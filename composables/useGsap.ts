// useGsap — GSAP context management for page-level animations
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useGsap = () => {
  const ctx = ref<gsap.Context | null>(null)

  const createContext = (scope?: Element | string) => {
    ctx.value = gsap.context(() => {}, scope)
    return ctx.value
  }

  const addAnimation = (fn: () => void) => {
    if (ctx.value) {
      ctx.value.add(fn)
    }
  }

  // Split text into spans for animation (replaces SplitText club plugin)
  const splitText = (element: Element, type: 'words' | 'chars' | 'lines' = 'words') => {
    const text = element.textContent || ''
    element.setAttribute('aria-label', text)

    if (type === 'chars') {
      const chars = text.split('')
      element.innerHTML = chars
        .map((c) => `<span class="inline-block" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('')
      return Array.from(element.children) as HTMLElement[]
    }

    if (type === 'words') {
      const words = text.split(/\s+/).filter(Boolean)
      element.innerHTML = words
        .map((w) => `<span class="inline-block" style="display:inline-block; overflow:hidden"><span class="inline-block" style="display:inline-block">${w}</span></span>`)
        .join(' ')
      // Return the inner spans (the ones that animate)
      return Array.from(element.querySelectorAll('span > span')) as HTMLElement[]
    }

    return []
  }

  // Animate elements entering viewport
  const animateOnScroll = (
    elements: Element | Element[] | NodeListOf<Element>,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    triggerElement?: Element
  ) => {
    const els = elements instanceof NodeList ? Array.from(elements) : Array.isArray(elements) ? elements : [elements]
    const trigger = triggerElement || els[0]

    gsap.from(els, {
      ...fromVars,
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        ...toVars.scrollTrigger as object,
      },
      ...toVars,
    })
  }

  const cleanup = () => {
    if (ctx.value) {
      ctx.value.revert()
      ctx.value = null
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    gsap,
    ScrollTrigger,
    ctx,
    createContext,
    addAnimation,
    splitText,
    animateOnScroll,
    cleanup,
  }
}