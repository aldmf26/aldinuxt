<template>
  <div class="hidden md:block">
    <!-- Dot: snaps to mouse instantly -->
    <div ref="dot" class="cursor-dot" />
    <!-- Circle: follows with lerp delay -->
    <div ref="ring" class="cursor-ring" />
  </div>
</template>

<script setup>
const dot = ref(null)
const ring = ref(null)
let mouseX = 0, mouseY = 0
let ringX = 0, ringY = 0

onMounted(() => {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    if (dot.value) {
      dot.value.style.left = mouseX + 'px'
      dot.value.style.top = mouseY + 'px'
    }
  })

  // Hover detection
  const addHoverListeners = () => {
    document.querySelectorAll('a, button, [data-cursor-hover], .group').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.value?.classList.add('is-hovering')
        dot.value?.classList.add('is-hovering')
      })
      el.addEventListener('mouseleave', () => {
        ring.value?.classList.remove('is-hovering')
        dot.value?.classList.remove('is-hovering')
      })
    })
  }

  addHoverListeners()
  const observer = new MutationObserver(addHoverListeners)
  observer.observe(document.body, { childList: true, subtree: true })

  // Lerp loop for ring
  function lerp(a, b, t) { return a + (b - a) * t }
  function loop() {
    if (ring.value) {
      ringX = lerp(ringX, mouseX, 0.1)
      ringY = lerp(ringY, mouseY, 0.1)
      ring.value.style.left = ringX + 'px'
      ring.value.style.top = ringY + 'px'
    }
    requestAnimationFrame(loop)
  }
  loop()
})
</script>

<style>
.cursor-dot {
  position: fixed; pointer-events: none; z-index: 99999;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s, opacity 0.2s;
}
.cursor-ring {
  position: fixed; pointer-events: none; z-index: 99998;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1.5px solid var(--accent);
  transform: translate(-50%, -50%);
  opacity: 0.6;
  transition: width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s, background 0.3s;
}
/* Hover state on links/buttons/cards */
.cursor-ring.is-hovering {
  width: 64px; height: 64px; opacity: 1;
  mix-blend-mode: difference;
  background: var(--accent);
  border-color: transparent;
}
.cursor-dot.is-hovering { opacity: 0; }
</style>
