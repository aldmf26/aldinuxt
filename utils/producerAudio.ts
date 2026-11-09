// Universal Mobile & Desktop Web Audio Engine for Drum Pads 24 and Piano Studio.
// Features:
// 1. Mobile Web Audio hardware unlock (iOS Safari & Android Chrome).
// 2. iOS Silent Mode audio session bypass (plays silent HTML5 audio buffer to route to speaker).
// 3. Lazy AudioContext creation (never created before user interaction to prevent browser autoplay blocking).
// 4. Safe linear gain envelopes (100% reliable across all WebKit and Chromium versions).
// 5. Zero-latency instant audio synthesis + background CDN sample enhancement.

let ctx: AudioContext | undefined
let masterGain: GainNode | undefined
let masterCompressor: DynamicsCompressorNode | undefined
let isAudioUnlocked = false

// Memory cache for audio buffers
const sampleCache = new Map<string, AudioBuffer>()
const pendingLoads = new Set<string>()

// Base64 0.05s silent WAV to wake up iOS hardware audio session
const SILENT_WAV = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='
let silentHtmlAudio: HTMLAudioElement | undefined

export function getAudioContext(): AudioContext {
  if (!ctx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AudioCtx()

    // Master Compressor prevents distortion when multiple pads hit
    masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-14, ctx.currentTime)
    masterCompressor.knee.setValueAtTime(24, ctx.currentTime)
    masterCompressor.ratio.setValueAtTime(8, ctx.currentTime)
    masterCompressor.attack.setValueAtTime(0.002, ctx.currentTime)
    masterCompressor.release.setValueAtTime(0.12, ctx.currentTime)

    // Master Gain (punchy output level)
    masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(1.15, ctx.currentTime)

    masterCompressor.connect(masterGain)
    masterGain.connect(ctx.destination)
  }

  return ctx!
}

/**
 * Robust Mobile Audio Unlocker for iOS Safari & Android
 * Must be triggered synchronously on touchstart, touchend, pointerdown, or click.
 */
export function unlockMobileAudio() {
  if (typeof window === 'undefined') return
  const c = getAudioContext()

  if (c && c.state === 'suspended') {
    c.resume().catch(() => {})
  }

  if (!isAudioUnlocked && c) {
    // 1. Play 1-sample silent Web Audio buffer directly to destination
    try {
      const buffer = c.createBuffer(1, 1, 22050)
      const src = c.createBufferSource()
      src.buffer = buffer
      src.connect(c.destination)
      src.start(0)
    } catch {}

    // 2. Play silent HTML5 audio to unlock iOS ringer / hardware mute switch
    try {
      if (!silentHtmlAudio) {
        silentHtmlAudio = new Audio(SILENT_WAV)
        silentHtmlAudio.volume = 0.01
      }
      silentHtmlAudio.play().then(() => {
        isAudioUnlocked = true
      }).catch(() => {})
    } catch {}

    isAudioUnlocked = true
  }
}

// Global user interaction listener to wake audio up on any first touch
if (typeof window !== 'undefined') {
  const onFirstTouch = () => {
    unlockMobileAudio()
  }
  window.addEventListener('touchstart', onFirstTouch, { passive: true })
  window.addEventListener('touchend', onFirstTouch, { passive: true })
  window.addEventListener('pointerdown', onFirstTouch, { passive: true })
  window.addEventListener('click', onFirstTouch, { passive: true })
  window.addEventListener('keydown', onFirstTouch, { passive: true })
}

/* ==========================================================
   SAFE AUDIO ENVELOPES (Never fails or throws on mobile)
========================================================== */
function safeEnv(g: GainNode, t: number, peak: number, decay: number) {
  g.gain.cancelScheduledValues(t)
  g.gain.setValueAtTime(0.001, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.004)
  g.gain.linearRampToValueAtTime(0.001, t + Math.max(0.02, decay))
}

function noiseBurst(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 1) {
  const c = getAudioContext()
  if (!c) return

  // Generate short noise buffer dynamically
  const sampleLength = Math.max(256, Math.floor(c.sampleRate * Math.min(dur + 0.05, 0.5)))
  const buf = c.createBuffer(1, sampleLength, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < sampleLength; i++) {
    d[i] = Math.random() * 2 - 1
  }

  const src = c.createBufferSource()
  src.buffer = buf

  const flt = c.createBiquadFilter()
  flt.type = type
  flt.frequency.setValueAtTime(freq, t)
  flt.Q.setValueAtTime(q, t)

  const g = c.createGain()
  safeEnv(g, t, peak, dur)

  src.connect(flt).connect(g).connect(masterCompressor!)
  src.start(t)
  src.stop(t + dur + 0.04)
}

