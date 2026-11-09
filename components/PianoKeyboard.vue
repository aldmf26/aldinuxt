<template>
  <div
    ref="pianoContainerRef"
    class="piano-wrapper"
    :class="{ 'is-fullscreen': isFullscreen }"
  >
    <div class="piano-console">
      <!-- TOP CONTROL BAR -->
      <header class="piano-header">
        <!-- Voice Preset Selector -->
        <div class="piano-header-left">
          <div class="voice-picker">
            <button
              v-for="v in voices"
              :key="v.id"
              type="button"
              class="voice-btn"
              :class="{ active: currentVoice === v.id }"
              @click="setVoice(v.id)"
            >
              <span class="voice-icon">{{ v.icon }}</span>
              <span class="voice-name">{{ v.name }}</span>
            </button>
          </div>
        </div>

        <!-- Octave & Fullscreen -->
        <div class="piano-header-right">
          <!-- Octave Controls -->
          <div class="octave-controls">
            <button
              type="button"
              class="oct-btn"
              :disabled="octaveOffset <= -1"
              @click="changeOctave(-1)"
              title="Octave Down"
            >
              -1 OCT
            </button>
            <span class="oct-display">{{ octaveDisplay }}</span>
            <button
              type="button"
              class="oct-btn"
              :disabled="octaveOffset >= 1"
              @click="changeOctave(1)"
              title="Octave Up"
            >
              +1 OCT
            </button>
          </div>

          <!-- Fullscreen Button -->
          <button
            type="button"
            class="piano-btn fullscreen-btn"
            :class="{ active: isFullscreen }"
            @click="toggleFullscreen"
            :title="isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'"
          >
            <svg v-if="!isFullscreen" viewBox="0 0 24 24" class="header-icon" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="header-icon" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 10V4m0 6h6m-6 0l7-7M10 10H4m6 0V4m0 6L3 3" />
            </svg>
            <span class="fs-text">{{ isFullscreen ? 'EXIT' : 'FULL' }}</span>
          </button>
        </div>
      </header>

      <!-- PIANO KEYBED (Touch & Mouse playable) -->
      <div
        class="piano-keybed"
        @pointerleave="clearAllHeld"
        @contextmenu.prevent
      >
        <div
          v-for="key in keys"
          :key="key.note"
          class="key-item"
          :class="[
            key.isBlack ? 'black-key' : 'white-key',
            { 'is-pressed': pressedNotes.has(key.note) }
          ]"
          :style="key.isBlack ? { left: `${key.leftPercent}%` } : {}"
          @pointerdown.prevent="onKeyDown(key, $event)"
          @pointerup.prevent="onKeyUp(key, $event)"
          @pointercancel.prevent="onKeyUp(key, $event)"
          @pointerenter.prevent="onKeyEnter(key, $event)"
        >
          <span class="key-inner">
            <span class="note-label">{{ key.name }}</span>
            <span v-if="key.shortcut" class="key-shortcut">{{ key.shortcut }}</span>
          </span>
        </div>
      </div>

      <!-- FOOTER INFO -->
      <footer class="piano-footer">
        <span class="piano-hint-desktop">
          Desktop: <b>Q</b> (Do / C4) · <b>2</b> (C#) · <b>W</b> (Re) · <b>3</b> (D#) · <b>E</b> (Mi) · <b>R</b> (Fa)
        </span>
        <span class="piano-hint-mobile">
          Sentuh tuts untuk main · Geser jari untuk glissando
        </span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAudioContext, playPianoNote, type PianoVoice } from '~/utils/producerAudio'

const pianoContainerRef = ref<HTMLDivElement>()
const isFullscreen = ref(false)
const currentVoice = ref<PianoVoice>('grand')
const octaveOffset = ref(0) // -1, 0, +1
const pressedNotes = ref(new Set<number>())

const voices: { id: PianoVoice; name: string; icon: string }[] = [
  { id: 'grand', name: 'Grand Piano', icon: '🎹' },
  { id: 'rhodes', name: 'Rhodes EP', icon: '⚡' },
  { id: 'synth', name: 'Analog Synth', icon: '🎛️' },
  { id: 'subbass', name: '808 Bass Key', icon: '🔊' }
]

function setVoice(v: PianoVoice) {
  currentVoice.value = v
  getAudioContext()
}

function changeOctave(delta: number) {
  const next = octaveOffset.value + delta
  if (next >= -1 && next <= 1) {
    octaveOffset.value = next
  }
}

const octaveDisplay = computed(() => {
  const base = 4 + octaveOffset.value
  return `C${base} - C${base + 2}`
})

/* ==========================================================
   2-OCTAVE KEYBED DEFINITION
   15 White Keys (C to C), 10 Black Keys
========================================================== */
interface KeyDef {
  note: number // MIDI note number
  freq: number
  name: string
  isBlack: boolean
  shortcut?: string
  leftPercent?: number
}

