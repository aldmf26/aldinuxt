<template>
  <div
    ref="kbRef"
    class="kb-shell relative mx-auto w-full max-w-3xl rounded-[28px] border border-[var(--border)] bg-[var(--bg-surface)] p-3 shadow-2xl shadow-black/30 sm:p-4"
    @mousemove="onMove"
    @mouseleave="hoveredKey = null"
  >
    <div class="absolute inset-x-8 -top-8 h-16 rounded-full bg-[var(--accent)]/10 blur-3xl"></div>
    <div
      class="pointer-events-none absolute inset-0 rounded-[28px] opacity-70"
      :style="spotlightStyle"
    ></div>

    <div class="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-surface)] pb-3 sm:pb-4">
      <div class="absolute left-0 right-0 top-0 z-20 flex h-4 items-center gap-2 border-b border-[var(--border)] bg-[var(--text-primary)]/[0.03] px-4">
        <span class="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-[var(--accent-dim)]"></span>
        <span class="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--text-primary)]/40">code keys</span>
      </div>

      <div class="relative mt-5 h-10 overflow-hidden sm:h-12 md:h-14">
        <span
          v-for="s in codeSymbols"
          :key="s.id"
          class="code-symbol absolute bottom-0 font-mono text-xs font-bold sm:text-sm md:text-base"
          :style="{
            left: s.left,
            animationDelay: s.delay,
            color: s.color,
            textShadow: `0 0 18px ${s.color}`,
          }"
        >{{ s.char }}</span>
      </div>

      <div class="mt-1 space-y-[3px] px-2 sm:px-3 sm:space-y-[4px]">
        <div
          v-for="(row, ri) in keyboardRows"
          :key="ri"
          class="flex gap-[3px] sm:gap-[4px]"
        >
          <button
            v-for="key in row"
            :key="key.id"
            class="keycap relative rounded-[3px] border border-black/35 pt-[3px] text-[8px] font-bold leading-none text-white/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] transition-all duration-150 sm:text-[10px]"
            :class="{ 'is-active': activeKeys.includes(key.id) }"
            :style="{ flex: key.w }"
            @mouseenter="hoveredKey = key.id"
            data-cursor-hover
          >
            <span
              class="flex h-full w-full items-center justify-center rounded-[2px] bg-gradient-to-b from-zinc-400 to-zinc-500 pb-[1px]"
            >
              {{ key.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const kbRef = ref(null)
const hoveredKey = ref(null)
const activeKeys = ref(['c', 'o', 'n', 's', 't'])
const mouse = reactive({ x: 50, y: 50 })

const codeSymbols = [
  { id: 1, char: '{ }', left: '8%', delay: '0s', color: '#c084fc' },
  { id: 2, char: '</>', left: '22%', delay: '0.8s', color: '#67e8f9' },
  { id: 3, char: '=>', left: '44%', delay: '1.4s', color: '#fb923c' },
  { id: 4, char: 'fn', left: '62%', delay: '0.35s', color: '#a78bfa' },
  { id: 5, char: '()', left: '80%', delay: '1.1s', color: '#fbbf24' },
]

const keyboardRows = [
  [
    { id: 'esc', label: 'esc', w: 1.5 },
    { id: 'grave', label: '` ~', w: 1 },
    { id: '1', label: '1', w: 1 },
    { id: '2', label: '2', w: 1 },
    { id: '3', label: '3', w: 1 },
    { id: '4', label: '4', w: 1 },
    { id: '5', label: '5', w: 1 },
    { id: '6', label: '6', w: 1 },
    { id: '7', label: '7', w: 1 },
    { id: '8', label: '8', w: 1 },
    { id: '9', label: '9', w: 1 },
    { id: '0', label: '0', w: 1 },
    { id: 'minus', label: '-', w: 1 },
    { id: 'equals', label: '=', w: 1 },
    { id: 'bksp', label: '⌫', w: 1.5 },
  ],
  [
    { id: 'tab', label: 'Tab', w: 1.5 },
    { id: 'q', label: 'Q', w: 1 },
    { id: 'w', label: 'W', w: 1 },
    { id: 'e', label: 'E', w: 1 },
    { id: 'r', label: 'R', w: 1 },
    { id: 't', label: 'T', w: 1 },
    { id: 'y', label: 'Y', w: 1 },
    { id: 'u', label: 'U', w: 1 },
    { id: 'i', label: 'I', w: 1 },
    { id: 'o', label: 'O', w: 1 },
    { id: 'p', label: 'P', w: 1 },
    { id: 'lbracket', label: '[', w: 1 },
    { id: 'rbracket', label: ']', w: 1 },
    { id: 'bslash', label: '\\', w: 1.5 },
  ],
  [
    { id: 'caps', label: 'Caps', w: 1.75 },
    { id: 'a', label: 'A', w: 1 },
    { id: 's', label: 'S', w: 1 },
    { id: 'd', label: 'D', w: 1 },
    { id: 'f', label: 'F', w: 1 },
    { id: 'g', label: 'G', w: 1 },
    { id: 'h', label: 'H', w: 1 },
    { id: 'j', label: 'J', w: 1 },
    { id: 'k', label: 'K', w: 1 },
    { id: 'l', label: 'L', w: 1 },
    { id: 'semicolon', label: ';', w: 1 },
    { id: 'quote', label: "'", w: 1 },
    { id: 'enter', label: '↵', w: 2.25 },
  ],
  [
    { id: 'lshift', label: '⇧', w: 2.25 },
    { id: 'z', label: 'Z', w: 1 },
    { id: 'x', label: 'X', w: 1 },
    { id: 'c', label: 'C', w: 1 },
    { id: 'v', label: 'V', w: 1 },
    { id: 'b', label: 'B', w: 1 },
    { id: 'n', label: 'N', w: 1 },
    { id: 'm', label: 'M', w: 1 },
    { id: 'comma', label: ',', w: 1 },
    { id: 'dot', label: '.', w: 1 },
    { id: 'slash', label: '/', w: 1 },
    { id: 'rshift', label: '⇧', w: 2.75 },
  ],
  [
    { id: 'lctrl', label: 'Ctrl', w: 1.25 },
    { id: 'lmeta', label: '⌘', w: 1.25 },
    { id: 'lalt', label: 'Alt', w: 1.25 },
    { id: 'space', label: '', w: 7.5 },
    { id: 'ralt', label: 'Alt', w: 1.25 },
    { id: 'fn', label: 'Fn', w: 1.25 },
    { id: 'rctrl', label: 'Ctrl', w: 1.25 },
  ],
]

const spotlightStyle = computed(() => ({
  background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, var(--border-accent), transparent 48%)`,
}))

let intervalId
let scatterCtx

function onMove(event) {
  const rect = kbRef.value?.getBoundingClientRect()
  if (!rect) return
  mouse.x = ((event.clientX - rect.left) / rect.width) * 100
  mouse.y = ((event.clientY - rect.top) / rect.height) * 100
}

/**
 * Compute per-element scatter offsets weighted by distance from container center.
 * Called once on mount — values stay stable across re-renders for scrub reversibility.
 */
function computeScatterOffsets(elements, container) {
  const cRect = container.getBoundingClientRect()
  const cx = cRect.width / 2
  const cy = cRect.height / 2
  const maxDist = Math.sqrt(cx * cx + cy * cy)

  return Array.from(elements).map((el) => {
    const eRect = el.getBoundingClientRect()
    const elCx = eRect.left - cRect.left + eRect.width / 2
    const elCy = eRect.top - cRect.top + eRect.height / 2

    const dx = elCx - cx
    const dy = elCy - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const norm = Math.min(dist / maxDist, 1) // 0 = center, 1 = corner

    // Push away from center with added randomness
    const angle = Math.atan2(dy, dx)
    const spread = 150 + norm * 250
    const randomAngle = angle + (Math.random() - 0.5) * 1.2

    return {
      x: Math.cos(randomAngle) * spread * (0.5 + norm),
      y: Math.sin(randomAngle) * spread * (0.5 + norm) + 100,
      rotation: (Math.random() - 0.5) * 50 * (0.5 + norm),
    }
  })
}

onMounted(() => {
  // --- Existing: key highlight cycling ---
  const patterns = [
    ['c', 'o', 'n', 's', 't'],
    ['n', 'p', 'm', 'space', 'd', 'e', 'v'],
    ['g', 'i', 't', 'space', 'p', 'u', 's', 'h'],
    ['f', 'n', '9', '0', 'space', 'lbracket', 'rbracket'],
  ]
  let step = 0
  intervalId = window.setInterval(() => {
    step = (step + 1) % patterns.length
    activeKeys.value = patterns[step]
  }, 620)

  // --- Scatter/disperse on scroll ---
  const shell = kbRef.value
  if (!shell) return

  const keycaps = shell.querySelectorAll('.keycap')
  if (!keycaps.length) return

  const offsets = computeScatterOffsets(keycaps, shell)

  scatterCtx = gsap.context(() => {
    const mm = gsap.matchMedia()

    // Desktop: full scatter with transforms
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      keycaps.forEach((cap, i) => {
        tl.to(cap, {
          x: offsets[i].x,
          y: offsets[i].y,
          rotation: offsets[i].rotation,
          opacity: 0,
          pointerEvents: 'none',
          ease: 'none',
        }, i * 0.03)
      })
    })

    // Reduced motion: opacity-only fade, no transforms
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.to(keycaps, {
        opacity: 0,
        pointerEvents: 'none',
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
  }, shell)
})

onUnmounted(() => {
  if (intervalId) window.clearInterval(intervalId)
  if (scatterCtx) scatterCtx.revert()
})
</script>

<style scoped>
.kb-shell {
  animation: kbIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}

.keycap {
  min-height: 28px;
}

.keycap.is-active {
  background: var(--accent) !important;
  box-shadow: 0 0 24px var(--accent-glow), 0 2px 0 rgba(0, 0, 0, 0.35);
  transform: translateY(1px);
}

.keycap.is-active > span {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff;
}

.code-symbol {
  animation: symbolFloat 2.8s ease-in-out infinite;
}

@keyframes kbIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.96);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes symbolFloat {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.6);
  }
  30% { opacity: 0.7; }
  100% {
    opacity: 0;
    transform: translateY(-80px) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .kb-shell,
  .code-symbol {
    animation: none;
  }
}
</style>
