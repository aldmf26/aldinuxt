<template>
  <div>
    <div ref="cursorDot" class="custom-cursor hidden md:block"></div>
    <div ref="cursorTrail" class="custom-cursor-trail hidden md:block"></div>
  </div>
</template>

<script setup>
const cursorDot = ref(null)
const cursorTrail = ref(null)

let mouseX = 0
let mouseY = 0
let trailX = 0
let trailY = 0

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const onMouseEnterInteractive = () => {
  if (cursorTrail.value) {
    cursorTrail.value.classList.add('hovering')
  }
}

const onMouseLeaveInteractive = () => {
  if (cursorTrail.value) {
    cursorTrail.value.classList.remove('hovering')
  }
}

const animate = () => {
  if (cursorDot.value) {
    cursorDot.value.style.left = mouseX + 'px'
    cursorDot.value.style.top = mouseY + 'px'
  }

  // Trailing with lerp
  trailX += (mouseX - trailX) * 0.15
  trailY += (mouseY - trailY) * 0.15

  if (cursorTrail.value) {
    cursorTrail.value.style.left = trailX + 'px'
    cursorTrail.value.style.top = trailY + 'px'
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  // Detect interactive elements
  const addHoverListeners = () => {
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive)
      el.addEventListener('mouseleave', onMouseLeaveInteractive)
    })
  }

  // Re-check for new elements periodically
  addHoverListeners()
  const observer = new MutationObserver(addHoverListeners)
  observer.observe(document.body, { childList: true, subtree: true })

  animate()
})
</script>
