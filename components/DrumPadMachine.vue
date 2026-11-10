<template>
  <div class="machine" :style="palette">
    <!-- sound packs, like a pad app's pack shelf -->
    <div class="packs" role="radiogroup" :aria-label="$t('pads.packs')">
      <button
        v-for="p in PRESETS"
        :key="p.id"
        type="button"
        role="radio"
        class="pack"
        :aria-checked="p.id === preset.id"
        :style="{ '--c': p.colors[0] }"
        @click="choose(p.id)"
      >
        <span class="pack-name">{{ p.name }}</span>
        <span class="pack-bpm num">{{ p.bpm }}</span>
      </button>
    </div>

    <!-- phones: one native select instead of the shelf -->
    <label class="pack-select">
      <span class="sr-only">{{ $t('pads.packs') }}</span>
      <select :value="preset.id" @change="choose(($event.target as HTMLSelectElement).value as PresetId)">
        <option v-for="p in PRESETS" :key="p.id" :value="p.id">{{ p.name }} · {{ p.bpm }} BPM</option>
      </select>
    </label>

    <!-- LCD: what you just hit -->
    <div class="lcd num" aria-live="polite">
      <span class="lcd-pack">{{ preset.name.toUpperCase() }} · {{ preset.bpm }} BPM</span>
      <span class="lcd-hit">{{ last }}</span>
    </div>

    <div ref="grid" class="grid" @contextmenu.prevent>
      <button
        v-for="(pad, i) in preset.pads"
        :key="preset.id + i"
        :ref="el => (padEls[i] = el as HTMLElement)"
        type="button"
        class="pad"
        :class="{ down: down.has(i) }"
        :style="{ '--c': preset.colors[pad.tone], '--i': i }"
        :aria-label="`${pad.label} ${pad.sub}, key ${pad.key.toUpperCase()}`"
        @pointerdown="hit(i, $event)"
        @pointerup="lift(i)"
        @pointercancel="lift(i)"
        @keydown.enter.prevent="hit(i)"
        @keydown.space.prevent="hit(i)"
        @keyup.enter="lift(i)"
        @keyup.space="lift(i)"
      >
        <span class="halo" aria-hidden="true" />
        <span class="fill" aria-hidden="true" />
        <span class="key num" aria-hidden="true">{{ pad.key.toUpperCase() }}</span>
        <span class="label">{{ pad.label }}</span>
        <span class="sub">{{ pad.sub }}</span>
      </button>
      <span ref="ring" class="ring" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRESETS } from '~/utils/drumpadPresets'
import { unlockMobileAudio, type PresetId } from '~/utils/producerAudio'

const presetId = ref<PresetId>('trap')
const preset = computed(() => PRESETS.find(p => p.id === presetId.value)!)
const palette = computed(() => ({ '--c0': preset.value.colors[0] }))
const last = ref('—')
const down = ref(new Set<number>())
const grid = ref<HTMLElement>()
const ring = ref<HTMLElement>()
const padEls: HTMLElement[] = []
const rolls = new Map<number, ReturnType<typeof setInterval>>()
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const COLS = 3

function choose(id: PresetId) {
  if (id === presetId.value) return
  presetId.value = id
  unlockMobileAudio()
  last.value = '—'
  if (reduce) return
  // new pack lights up in a wave from the top-left pad
  nextTick(() => padEls.forEach((el, i) => el?.animate(
    [{ opacity: 0.2, scale: '0.9' }, { opacity: 1, scale: '1' }],
    { duration: 420, delay: (Math.floor(i / COLS) + (i % COLS)) * 45, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
  )))
}

function trigger(i: number) {
  const pad = preset.value.pads[i]
  pad.play(preset.value.id)
  last.value = `${pad.label} ${pad.sub}`.toUpperCase()
}

function splash(i: number, e?: PointerEvent) {
  const el = padEls[i]
  if (!el || reduce) return
  const r = el.getBoundingClientRect()
  const x = e ? e.clientX - r.left : r.width / 2
  const y = e ? e.clientY - r.top : r.height / 2
  // colour floods out from the finger
  const fill = el.querySelector<HTMLElement>('.fill')
  if (fill) {
    fill.style.left = `${x}px`
    fill.style.top = `${y}px`
    fill.animate(
      [{ scale: '0', opacity: 1 }, { scale: '1', opacity: 1, offset: 0.45 }, { scale: '1', opacity: 0 }],
      { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' },
    )
  }
  // shockwave across the grid
  const g = grid.value!.getBoundingClientRect()
  const cx = r.left - g.left + r.width / 2, cy = r.top - g.top + r.height / 2
  ring.value?.animate(
    [{ translate: `${cx}px ${cy}px`, scale: '0.2', opacity: 0.9 }, { translate: `${cx}px ${cy}px`, scale: '3.2', opacity: 0 }],
    { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' },
  )
  // neighbours catch the light, later and dimmer with distance
  const row = Math.floor(i / COLS), col = i % COLS
  padEls.forEach((n, j) => {
    if (j === i || !n) return
    const d = Math.hypot(Math.floor(j / COLS) - row, (j % COLS) - col)
    n.querySelector('.halo')?.animate([{ opacity: Math.max(0, 0.75 - d * 0.22) }, { opacity: 0 }], { duration: 380, delay: d * 55, easing: 'ease-out' })
  })
}

function hit(i: number, e?: PointerEvent) {
  unlockMobileAudio()
  if (e) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  down.value.add(i)
  trigger(i)
  splash(i, e)
  navigator.vibrate?.(10)
  if (preset.value.pads[i].hat && !rolls.has(i)) {
    // hold the hats: 1/16 roll at the pack tempo
    rolls.set(i, setInterval(() => { trigger(i); splash(i) }, Math.max(70, (60 / preset.value.bpm / 4) * 1000)))
  }
}

function lift(i: number) {
  down.value.delete(i)
  clearInterval(rolls.get(i))
  rolls.delete(i)
}

/* desktop keys: 1 2 3 / Q W E / A S D / Z X C */
const typing = (e: KeyboardEvent) => { const t = e.target as HTMLElement; return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) }
const idx = (e: KeyboardEvent) => preset.value.pads.findIndex(p => p.key === e.key.toLowerCase())
function onKeyDown(e: KeyboardEvent) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e)) return
  const i = idx(e)
  if (i < 0) return
  e.preventDefault()
  hit(i)
}
function onKeyUp(e: KeyboardEvent) { const i = idx(e); if (i > -1) lift(i) }