function toneSweep(
  t: number,
  type: OscillatorType,
  f0: number,
  f1: number,
  glide: number,
  peak: number,
  decay: number
) {
  const c = getAudioContext()
  if (!c) return

  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(f0, t)
  if (f1 > 0 && glide > 0) {
    osc.frequency.linearRampToValueAtTime(f1, t + glide)
  }

  const g = c.createGain()
  safeEnv(g, t, peak, decay)

  osc.connect(g).connect(masterCompressor!)
  osc.start(t)
  osc.stop(t + decay + 0.04)
}

/* ==========================================================
   CDN SAMPLE CACHER & PLAYER
========================================================== */
export async function loadSample(url: string): Promise<AudioBuffer | null> {
  if (sampleCache.has(url)) return sampleCache.get(url)!
  if (pendingLoads.has(url)) return null
  pendingLoads.add(url)

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const c = getAudioContext()
    const decoded = await c.decodeAudioData(arrayBuffer)
    sampleCache.set(url, decoded)
    return decoded
  } catch {
    return null
  } finally {
    pendingLoads.delete(url)
  }
}

export function playBuffer(buffer: AudioBuffer, volume = 1.0) {
  const c = getAudioContext()
  if (c.state === 'suspended') c.resume().catch(() => {})

  const src = c.createBufferSource()
  src.buffer = buffer

  const gain = c.createGain()
  gain.gain.setValueAtTime(volume, c.currentTime)

  src.connect(gain).connect(masterCompressor!)
  src.start(c.currentTime)
}

export const CDN_DRUMS = {
  kick: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/kick.wav',
  snare: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav',
  hihat: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/hihat.wav',
  openhat: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav',
  clap: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/clap.wav',
  boom: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav',
  tom: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tom.wav',
  ride: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav',
  tink: 'https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tink.wav'
}

/* ==========================================================
   DRUM SOUND GENERATORS (100% Guaranteed Sound)
========================================================== */
export type PresetId = 'trap' | 'boombap' | 'edm' | 'drill' | 'lofi'

