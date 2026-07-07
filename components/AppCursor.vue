<template>
  <div class="hidden md:block" aria-hidden="true">
    <!-- Crosshair cursor center -->
    <div ref="cursorEl" class="cursor-crosshair">
      <span class="ch-h" />
      <span class="ch-v" />
      <span class="ch-dot" />
    </div>
    <!-- Particle container -->
    <teleport to="body">
      <div ref="particleRoot" class="cursor-particle-root" />
    </teleport>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'

const cursorEl = ref(null)
const particleRoot = ref(null)

// Pool of symbols: music notes + code tokens
const SYMBOLS = [
  '♪', '♫', '♬', '♩',
  '{}', '/>', 'fn', 'const',
  '=>', '[ ]', '🎹', '🎵',
  '<!', '.ts', '()', ';;',
]

let mouseX = 0, mouseY = 0
let lastSpawnTime = 0
let particleCount = 0
const MAX_PARTICLES = 28

function spawnParticle(x, y) {
  if (!particleRoot.value) return
  if (particleCount >= MAX_PARTICLES) return

  const el = document.createElement('span')
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  el.textContent = symbol
  el.className = 'cur-particle'

  // Random direction burst
  const angle = Math.random() * Math.PI * 2
  const dist = 40 + Math.random() * 60
  const dx = Math.cos(angle) * dist
  const dy = Math.sin(angle) * dist - 30 // slight upward bias

  // Random size & color between accent/music-orange
  const colors = ['#a78bfa', '#f59e0b', '#22d3ee', '#fb923c', '#4ade80']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const size = 10 + Math.random() * 8

  el.style.cssText = `
    left:${x}px; top:${y}px;
    font-size:${size}px; color:${color};
    --dx:${dx}px; --dy:${dy}px;
  `

  particleRoot.value.appendChild(el)
  particleCount++

  // Remove after animation ends (~700ms)
  setTimeout(() => {
    el.remove()
    particleCount--
  }, 750)
}

let xTo = null
let yTo = null

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY

  if (xTo && yTo) {
    xTo(mouseX)
    yTo(mouseY)
  }

  // Throttle particle spawning (~30fps)
  const now = performance.now()
  if (now - lastSpawnTime > 60) {
    lastSpawnTime = now
    spawnParticle(mouseX, mouseY)
  }
}

const onClick = (e) => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnParticle(e.clientX, e.clientY), i * 30)
  }
}

const onMouseOver = (e) => {
  const target = e.target?.closest?.('a, button, [data-cursor-hover]')
  if (target && cursorEl.value) {
    gsap.to(cursorEl.value, { scale: 1.6, duration: 0.2, overwrite: 'auto' })
    cursorEl.value.classList.add('is-hovering')
  }
}

const onMouseOut = (e) => {
  const target = e.target?.closest?.('a, button, [data-cursor-hover]')
  if (target && cursorEl.value) {
    const related = e.relatedTarget?.closest?.('a, button, [data-cursor-hover]')
    if (!related) {
      gsap.to(cursorEl.value, { scale: 1, duration: 0.2, overwrite: 'auto' })
      cursorEl.value.classList.remove('is-hovering')
    }
  }
}

onMounted(() => {
  // Hide default OS cursor on desktop
  document.body.style.cursor = 'none'

  if (cursorEl.value) {
    gsap.set(cursorEl.value, { xPercent: -50, yPercent: -50 })
    xTo = gsap.quickTo(cursorEl.value, 'x', { duration: 0.08, ease: 'power3.out' })
    yTo = gsap.quickTo(cursorEl.value, 'y', { duration: 0.08, ease: 'power3.out' })
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', onClick)
  document.addEventListener('mouseover', onMouseOver)
  document.addEventListener('mouseout', onMouseOut)
})

onBeforeUnmount(() => {
  document.body.style.cursor = ''
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('click', onClick)
  document.removeEventListener('mouseover', onMouseOver)
  document.removeEventListener('mouseout', onMouseOut)
})
</script>

<style>
/* ── Crosshair cursor ── */
.cursor-crosshair {
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
}
.cursor-crosshair.is-hovering .ch-dot {
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}

/* Horizontal arm */
.ch-h {
  position: absolute;
  top: 50%; left: 0;
  width: 100%; height: 1.5px;
  background: var(--accent);
  transform: translateY(-50%);
}
/* Vertical arm */
.ch-v {
  position: absolute;
  left: 50%; top: 0;
  width: 1.5px; height: 100%;
  background: var(--accent);
  transform: translateX(-50%);
}
/* Center dot */
.ch-dot {
  position: absolute;
  top: 50%; left: 50%;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  transition: background 0.2s, box-shadow 0.2s;
}

/* Gap in the center so it looks like a proper crosshair */
.cursor-crosshair::before, .cursor-crosshair::after {
  content: '';
  position: absolute;
  background: var(--bg-primary, #0a0a0f);
  z-index: 1;
}
.cursor-crosshair::before {
  top: 50%; left: 50%;
  width: 8px; height: 8px;
  transform: translate(-50%, -50%);
}

/* ── Particle root ── */
.cursor-particle-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99998;
  overflow: hidden;
}

/* ── Individual particle ── */
.cur-particle {
  position: absolute;
  pointer-events: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  user-select: none;
  animation: particle-burst 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
  }
  60% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.3);
  }
}

/* Hide native cursor everywhere on desktop */
@media (pointer: fine) {
  *, *::before, *::after { cursor: none !important; }
}
</style>