onMounted(() => { addEventListener('keydown', onKeyDown); addEventListener('keyup', onKeyUp) })
onBeforeUnmount(() => {
  removeEventListener('keydown', onKeyDown); removeEventListener('keyup', onKeyUp)
  rolls.forEach(clearInterval)
})
</script>

<style scoped>
.machine {
  width: 100%; max-width: 560px; margin-inline: auto; display: grid; gap: 12px;
  padding: clamp(12px, 2.5vw, 20px); border-radius: 14px;
  background: #121212; color: #f2f2f2; border: 1px solid #262626;
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  user-select: none; -webkit-user-select: none;
}

/* pack shelf */
.packs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; scroll-snap-type: x proximity; }
.packs::-webkit-scrollbar { display: none; }
.pack {
  flex: none; scroll-snap-align: start; display: flex; align-items: center; gap: 8px;
  min-height: 40px; padding: 0 14px; border-radius: 999px; cursor: pointer;
  background: #1c1c1c; color: #cfcfcf; border: 1px solid #2c2c2c; font: 700 0.85rem var(--font-body);
  transition: background-color 0.25s, color 0.25s, border-color 0.25s, scale 0.3s var(--ease);
}
.pack:hover { scale: 1.04; color: #fff; }
.pack[aria-checked='true'] { background: var(--c); border-color: var(--c); color: #0b0b0b; }
.pack-bpm { font-size: 0.68rem; opacity: 0.7; }
.pack:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.pack-select { display: none; position: relative; }
.pack-select select {
  width: 100%; min-height: 48px; padding: 0 44px 0 16px; appearance: none; -webkit-appearance: none; cursor: pointer;
  border-radius: 10px; border: 1px solid var(--c0); background: #1c1c1c; color: #f5f5f5; font: 700 1rem var(--font-body);
}
.pack-select::after { /* caret */
  content: ''; position: absolute; right: 18px; top: 50%; width: 8px; height: 8px; pointer-events: none;
  border-right: 2px solid var(--c0); border-bottom: 2px solid var(--c0); translate: 0 -70%; rotate: 45deg;
}
.pack-select select:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
@media (max-width: 760px) {
  .packs { display: none; }
  .pack-select { display: block; }
}

/* LCD */
.lcd {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 10px 14px; border-radius: 8px; background: #0a0a0a; border: 1px solid #222;
  font-size: 0.72rem; color: color-mix(in oklab, var(--c0) 80%, #fff);
  box-shadow: inset 0 0 24px color-mix(in oklab, var(--c0) 14%, transparent);
}
.lcd-hit { font-size: 0.95rem; font-weight: 500; letter-spacing: 0.04em; color: #f5f5f5; }

/* pads */
.grid { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 1.6vw, 12px); touch-action: none; }
.pad {
  position: relative; isolation: isolate; overflow: hidden; aspect-ratio: 1 / 0.86;
  display: grid; align-content: end; justify-items: start; gap: 2px; padding: 10px 12px; text-align: left;
  border-radius: 10px; cursor: pointer; color: #f5f5f5;
  background: radial-gradient(120% 90% at 50% 0%, #262626, #161616);
  border: 1px solid color-mix(in oklab, var(--c) 45%, #1f1f1f);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 -10px 24px -14px var(--c), 0 6px 14px -8px rgba(0, 0, 0, 0.8);
  transition: scale 0.12s var(--ease), border-color 0.2s;
}
.pad:hover { border-color: var(--c); }
.pad.down { scale: 0.95; }
.pad:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.halo { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.fill {
  position: absolute; left: 50%; top: 50%; z-index: -1; pointer-events: none;
  width: 280%; aspect-ratio: 1; border-radius: 50%; translate: -50% -50%;
}
.halo { background: radial-gradient(circle at 50% 50%, var(--c), transparent 75%); opacity: 0; }
.fill { background: radial-gradient(circle at 50% 50%, #fff 0 4%, var(--c) 22%, color-mix(in oklab, var(--c) 60%, transparent) 50%); opacity: 0; }
.pad.down .fill { opacity: 0.55; } /* held pads stay lit */
.key { position: absolute; top: 8px; right: 10px; font-size: 0.62rem; color: rgba(255, 255, 255, 0.45); }
.label { font: 800 clamp(0.78rem, 0.7rem + 0.5vw, 1rem)/1 var(--font-display); font-variation-settings: 'wdth' 112; letter-spacing: -0.01em; }
.sub { font-size: 0.68rem; color: rgba(255, 255, 255, 0.6); }
.ring {
  position: absolute; left: -60px; top: -60px; width: 120px; height: 120px; border-radius: 50%;
  border: 2px solid var(--c0); opacity: 0; pointer-events: none; z-index: 5;
}

@media (prefers-reduced-motion: reduce) { .pad { transition: none; } }
</style>
