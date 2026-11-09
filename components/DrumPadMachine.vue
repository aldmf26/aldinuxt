<template>
  <div
    ref="containerRef"
    class="drumpad-wrapper"
    :class="{ 'is-fullscreen': isFullscreen }"
  >
    <!-- DRUM PADS 24 SHELL -->
    <div class="drumpads24-machine">
      <!-- HEADER BAR (Iconic Yellow/Orange bar like Drum Pads 24) -->
      <header class="machine-header">
        <!-- Left: Menu & Preset selector -->
        <div class="header-left">
          <div class="preset-dropdown-container">
            <button
              type="button"
              class="header-btn menu-btn"
              :aria-label="$t('producer.presetSelect') || 'Pilih Preset'"
              @click="togglePresetMenu"
            >
              <svg viewBox="0 0 24 24" class="header-icon" fill="currentColor">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              </svg>
              <span class="preset-name-badge">{{ currentPreset.name }}</span>
              <svg viewBox="0 0 20 20" class="caret-icon" fill="currentColor">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            <!-- Preset Dropdown Menu -->
            <div v-if="presetMenuOpen" class="preset-menu">
              <div class="preset-menu-title">SELECT SOUND PACK</div>
              <button
                v-for="p in PRESETS"
                :key="p.id"
                type="button"
                class="preset-item"
                :class="{ active: p.id === currentPreset.id }"
                @click="selectPreset(p.id)"
              >
                <div class="preset-item-info">
                  <span class="preset-item-name">{{ p.name }}</span>
                  <span class="preset-item-meta">{{ p.genre }} · {{ p.bpm }} BPM</span>
                </div>
                <span v-if="p.id === currentPreset.id" class="check-mark">✓</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Center: REC & LOOP CONTROLS -->
        <div class="header-center">
          <button
            type="button"
            class="header-btn rec-btn"
            :class="{ recording: isRecording }"
            @click="toggleRecord"
            title="Record Beat Loop"
          >
            <span class="rec-dot"></span>
            <span class="rec-text">{{ isRecording ? 'REC ' + recordTimeStr : 'REC' }}</span>
          </button>

          <!-- Loop Play / Stop -->
          <button
            type="button"
            class="header-btn loop-btn"
            :class="{ active: isPlayingLoop, disabled: !hasRecordedLoop }"
            :disabled="!hasRecordedLoop"
            @click="togglePlayLoop"
            title="Loop playback"
          >
            <svg v-if="!isPlayingLoop" viewBox="0 0 24 24" class="header-icon" fill="currentColor">
              <!-- Repeat loop icon -->
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" class="header-icon" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>

        <!-- Right: BANK (A/B) & FULLSCREEN -->
        <div class="header-right">
          <button
            type="button"
            class="header-btn bank-btn"
            :class="{ 'bank-b': currentBank === 'bankB' }"
            @click="toggleBank"
            title="Switch Bank A / Bank B"
          >
            <span class="bank-label">BANK</span>
            <span class="bank-val">{{ currentBank === 'bankA' ? 'A' : 'B' }}</span>
          </button>

          <!-- FULL SCREEN TOGGLE (Prominent for Mobile & Desktop) -->
          <button
            type="button"
            class="header-btn fullscreen-btn"
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
            <span class="fullscreen-text">{{ isFullscreen ? 'EXIT' : 'FULL' }}</span>
          </button>
        </div>
      </header>

      <!-- 12 PADS GRID (3 columns x 4 rows) -->
      <div class="pads-grid" @contextmenu.prevent>
        <button
          v-for="pad in activePads"
          :key="pad.id"
          type="button"
          class="drum-pad"
          :class="[
            'pad-' + pad.color,
            {
              'is-active': activePadIds.has(pad.id),
              'is-kick': pad.isKick,
              'is-hat': pad.isHat,
              'is-snare': pad.isSnare
            }
          ]"
          @pointerdown.prevent="onPadDown(pad, $event)"
          @pointerup.prevent="onPadUp(pad, $event)"
          @pointercancel.prevent="onPadUp(pad, $event)"
          @pointerleave.prevent="onPadLeave(pad, $event)"
        >
          <!-- 3D Rubber Pad Surface with Inner Radial Glow -->
          <span class="pad-surface">
            <!-- Center Radial Glow -->
            <span class="pad-glow"></span>

            <!-- Key Label Badge (Keyboard on Desktop) -->
            <span class="pad-key-badge" aria-hidden="true">{{ pad.key }}</span>

            <!-- Sound Name & Sublabel -->
            <span class="pad-content">
              <span class="pad-label">{{ pad.label }}</span>
              <span class="pad-sublabel">{{ pad.sublabel }}</span>
            </span>

            <!-- Active Neon Shockwave Ring -->
            <span v-if="activePadIds.has(pad.id)" class="pad-flash-ring"></span>
          </span>
        </button>
      </div>

      <!-- BOTTOM BAR / FOOTER (Drum Pads 24 signature look) -->
      <footer class="machine-footer">
        <div class="footer-info">
          <span class="footer-tag">{{ currentPreset.name.toUpperCase() }}</span>
          <span class="footer-divider">·</span>
          <span class="footer-bank">BANK {{ currentBank === 'bankA' ? 'A' : 'B' }}</span>
          <span class="footer-divider">·</span>
          <span class="footer-bpm">{{ currentPreset.bpm }} BPM</span>
        </div>
        <div class="footer-brand">
          <span class="brand-text">DRUM PADS 24</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PRESETS, type PadItem } from '~/utils/drumpadPresets'