export const drumAudio = {
  // BOTTOM 3 PADS: Guaranteed Kick, Hi-Hats, Snare
  kick(preset: PresetId = 'trap') {
    unlockMobileAudio()
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.kick)
    if (buf) {
      playBuffer(buf, 1.15)
      return
    }

    // Direct punchy sub sweep synthesis
    const t = c.currentTime + 0.003
    toneSweep(t, 'sine', 160, 40, 0.07, 1.3, 0.35)
    toneSweep(t, 'triangle', 90, 36, 0.05, 0.6, 0.15)
    noiseBurst(t, 0.015, 'highpass', 3500, 0.35)
  },

  hihat(preset: PresetId = 'trap', open = false) {
    unlockMobileAudio()
    const c = getAudioContext()
    const url = open ? CDN_DRUMS.openhat : CDN_DRUMS.hihat
    const buf = sampleCache.get(url)
    if (buf) {
      playBuffer(buf, open ? 0.95 : 0.85)
      return
    }

    const t = c.currentTime + 0.003
    const dur = open ? 0.32 : 0.05
    noiseBurst(t, dur, 'highpass', 8000, open ? 0.5 : 0.45, 1.2)
  },

  snare(preset: PresetId = 'trap') {
    unlockMobileAudio()
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.snare)
    if (buf) {
      playBuffer(buf, 1.05)
      return
    }

    const t = c.currentTime + 0.003
    toneSweep(t, 'triangle', 210, 150, 0.04, 0.75, 0.12)
    noiseBurst(t, 0.18, 'highpass', 1800, 0.75, 1.2)
  },

  openHat(preset: PresetId = 'trap') {
    drumAudio.hihat(preset, true)
  },

  clap() {
    unlockMobileAudio()
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.clap)
    if (buf) {
      playBuffer(buf, 1.0)
      return
    }

    const t = c.currentTime + 0.003
    noiseBurst(t, 0.018, 'bandpass', 1350, 0.6)
    noiseBurst(t + 0.012, 0.018, 'bandpass', 1350, 0.6)
    noiseBurst(t + 0.026, 0.22, 'bandpass', 1300, 0.65)
  },

  bass808(preset: PresetId = 'trap', pitch = 45) {
    unlockMobileAudio()
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.boom)
    if (buf && pitch <= 48) {
      playBuffer(buf, 1.25)
      return
    }

    const t = c.currentTime + 0.003
    toneSweep(t, 'sine', pitch * 2, pitch, 0.07, 1.25, 1.6)
    toneSweep(t, 'triangle', pitch * 2, pitch * 2, 0, 0.35, 0.5)
  },

  perc(preset: PresetId = 'trap', variant: 'cowbell' | 'rim' | 'wood' = 'cowbell') {
    unlockMobileAudio()
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.tink)
    if (buf && variant !== 'cowbell') {
      playBuffer(buf, 0.95)
      return
    }

    const t = c.currentTime + 0.003
    if (variant === 'cowbell') {
      toneSweep(t, 'square', 587, 0, 0, 0.35, 0.28)
      toneSweep(t, 'square', 845, 0, 0, 0.3, 0.28)
    } else {
      toneSweep(t, 'sine', 1600, 0, 0, 0.5, 0.04)
      noiseBurst(t, 0.025, 'bandpass', 2600, 0.5, 3)
    }
  },

  vox(type: 'hey' | 'yeah' | 'drop' | 'drill' = 'hey') {
    unlockMobileAudio()
    const c = getAudioContext()
    const t = c.currentTime + 0.003
    if (type === 'hey') {
      toneSweep(t, 'sawtooth', 360, 240, 0.1, 0.45, 0.24)
      noiseBurst(t, 0.18, 'bandpass', 1200, 0.45, 2.5)
    } else if (type === 'drop') {
      toneSweep(t, 'sawtooth', 280, 110, 0.18, 0.5, 0.35)
      noiseBurst(t, 0.25, 'highpass', 2200, 0.45)
    } else {
      toneSweep(t, 'sawtooth', 420, 310, 0.14, 0.45, 0.28)
      noiseBurst(t, 0.2, 'bandpass', 1800, 0.4, 2)
    }
  },

  melody(f = 330, type: 'pluck' | 'brass' | 'rhodes' | 'flute' = 'pluck') {
    unlockMobileAudio()
    const c = getAudioContext()
    const t = c.currentTime + 0.003
    if (type === 'pluck') {
      toneSweep(t, 'triangle', f, 0, 0, 0.6, 0.6)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.35, 0.4)
    } else if (type === 'brass') {
      toneSweep(t, 'sawtooth', f, f * 0.98, 0.06, 0.5, 0.65)
    } else if (type === 'rhodes') {
      toneSweep(t, 'sine', f, 0, 0, 0.6, 1.0)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.3, 0.6)
    } else {
      toneSweep(t, 'sine', f * 2, 0, 0, 0.5, 0.55)
    }
  },

  fx(variant: 'laser' | 'scratch' | 'riser' | 'stop' = 'laser') {
    unlockMobileAudio()
    const c = getAudioContext()
    const t = c.currentTime + 0.003
    if (variant === 'laser') {
      toneSweep(t, 'sawtooth', 2400, 80, 0.16, 0.5, 0.22)
    } else if (variant === 'scratch') {
      toneSweep(t, 'sine', 400, 1600, 0.07, 0.4, 0.14)
      toneSweep(t + 0.07, 'sine', 1600, 300, 0.08, 0.4, 0.15)
    } else if (variant === 'riser') {
      toneSweep(t, 'sawtooth', 120, 1800, 0.45, 0.45, 0.5)
      noiseBurst(t, 0.45, 'highpass', 3000, 0.35)
    } else {
      toneSweep(t, 'sine', 480, 40, 0.25, 0.5, 0.32)
    }
  }
}

/* ==========================================================
   PIANO AUDIO ENGINE
========================================================== */
export type PianoVoice = 'grand' | 'rhodes' | 'synth' | 'subbass'

export function playPianoNote(freq: number, voice: PianoVoice = 'grand', midiNote?: number) {
  unlockMobileAudio()
  const c = getAudioContext()
  const t = c.currentTime + 0.003

  if (voice === 'grand') {
    toneSweep(t, 'sine', freq, 0, 0, 0.7, 1.8)
    toneSweep(t, 'sine', freq * 2, 0, 0, 0.35, 1.2)
    toneSweep(t, 'triangle', freq * 1.002, 0, 0, 0.25, 1.4)
  } else if (voice === 'rhodes') {
    toneSweep(t, 'sine', freq, 0, 0, 0.75, 1.8)
    toneSweep(t, 'sine', freq * 2, 0, 0, 0.38, 1.1)
  } else if (voice === 'synth') {
    toneSweep(t, 'sawtooth', freq, 0, 0, 0.55, 1.5)
    toneSweep(t, 'sawtooth', freq * 1.006, 0, 0, 0.55, 1.5)
  } else {
    toneSweep(t, 'sine', freq * 0.5, freq * 0.48, 0.08, 1.0, 1.8)
  }
}
