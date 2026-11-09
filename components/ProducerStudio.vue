<template>
  <div class="producer-studio">
    <!-- INSTRUMENT MODE SWITCHER (Drum Pad vs Piano) -->
    <div class="instrument-nav" role="tablist" aria-label="Pilih Instrumen Producer">
      <button
        type="button"
        role="tab"
        :aria-selected="currentInstrument === 'drumpad'"
        class="inst-tab"
        :class="{ active: currentInstrument === 'drumpad' }"
        @click="currentInstrument = 'drumpad'"
      >
        <span class="tab-icon">🥁</span>
        <span class="tab-text">Drum Pads 24</span>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="currentInstrument === 'piano'"
        class="inst-tab"
        :class="{ active: currentInstrument === 'piano' }"
        @click="currentInstrument = 'piano'"
      >
        <span class="tab-icon">🎹</span>
        <span class="tab-text">Piano Keys</span>
      </button>
    </div>

    <!-- ACTIVE INSTRUMENT VIEW -->
    <div class="instrument-view">
      <transition name="instrument-fade" mode="out-in">
        <div v-if="currentInstrument === 'drumpad'" key="drumpad" class="instrument-pane">
          <DrumPadMachine />
        </div>
        <div v-else key="piano" class="instrument-pane">
          <PianoKeyboard />
        </div>
      </transition>
    </div>

    <!-- HINT FOR USER (Desktop vs Touch) -->
    <div class="producer-hints">
      <p v-if="currentInstrument === 'drumpad'" class="hint-line">
        <span class="hint-desktop">
          ⌨️ Desktop: <b>1 2 3</b> · <b>Q W E</b> · <b>A S D</b> · Baris bawah: <b>Z (Kick)</b> · <b>X (Hi-Hats)</b> · <b>C (Snare)</b> · Tahan <b>X</b> untuk Roll
        </span>
        <span class="hint-mobile">
          👆 Multi-touch finger drumming · Tekan <b>FULL</b> untuk pengalaman layar penuh seperti aplikasi Android
        </span>
      </p>
      <p v-else class="hint-line">
        <span class="hint-desktop">
          ⌨️ Desktop: <b>Q</b> = C4, <b>2</b> = C#, <b>W</b> = D, <b>3</b> = D#, <b>E</b> = E, <b>R</b> = F · Klik atau geser tuts
        </span>
        <span class="hint-mobile">
          🎹 Sentuh & geser tuts untuk glissando · Tekan <b>FULL</b> untuk layar penuh
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentInstrument = ref<'drumpad' | 'piano'>('drumpad')
</script>

<style scoped>
.producer-studio {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

/* INSTRUMENT TABS */
.instrument-nav {
  display: inline-flex;
  background: var(--bg-surface, #1e2025);
  padding: 5px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  margin-bottom: 14px;
  gap: 4px;
}

.inst-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--text-muted, #8b8e97);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.inst-tab:hover {
  color: var(--text-primary, #ffffff);
}

.inst-tab.active {
  background: #ff9800;
  color: #121316;
  box-shadow: 0 2px 10px rgba(255, 152, 0, 0.35);
}

.tab-icon {
  font-size: 15px;
}

/* VIEW */
.instrument-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.instrument-pane {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* TRANSITION */
.instrument-fade-enter-active,
.instrument-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.instrument-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.instrument-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* HINTS */
.producer-hints {
  margin-top: 12px;
  text-align: center;
  padding: 0 16px;
}

.hint-line {
  font-size: 12.5px;
  color: var(--text-muted, #8b8e97);
  line-height: 1.5;
}

.hint-line b {
  color: #ff9800;
  font-weight: 700;
}

.hint-mobile {
  display: none;
}

@media (pointer: coarse), (max-width: 680px) {
  .hint-desktop {
    display: none;
  }
  .hint-mobile {
    display: inline;
  }
}
</style>