import { getAudioContext, type PresetId } from '~/utils/producerAudio'

const containerRef = ref<HTMLDivElement>()
const selectedPresetId = ref<PresetId>('trap')
const currentBank = ref<'bankA' | 'bankB'>('bankA')
const presetMenuOpen = ref(false)
const isFullscreen = ref(false)

// Active pressed pad IDs set for multi-touch visual feedback
const activePadIds = ref(new Set<number>())

const currentPreset = computed(() => {
  return PRESETS.find(p => p.id === selectedPresetId.value) || PRESETS[0]
})

const activePads = computed<PadItem[]>(() => {
  return currentPreset.value[currentBank.value]
})

function selectPreset(id: PresetId) {
  selectedPresetId.value = id
  presetMenuOpen.value = false
  getAudioContext() // warm up audio
}

function togglePresetMenu() {
  presetMenuOpen.value = !presetMenuOpen.value
}

function toggleBank() {
  currentBank.value = currentBank.value === 'bankA' ? 'bankB' : 'bankA'
}

/* ==========================================================
   MULTI-TOUCH & PAD TRIGGER ENGINE
========================================================== */
const holdingPads = new Map<number, { timer?: any }>()

function triggerPad(pad: PadItem) {
  getAudioContext()
  pad.action(currentPreset.value.id)

  // Record pad hit if recording
  if (isRecording.value) {
    const elapsed = performance.now() - recordStartTime
    recordedHits.push({ padId: pad.id, time: elapsed })
  }

  // Haptic feedback on supported mobile devices
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(12) } catch {}
  }
}

function onPadDown(pad: PadItem, e?: PointerEvent) {
  if (e && e.target && (e.target as HTMLElement).setPointerCapture && e.pointerId !== undefined) {
    try {
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    } catch {}
  }

  activePadIds.value.add(pad.id)
  triggerPad(pad)

  // Hi-hat roll support: holding hat does rapid 16th-note rolls
  if (pad.isHat) {
    const interval = Math.max(65, (60 / currentPreset.value.bpm / 4) * 1000)
    const timer = setInterval(() => {
      triggerPad(pad)
    }, interval)
    holdingPads.set(pad.id, { timer })
  } else {
    holdingPads.set(pad.id, {})
  }
}

function onPadUp(pad: PadItem, e?: PointerEvent) {
  activePadIds.value.delete(pad.id)
  const held = holdingPads.get(pad.id)
  if (held?.timer) {
    clearInterval(held.timer)
  }
  holdingPads.delete(pad.id)
}

function onPadLeave(pad: PadItem, e?: PointerEvent) {
  onPadUp(pad, e)
}