// Typing keyboard mapping (FL Studio standard):
// Q = C, 2 = C#, W = D, 3 = D#, E = E, R = F, 5 = F#, T = G, 6 = G#, Y = A, 7 = A#, U = B
// I = C, 9 = C#, O = D, 0 = D#, P = E, [ = F, = = F#, ] = G
const FL_SHORTCUTS: Record<number, string> = {
  0: 'Q', 1: '2', 2: 'W', 3: '3', 4: 'E', 5: 'R', 6: '5',
  7: 'T', 8: '6', 9: 'Y', 10: '7', 11: 'U',
  12: 'I', 13: '9', 14: 'O', 15: '0', 16: 'P', 17: '[', 18: '=', 19: ']'
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const keys = computed<KeyDef[]>(() => {
  const baseNote = 60 + octaveOffset.value * 12 // C4 is 60
  const result: KeyDef[] = []

  // 15 White keys
  const whiteIntervals = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]
  const totalWhite = whiteIntervals.length // 15
  const whiteWidthPercent = 100 / totalWhite

  // Add white keys
  whiteIntervals.forEach((semi, idx) => {
    const midi = baseNote + semi
    const freq = 440 * Math.pow(2, (midi - 69) / 12)
    const name = NOTE_NAMES[semi % 12] + (Math.floor(midi / 12) - 1)
    result.push({
      note: midi,
      freq,
      name,
      isBlack: false,
      shortcut: FL_SHORTCUTS[semi]
    })
  })

  // Add black keys (with absolute positioning over white keys)
  const blackIntervals = [
    { semi: 1, afterWhiteIdx: 0 },
    { semi: 3, afterWhiteIdx: 1 },
    { semi: 6, afterWhiteIdx: 3 },
    { semi: 8, afterWhiteIdx: 4 },
    { semi: 10, afterWhiteIdx: 5 },
    { semi: 13, afterWhiteIdx: 7 },
    { semi: 15, afterWhiteIdx: 8 },
    { semi: 18, afterWhiteIdx: 10 },
    { semi: 20, afterWhiteIdx: 11 },
    { semi: 22, afterWhiteIdx: 12 }
  ]

  blackIntervals.forEach(({ semi, afterWhiteIdx }) => {
    const midi = baseNote + semi
    const freq = 440 * Math.pow(2, (midi - 69) / 12)
    const name = NOTE_NAMES[semi % 12]
    // calculate center percentage
    const leftPercent = (afterWhiteIdx + 1) * whiteWidthPercent - (whiteWidthPercent * 0.3)
    result.push({
      note: midi,
      freq,
      name,
      isBlack: true,
      shortcut: FL_SHORTCUTS[semi],
      leftPercent
    })
  })

  return result
})

/* ==========================================================
   TOUCH & PLAY INTERACTIONS
========================================================== */
let isPointerActive = false

function playKey(key: KeyDef) {
  getAudioContext()
  pressedNotes.value.add(key.note)
  playPianoNote(key.freq, currentVoice.value)

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(10) } catch {}
  }
}

function stopKey(key: KeyDef) {
  pressedNotes.value.delete(key.note)
}

function onKeyDown(key: KeyDef, e?: PointerEvent) {
  isPointerActive = true
  playKey(key)
}

function onKeyUp(key: KeyDef, e?: PointerEvent) {
  stopKey(key)
  isPointerActive = false
}

function onKeyEnter(key: KeyDef, e?: PointerEvent) {
  if (isPointerActive) {
    playKey(key)
  }
}

function clearAllHeld() {
  pressedNotes.value.clear()
  isPointerActive = false
}

/* ==========================================================
   DESKTOP KEYBOARD BINDINGS
========================================================== */
const shortcutMap = computed(() => {
  const map: Record<string, KeyDef> = {}
  for (const k of keys.value) {
    if (k.shortcut) {
      map[k.shortcut.toLowerCase()] = k
    }
  }
  return map
})

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return
  const char = e.key.toLowerCase()
  const keyDef = shortcutMap.value[char]
  if (keyDef) {
    e.preventDefault()
    playKey(keyDef)
  }
}

function handleKeyUp(e: KeyboardEvent) {
  const char = e.key.toLowerCase()
  const keyDef = shortcutMap.value[char]
  if (keyDef) {
    stopKey(keyDef)
  }
}

/* ==========================================================
   FULL SCREEN
========================================================== */
function toggleFullscreen() {
  const el = pianoContainerRef.value
  if (!el) return

  if (!isFullscreen.value) {
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        isFullscreen.value = true
      })
    } else {
      isFullscreen.value = true
    }
  } else {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
    isFullscreen.value = false
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  clearAllHeld()
})
</script>

