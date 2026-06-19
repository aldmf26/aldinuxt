<template>
  <div
    ref="pianoRef"
    class="piano-shell relative mx-auto w-full max-w-6xl rounded-[28px] border border-white/10 bg-[#080a0d]/90 p-3 shadow-2xl shadow-black/60 sm:p-4"
    @mousemove="onMove"
    @mouseleave="hoveredKey = null"
  >
    <div class="absolute inset-x-8 -top-8 h-16 rounded-full bg-orange-500/20 blur-3xl"></div>
    <div
      class="pointer-events-none absolute inset-0 rounded-[28px] opacity-70"
      :style="spotlightStyle"
    ></div>

    <div class="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#151922] to-[#090b0f] sm:h-44 md:h-56">
      <div class="absolute left-0 right-0 top-0 z-20 flex h-4 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4">
        <span class="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-cyan-300"></span>
        <span class="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">midi keys</span>
      </div>

      <div class="absolute inset-x-0 top-5 h-16 overflow-hidden sm:h-20 md:h-24">
        <span
          v-for="note in midiNotes"
          :key="note.id"
          class="midi-note absolute bottom-0 rounded-full"
          :style="{
            left: note.left,
            width: note.size,
            height: note.size,
            animationDelay: note.delay,
            background: note.color,
            boxShadow: `0 0 22px ${note.color}`,
          }"
        ></span>
      </div>

      <div class="absolute inset-x-3 bottom-3 top-16 grid grid-cols-14 gap-1 sm:inset-x-4 md:top-20">
        <button
          v-for="(key, index) in whiteKeys"
          :key="key"
          class="white-key relative rounded-b-xl rounded-t-sm border border-black/40 bg-gradient-to-b from-white to-zinc-300 transition duration-200"
          :class="{ 'is-active': activeKeys.includes(index) || hoveredKey === index }"
          @mouseenter="hoveredKey = index"
          data-cursor-hover
        >
          <span class="absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/20"></span>
        </button>
      </div>

      <div class="pointer-events-none absolute inset-x-3 bottom-3 top-16 grid grid-cols-14 gap-1 sm:inset-x-4 md:top-20">
        <div
          v-for="black in blackKeys"
          :key="black.id"
          class="black-key pointer-events-auto absolute top-0 z-30 h-[58%] w-[7%] rounded-b-lg bg-gradient-to-b from-zinc-900 to-black transition duration-200"
          :class="{ 'is-active': activeBlackKeys.includes(black.id) }"
          :style="{ left: black.left }"
          data-cursor-hover
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const pianoRef = ref(null)
const hoveredKey = ref(null)
const activeKeys = ref([0, 4, 7, 11])
const activeBlackKeys = ref(['b2', 'b7'])
const mouse = reactive({ x: 50, y: 50 })

const whiteKeys = Array.from({ length: 14 }, (_, i) => i)
const blackKeys = [
  { id: 'b1', left: '5.4%' },
  { id: 'b2', left: '12.6%' },
  { id: 'b3', left: '26.8%' },
  { id: 'b4', left: '34%' },
  { id: 'b5', left: '41.1%' },
  { id: 'b6', left: '55.4%' },
  { id: 'b7', left: '62.5%' },
  { id: 'b8', left: '76.8%' },
  { id: 'b9', left: '84%' },
  { id: 'b10', left: '91%' },
]

const midiNotes = [
  { id: 1, left: '12%', size: '8px', delay: '0s', color: '#fb923c' },
  { id: 2, left: '28%', size: '10px', delay: '.8s', color: '#67e8f9' },
  { id: 3, left: '51%', size: '7px', delay: '1.4s', color: '#fb923c' },
  { id: 4, left: '69%', size: '9px', delay: '.35s', color: '#67e8f9' },
  { id: 5, left: '86%', size: '6px', delay: '1.1s', color: '#fb923c' },
]

const spotlightStyle = computed(() => ({
  background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(103,232,249,.22), rgba(251,146,60,.12) 24%, transparent 48%)`,
}))

let intervalId

function onMove(event) {
  const rect = pianoRef.value?.getBoundingClientRect()
  if (!rect) return
  mouse.x = ((event.clientX - rect.left) / rect.width) * 100
  mouse.y = ((event.clientY - rect.top) / rect.height) * 100
}

onMounted(() => {
  const patterns = [
    { white: [0, 4, 7, 11], black: ['b2', 'b7'] },
    { white: [2, 5, 9, 13], black: ['b4', 'b8'] },
    { white: [1, 6, 8, 12], black: ['b1', 'b6', 'b10'] },
    { white: [3, 7, 10], black: ['b3', 'b9'] },
  ]
  let step = 0
  intervalId = window.setInterval(() => {
    step = (step + 1) % patterns.length
    activeKeys.value = patterns[step].white
    activeBlackKeys.value = patterns[step].black
  }, 620)
})

onUnmounted(() => {
  if (intervalId) window.clearInterval(intervalId)
})
</script>

<style scoped>
.grid-cols-14 {
  grid-template-columns: repeat(14, minmax(0, 1fr));
}

.piano-shell {
  animation: pianoIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}

.white-key.is-active {
  background: linear-gradient(180deg, #fff7ed, #fdba74);
  box-shadow: inset 0 -10px 24px rgba(249, 115, 22, 0.28), 0 0 30px rgba(251, 146, 60, 0.28);
  transform: translateY(3px);
}

.black-key.is-active,
.black-key:hover {
  background: linear-gradient(180deg, #164e63, #020617);
  box-shadow: 0 0 22px rgba(103, 232, 249, 0.38);
  transform: translateY(2px);
}

.midi-note {
  animation: midiFloat 2.6s ease-in-out infinite;
}

@keyframes pianoIn {
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

@keyframes midiFloat {
  0% {
    opacity: 0;
    transform: translateY(32px) scale(0.6);
  }
  35% { opacity: 1; }
  100% {
    opacity: 0;
    transform: translateY(-70px) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .piano-shell,
  .midi-note {
    animation: none;
  }
}
</style>