/* ==========================================================
   DESKTOP KEYBOARD BINDINGS
   Row 1: 1, 2, 3 (or Num 7, 8, 9)
   Row 2: Q, W, E (or Num 4, 5, 6)
   Row 3: A, S, D (or Num 1, 2, 3)
   Row 4: Z (Kick), X (Hi-Hats), C (Snare) (or Num 0, ., Enter)
========================================================== */
const keyMap: Record<string, number> = {
  '1': 0, '2': 1, '3': 2,
  'q': 3, 'w': 4, 'e': 5,
  'a': 6, 's': 7, 'd': 8,
  'z': 9, 'x': 10, 'c': 11,
  // Numpad equivalents
  'numpad7': 0, 'numpad8': 1, 'numpad9': 2,
  'numpad4': 3, 'numpad5': 4, 'numpad6': 5,
  'numpad1': 6, 'numpad2': 7, 'numpad3': 8,
  'numpad0': 9, 'numpaddecimal': 10, 'numpadenter': 11
}

const keyHolding = new Set<string>()

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null
  return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return
  const key = e.key.toLowerCase()
  const code = e.code.toLowerCase()

  const padIndex = keyMap[key] ?? keyMap[code]
  if (padIndex !== undefined && padIndex >= 0 && padIndex < activePads.value.length) {
    e.preventDefault()
    keyHolding.add(key)
    const pad = activePads.value[padIndex]
    if (pad) {
      onPadDown(pad)
    }
  } else if (key === 'tab') {
    // Tab toggles Bank A / Bank B!
    e.preventDefault()
    toggleBank()
  }
}

function handleKeyUp(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  const code = e.code.toLowerCase()

  const padIndex = keyMap[key] ?? keyMap[code]
  if (padIndex !== undefined && padIndex >= 0 && padIndex < activePads.value.length) {
    keyHolding.delete(key)
    const pad = activePads.value[padIndex]
    if (pad) {
      onPadUp(pad)
    }
  }
}

/* ==========================================================
   BEAT RECORDER & LOOP PLAYBACK
========================================================== */
interface RecordedHit {
  padId: number
  time: number
}

const isRecording = ref(false)
const isPlayingLoop = ref(false)
const hasRecordedLoop = ref(false)
let recordStartTime = 0
let recordedHits: RecordedHit[] = []
let loopLength = 0
let recordTimerInterval: any = null
const recordTimeStr = ref('00:00')
let loopPlaybackTimeouts: any[] = []
let loopIntervalId: any = null

function toggleRecord() {
  if (isRecording.value) {
    // Stop recording
    isRecording.value = false
    clearInterval(recordTimerInterval)
    loopLength = performance.now() - recordStartTime
    hasRecordedLoop.value = recordedHits.length > 0
    if (hasRecordedLoop.value) {
      startLoop()
    }
  } else {
    // Start recording
    stopLoop()
    recordedHits = []
    isRecording.value = true
    recordStartTime = performance.now()
    recordTimeStr.value = '00:00'
    recordTimerInterval = setInterval(() => {
      const sec = Math.floor((performance.now() - recordStartTime) / 1000)
      const m = String(Math.floor(sec / 60)).padStart(2, '0')
      const s = String(sec % 60).padStart(2, '0')
      recordTimeStr.value = `${m}:${s}`
      // Auto loop at 16 bars (approx 15 seconds)
      if (sec >= 16) {
        toggleRecord()
      }
    }, 250)
  }
}

function startLoop() {
  if (!recordedHits.length || loopLength <= 0) return
  isPlayingLoop.value = true

  const playIteration = () => {
    loopPlaybackTimeouts.forEach(t => clearTimeout(t))
    loopPlaybackTimeouts = []

    for (const hit of recordedHits) {
      const t = setTimeout(() => {
        const pad = activePads.value.find(p => p.id === hit.padId)
        if (pad && isPlayingLoop.value) {
          pad.action(currentPreset.value.id)
          activePadIds.value.add(pad.id)
          setTimeout(() => activePadIds.value.delete(pad.id), 90)
        }
      }, hit.time)
      loopPlaybackTimeouts.push(t)
    }
  }

  playIteration()
  clearInterval(loopIntervalId)
  loopIntervalId = setInterval(playIteration, loopLength)
}

function stopLoop() {
  isPlayingLoop.value = false
  clearInterval(loopIntervalId)
  loopPlaybackTimeouts.forEach(t => clearTimeout(t))
  loopPlaybackTimeouts = []
}

function togglePlayLoop() {
  if (isPlayingLoop.value) {
    stopLoop()
  } else if (hasRecordedLoop.value) {
    startLoop()
  }
}