<style scoped>
.piano-wrapper {
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

/* FULLSCREEN OVERLAY */
.piano-wrapper.is-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  max-width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  z-index: 99999 !important;
  background: #111316 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: env(safe-area-inset-top, 16px) env(safe-area-inset-right, 16px) env(safe-area-inset-bottom, 16px) env(safe-area-inset-left, 16px) !important;
  margin: 0 !important;
}

.piano-wrapper.is-fullscreen .piano-console {
  width: 100% !important;
  max-width: 900px !important;
}

/* CONSOLE CHASSIS */
.piano-console {
  background: #1d1f24;
  border-radius: 18px;
  border: 3px solid #141518;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

/* HEADER */
.piano-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #25282f;
  border-bottom: 2px solid #141518;
  gap: 12px;
  flex-wrap: wrap;
}

.piano-header-left, .piano-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* VOICE BUTTONS */
.voice-picker {
  display: flex;
  background: #141518;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: #8f929b;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.voice-btn:hover {
  color: #fff;
}

.voice-btn.active {
  background: #343740;
  color: #ff9800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.voice-icon {
  font-size: 13px;
}

/* OCTAVE CONTROLS */
.octave-controls {
  display: flex;
  align-items: center;
  background: #141518;
  border-radius: 8px;
  padding: 2px;
}

.oct-btn {
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: #c5c8d0;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  border-radius: 6px;
}

.oct-btn:hover:not(:disabled) {
  background: #2d3038;
  color: #fff;
}

.oct-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.oct-display {
  font-size: 11px;
  font-weight: 800;
  color: #ff9800;
  padding: 0 6px;
}

/* FULLSCREEN BTN */
.piano-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 8px;
  border-radius: 8px;
  background: #141518;
  border: 1px solid #2d3038;
  color: #c5c8d0;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.piano-btn:hover {
  background: #2d3038;
  color: #fff;
}

.piano-btn.active {
  background: #ff9800;
  color: #111;
}

.header-icon {
  width: 16px;
  height: 16px;
}

/* ==========================================================
   PIANO KEYBED
========================================================== */
.piano-keybed {
  position: relative;
  width: 100%;
  height: 220px;
  background: #0f1013;
  padding: 10px 10px 0;
  box-sizing: border-box;
  display: flex;
}

/* WHITE KEYS */
.white-key {
  position: relative;
  flex: 1;
  height: 100%;
  background: linear-gradient(180deg, #f7f6f2 0%, #e6e5df 85%, #cfcecb 100%);
  border: 1px solid #141518;
  border-radius: 0 0 6px 6px;
  box-shadow: inset 0 2px 2px #fff, 0 4px 6px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  z-index: 1;
  transition: transform 0.05s ease, background 0.05s ease;
}

.white-key.is-pressed {
  background: linear-gradient(180deg, #ffc107 0%, #ff9800 100%);
  transform: translateY(3px);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 14px rgba(255, 152, 0, 0.8);
}

.white-key .note-label {
  font-size: 11px;
  font-weight: 800;
  color: #4b4e57;
}

.white-key.is-pressed .note-label {
  color: #111;
}

.white-key .key-shortcut {
  display: block;
  font-size: 9px;
  font-weight: 900;
  color: #8b8e97;
  margin-top: 2px;
}

.white-key.is-pressed .key-shortcut {
  color: #111;
}

/* BLACK KEYS */
.black-key {
  position: absolute;
  top: 10px;
  width: 4.8%;
  height: 60%;
  background: linear-gradient(180deg, #2a2c33 0%, #151619 100%);
  border: 1px solid #000;
  border-radius: 0 0 4px 4px;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 6px 10px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  transition: transform 0.05s ease, background 0.05s ease;
}

.black-key.is-pressed {
  background: linear-gradient(180deg, #ffa000 0%, #e65100 100%);
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 14px rgba(255, 152, 0, 0.8);
}

.black-key .note-label {
  font-size: 9px;
  font-weight: 800;
  color: #a0a3ac;
}

.black-key.is-pressed .note-label {
  color: #fff;
}

.black-key .key-shortcut {
  display: block;
  font-size: 8px;
  font-weight: 900;
  color: #ff9800;
  margin-top: 1px;
}

.key-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

/* FOOTER */
.piano-footer {
  padding: 8px 14px;
  background: #141518;
  border-top: 2px solid #23252a;
  color: #8b8e97;
  font-size: 11px;
  text-align: center;
}

.piano-footer b {
  color: #ff9800;
}

.piano-hint-mobile {
  display: none;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .piano-header {
    padding: 6px 8px;
  }
  .voice-btn {
    padding: 4px 6px;
    font-size: 11px;
  }
  .piano-keybed {
    height: 180px;
    padding: 6px 6px 0;
  }
  .white-key .note-label {
    font-size: 9px;
  }
  .white-key .key-shortcut {
    font-size: 8px;
  }
  .piano-hint-desktop {
    display: none;
  }
  .piano-hint-mobile {
    display: block;
  }
}
</style>