/* ==========================================================
   FULL SCREEN MODE
========================================================== */
function toggleFullscreen() {
  const el = containerRef.value
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

/* ==========================================================
   LIFECYCLE
========================================================== */
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  // Close preset menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const el = e.target as HTMLElement
    if (!el.closest('.preset-dropdown-container')) {
      presetMenuOpen.value = false
    }
  }
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  stopLoop()
  clearInterval(recordTimerInterval)
  holdingPads.forEach(h => clearInterval(h.timer))
})
</script>

<style scoped>
/* CONTAINER */
.drumpad-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

/* FULLSCREEN MODE (Overlay for mobile / true fullscreen) */
.drumpad-wrapper.is-fullscreen {
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
  padding: env(safe-area-inset-top, 12px) env(safe-area-inset-right, 12px) env(safe-area-inset-bottom, 12px) env(safe-area-inset-left, 12px) !important;
  margin: 0 !important;
}

.drumpad-wrapper.is-fullscreen .drumpads24-machine {
  height: 100% !important;
  max-width: 540px !important;
  box-shadow: none !important;
  border-radius: 18px !important;
}

/* CHASSIS / MACHINE */
.drumpads24-machine {
  display: flex;
  flex-direction: column;
  background: #23252a;
  border-radius: 20px;
  border: 3px solid #1a1b1f;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

/* HEADER BAR (Iconic Drum Pads 24 Amber Style) */
.machine-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #f7a216 0%, #d87d06 100%);
  padding: 8px 12px;
  border-bottom: 3px solid #141518;
  position: relative;
  z-index: 20;
}

.header-left, .header-center, .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 38px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  color: #141518;
  border: 1px solid rgba(0, 0, 0, 0.25);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}

.header-btn:hover {
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
}

.header-icon {
  width: 18px;
  height: 18px;
}

/* PRESET SELECTOR */
.preset-dropdown-container {
  position: relative;
}

.menu-btn {
  padding: 0 8px;
}

.preset-name-badge {
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.caret-icon {
  width: 14px;
  height: 14px;
}

.preset-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 250px;
  background: #18191d;
  border: 2px solid #2f323a;
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  padding: 6px;
  z-index: 50;
  backdrop-filter: blur(12px);
}

.preset-menu-title {
  font-size: 10px;
  font-weight: 800;
  color: #8b8e97;
  padding: 8px 10px 4px;
  letter-spacing: 0.06em;
}

.preset-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: #e2e4e9;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}

.preset-item:hover, .preset-item.active {
  background: #292c34;
  color: #ff9800;
}

.preset-item-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.preset-item-meta {
  display: block;
  font-size: 10.5px;
  color: #8b8e97;
}

.check-mark {
  color: #ff9800;
  font-weight: 800;
}

/* REC BUTTON */
.rec-btn {
  padding: 0 10px;
}

.rec-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #23252a;
  transition: all 0.2s ease;
}

.rec-btn.recording {
  background: #d32f2f;
  color: #fff;
  border-color: #9a0007;
  animation: pulse-rec 1s infinite alternate;
}

.rec-btn.recording .rec-dot {
  background: #fff;
  box-shadow: 0 0 8px #fff;
}

@keyframes pulse-rec {
  0% { transform: scale(1); }
  100% { transform: scale(1.04); }
}

/* LOOP BUTTON */
.loop-btn.active {
  background: #111;
  color: #ff9800;
  border-color: #ff9800;
}

.loop-btn.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* BANK BUTTON */
.bank-btn {
  font-weight: 900;
  min-width: 44px;
}

.bank-label {
  font-size: 10px;
  opacity: 0.8;
}

.bank-val {
  font-size: 14px;
  color: #111;
}

.bank-btn.bank-b {
  background: #111;
  color: #ff9800;
}

.bank-btn.bank-b .bank-val {
  color: #ff9800;
}

/* FULLSCREEN BUTTON */
.fullscreen-btn {
  padding: 0 8px;
}

.fullscreen-text {
  font-size: 10px;
  font-weight: 800;
}

.fullscreen-btn.active {
  background: #111;
  color: #ff9800;
}

/* ==========================================================
   PADS GRID (3 cols x 4 rows)
========================================================== */
.pads-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  padding: 12px;
  background: #191b1f;
  flex: 1;
  min-height: 380px;
}

.drum-pad {
  position: relative;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  touch-action: none;
  border-radius: 10px;
}

/* 3D RUBBER PAD SURFACE */
.pad-surface {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 7px 6px;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  transition: transform 0.05s ease, filter 0.05s ease, box-shadow 0.05s ease;
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.35),
    inset 0 -3px 4px rgba(0, 0, 0, 0.45),
    0 4px 8px rgba(0, 0, 0, 0.6);
}

/* Center Radial Glow */
.pad-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.85;
  pointer-events: none;
}

/* Active press compression */
.drum-pad:active .pad-surface,
.drum-pad.is-active .pad-surface {
  transform: scale(0.96) translateY(2px);
  filter: brightness(1.35);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 18px currentColor;
}

/* Flash ring on hit */
.pad-flash-ring {
  position: absolute;
  inset: -2px;
  border-radius: 12px;
  border: 2px solid #ffffff;
  pointer-events: none;
  animation: flash-anim 0.2s ease-out forwards;
}

@keyframes flash-anim {
  0% { opacity: 0.9; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.08); }
}

/* ==========================================================
   PAD COLOR THEMES (Exact Drum Pads 24 Palette)
========================================================== */

/* LIME GREEN */
.pad-green .pad-surface {
  background: linear-gradient(145deg, #78c81d 0%, #57980e 100%);
  color: #a7ff3b;
}
.pad-green .pad-glow {
  background: radial-gradient(circle at 50% 45%, #bfff50 0%, #76c51b 50%, #467e0b 100%);
}

/* PURPLE / MAGENTA */
.pad-purple .pad-surface {
  background: linear-gradient(145deg, #b83cd9 0%, #7c1a96 100%);
  color: #f17aff;
}
.pad-purple .pad-glow {
  background: radial-gradient(circle at 50% 45%, #f47bff 0%, #b235d2 50%, #68117f 100%);
}

/* CYAN BLUE */
.pad-cyan .pad-surface {
  background: linear-gradient(145deg, #09a9db 0%, #056e92 100%);
  color: #4df0ff;
}
.pad-cyan .pad-glow {
  background: radial-gradient(circle at 50% 45%, #66f4ff 0%, #069fd0 50%, #045a78 100%);
}

/* ORANGE */
.pad-orange .pad-surface {
  background: linear-gradient(145deg, #f78d16 0%, #c16304 100%);
  color: #ffc47d;
}
.pad-orange .pad-glow {
  background: radial-gradient(circle at 50% 45%, #ffd485 0%, #ef850e 50%, #9a4e03 100%);
}

/* KEY BADGE */
.pad-key-badge {
  align-self: flex-end;
  display: inline-block;
  font-size: 10px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.4);
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 2;
}

/* PAD LABELS */
.pad-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.pad-label {
  font-size: 13.5px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.04em;
  line-height: 1.1;
}

.pad-sublabel {
  font-size: 9.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  margin-top: 2px;
}

/* Extra distinction for bottom row (Kick, Hat, Snare) */
.is-kick .pad-label,
.is-hat .pad-label,
.is-snare .pad-label {
  font-size: 15px;
  letter-spacing: 0.06em;
}

/* FOOTER BAR */
.machine-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #141518;
  border-top: 2px solid #23252a;
  font-size: 11px;
  font-weight: 700;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #92959e;
}

.footer-tag {
  color: #ff9800;
}

.footer-divider {
  opacity: 0.4;
}

.footer-brand {
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #646770;
  font-size: 10px;
}

/* RESPONSIVE TWEAKS */
@media (max-width: 480px) {
  .machine-header {
    padding: 6px 8px;
  }
  .header-btn {
    height: 34px;
    padding: 0 6px;
    font-size: 12px;
  }
  .preset-name-badge {
    max-width: 75px;
    font-size: 10.5px;
  }
  .pads-grid {
    gap: 8px;
    padding: 8px;
    min-height: 340px;
  }
  .pad-label {
    font-size: 12px;
  }
  .pad-sublabel {
    font-size: 8.5px;
  }
  .is-kick .pad-label,
  .is-hat .pad-label,
  .is-snare .pad-label {
    font-size: 13.5px;
  }
}
</style>

