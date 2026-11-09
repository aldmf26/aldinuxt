// Real CDN Sample Loader & Web Audio Engine for Drum Pads 24 and Piano Studio.
// Uses real studio audio samples (.wav/.mp3) from fast public CDNs with automatic caching
// and instant Web Audio synthesis fallback so sound ALWAYS plays with zero latency.

let ctx: AudioContext | undefined
let masterCompressor: DynamicsCompressorNode | undefined
let masterGain: GainNode | undefined
let noiseBuffer: AudioBuffer | undefined
let distortionNode: WaveShaperNode | undefined

// Memory cache for decoded AudioBuffers
const sampleCache = new Map<string, AudioBuffer>()
const loadingPromises = new Map<string, Promise<AudioBuffer | null>>()

export function getAudioContext(): AudioContext {
  if (!ctx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AudioCtx()

    // Master Compressor
    masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-14, ctx.currentTime)
    masterCompressor.knee.setValueAtTime(20, ctx.currentTime)
    masterCompressor.ratio.setValueAtTime(8, ctx.currentTime)
    masterCompressor.attack.setValueAtTime(0.002, ctx.currentTime)
    masterCompressor.release.setValueAtTime(0.12, ctx.currentTime)

    // Master Gain
    masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(1.0, ctx.currentTime)

    masterCompressor.connect(masterGain)
    masterGain.connect(ctx.destination)

    // 1-second white noise buffer
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const channelData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.random() * 2 - 1
    }

    // Warm wave shaper
    distortionNode = ctx.createWaveShaper()
    const n = 512
    const curve = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1
      curve[i] = Math.tanh(2.0 * x)
    }
    distortionNode.curve = curve
    distortionNode.connect(masterCompressor)
  }

  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }

  return ctx!
}

// Global user interaction listener to unlock AudioContext
if (typeof window !== 'undefined') {
  const unlock = () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('touchstart', unlock, { passive: true })
  window.addEventListener('keydown', unlock, { passive: true })
}

/* ==========================================================
   CDN SAMPLE LOADER & CACHER
========================================================== */
export async function loadSample(url: string): Promise<AudioBuffer | null> {
  if (sampleCache.has(url)) return sampleCache.get(url)!
  if (loadingPromises.has(url)) return loadingPromises.get(url)!

  const p = (async () => {
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
    }
  })()

  loadingPromises.set(url, p)
  return p
}

export function playBuffer(buffer: AudioBuffer, volume = 1.0) {
  const c = getAudioContext()
  if (!c || c.state === 'suspended') c.resume()

  const src = c.createBufferSource()
  src.buffer = buffer

  const gain = c.createGain()
  gain.gain.setValueAtTime(volume, c.currentTime)

  src.connect(gain).connect(masterCompressor!)
  src.start(c.currentTime)
}

/* ==========================================================
   FAST PUBLIC CDN SAMPLES (FreeCodeCamp & GitHub/Tone.js)
========================================================== */
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

// Preload core drum samples immediately
if (typeof window !== 'undefined') {
  setTimeout(() => {
    Object.values(CDN_DRUMS).forEach(url => loadSample(url))
  }, 1000)
}

/* ==========================================================
   SYNTHESIS FALLBACK UTILITIES
========================================================== */
const safeEnv = (g: GainNode, t: number, peak: number, decay: number) => {
  g.gain.cancelScheduledValues(t)
  g.gain.setValueAtTime(0.001, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.02, decay))
}

function noiseBurst(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 1) {
  const c = getAudioContext()
  if (!noiseBuffer) return
  const src = c.createBufferSource()
  src.buffer = noiseBuffer
  const flt = c.createBiquadFilter()
  flt.type = type
  flt.frequency.setValueAtTime(freq, t)
  flt.Q.setValueAtTime(q, t)

  const g = c.createGain()
  safeEnv(g, t, peak, dur)

  src.connect(flt).connect(g).connect(masterCompressor!)
  src.start(t, Math.random() * 0.4)
  src.stop(t + dur + 0.05)
}

function toneSweep(
  t: number,
  type: OscillatorType,
  f0: number,
  f1: number,
  glide: number,
  peak: number,
  decay: number,
  dest: AudioNode = masterCompressor!
) {
  const c = getAudioContext()
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(f0, t)
  if (f1 > 0 && glide > 0) {
    osc.frequency.exponentialRampToValueAtTime(f1, t + glide)
  }

  const g = c.createGain()
  safeEnv(g, t, peak, decay)

  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + decay + 0.05)
}

/* ==========================================================
   DRUM SOUND GENERATORS (CDN SAMPLE + SYNTHESIS FALLBACK)
========================================================== */
export type PresetId = 'trap' | 'boombap' | 'edm' | 'drill' | 'lofi'

export const drumAudio = {
  // BOTTOM 3 PADS: Guaranteed Kick, Hi-Hats, Snare
  kick(preset: PresetId = 'trap') {
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.kick)
    if (buf) {
      playBuffer(buf, 1.1)
      return
    }
    // Web Audio Synthesis Fallback
    const t = Math.max(c.currentTime, 0.001) + 0.002
    toneSweep(t, 'sine', 165, 42, 0.08, 1.2, 0.35, distortionNode)
    noiseBurst(t, 0.015, 'highpass', 3500, 0.35, 1)
  },

  hihat(preset: PresetId = 'trap', open = false) {
    const c = getAudioContext()
    const url = open ? CDN_DRUMS.openhat : CDN_DRUMS.hihat
    const buf = sampleCache.get(url)
    if (buf) {
      playBuffer(buf, open ? 0.9 : 0.8)
      return
    }
    // Synthesis Fallback
    const t = Math.max(c.currentTime, 0.001) + 0.002
    const dur = open ? 0.32 : 0.045
    noiseBurst(t, dur, 'highpass', 8500, open ? 0.45 : 0.4, 1.2)
  },

  snare(preset: PresetId = 'trap') {
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.snare)
    if (buf) {
      playBuffer(buf, 1.0)
      return
    }
    // Synthesis Fallback
    const t = Math.max(c.currentTime, 0.001) + 0.002
    toneSweep(t, 'triangle', 220, 160, 0.04, 0.7, 0.12)
    noiseBurst(t, 0.18, 'highpass', 1900, 0.7, 1.1)
  },

  openHat(preset: PresetId = 'trap') {
    drumAudio.hihat(preset, true)
  },

  clap() {
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.clap)
    if (buf) {
      playBuffer(buf, 0.95)
      return
    }
    const t = Math.max(c.currentTime, 0.001) + 0.002
    noiseBurst(t, 0.02, 'bandpass', 1400, 0.55)
    noiseBurst(t + 0.015, 0.02, 'bandpass', 1400, 0.55)
    noiseBurst(t + 0.03, 0.2, 'bandpass', 1350, 0.6)
  },

  bass808(preset: PresetId = 'trap', pitch = 45) {
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.boom)
    if (buf && pitch <= 48) {
      playBuffer(buf, 1.2)
      return
    }
    const t = Math.max(c.currentTime, 0.001) + 0.002
    toneSweep(t, 'sine', pitch * 2, pitch, 0.07, 1.2, 1.6, distortionNode)
    toneSweep(t, 'triangle', pitch * 2, pitch * 2, 0, 0.3, 0.6, distortionNode)
  },

  perc(preset: PresetId = 'trap', variant: 'cowbell' | 'rim' | 'wood' = 'cowbell') {
    const c = getAudioContext()
    const buf = sampleCache.get(CDN_DRUMS.tink)
    if (buf && variant !== 'cowbell') {
      playBuffer(buf, 0.9)
      return
    }
    const t = Math.max(c.currentTime, 0.001) + 0.002
    if (variant === 'cowbell') {
      toneSweep(t, 'square', 587, 0, 0, 0.32, 0.3)
      toneSweep(t, 'square', 845, 0, 0, 0.28, 0.3)
    } else {
      toneSweep(t, 'sine', 1600, 0, 0, 0.45, 0.04)
      noiseBurst(t, 0.025, 'bandpass', 2600, 0.45, 3)
    }
  },

  vox(type: 'hey' | 'yeah' | 'drop' | 'drill' = 'hey') {
    const c = getAudioContext()
    const t = Math.max(c.currentTime, 0.001) + 0.002
    if (type === 'hey') {
      toneSweep(t, 'sawtooth', 360, 240, 0.1, 0.4, 0.24)
      noiseBurst(t, 0.18, 'bandpass', 1200, 0.45, 2.5)
    } else if (type === 'drop') {
      toneSweep(t, 'sawtooth', 280, 110, 0.18, 0.48, 0.35)
      noiseBurst(t, 0.25, 'highpass', 2200, 0.4)
    } else {
      toneSweep(t, 'sawtooth', 420, 310, 0.14, 0.4, 0.28)
      noiseBurst(t, 0.2, 'bandpass', 1800, 0.4, 2)
    }
  },

  melody(f = 330, type: 'pluck' | 'brass' | 'rhodes' | 'flute' = 'pluck') {
    const c = getAudioContext()
    const t = Math.max(c.currentTime, 0.001) + 0.002
    if (type === 'pluck') {
      toneSweep(t, 'triangle', f, 0, 0, 0.55, 0.6)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.3, 0.4)
    } else if (type === 'brass') {
      toneSweep(t, 'sawtooth', f, f * 0.98, 0.06, 0.45, 0.65)
    } else if (type === 'rhodes') {
      toneSweep(t, 'sine', f, 0, 0, 0.55, 1.0)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.28, 0.6)
    } else {
      toneSweep(t, 'sine', f * 2, 0, 0, 0.45, 0.55)
    }
  },

  fx(variant: 'laser' | 'scratch' | 'riser' | 'stop' = 'laser') {
    const c = getAudioContext()
    const t = Math.max(c.currentTime, 0.001) + 0.002
    if (variant === 'laser') {
      toneSweep(t, 'sawtooth', 2400, 80, 0.16, 0.45, 0.22)
    } else if (variant === 'scratch') {
      toneSweep(t, 'sine', 400, 1600, 0.07, 0.35, 0.14)
      toneSweep(t + 0.07, 'sine', 1600, 300, 0.08, 0.35, 0.15)
    } else if (variant === 'riser') {
      toneSweep(t, 'sawtooth', 120, 1800, 0.45, 0.4, 0.5)
      noiseBurst(t, 0.45, 'highpass', 3000, 0.3)
    } else {
      toneSweep(t, 'sine', 480, 40, 0.25, 0.45, 0.32)
    }
  }
}

/* ==========================================================
   PIANO CDN SAMPLER & SYNTHESIS
========================================================== */
export type PianoVoice = 'grand' | 'rhodes' | 'synth' | 'subbass'

// Base CDN for real Yamaha Grand Piano notes
const PIANO_CDN_BASE = 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/acoustic_grand_piano-mp3/'
const RHODES_CDN_BASE = 'https://cdn.jsdelivr.net/gh/gleitz/midi-js-soundfonts@gh-pages/FluidR3_GM/electric_piano_1-mp3/'

const NOTE_NAMES_SHARP = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export function getPianoSampleUrl(midiNote: number, voice: PianoVoice): string | null {
  if (voice === 'synth' || voice === 'subbass') return null
  const noteName = NOTE_NAMES_SHARP[midiNote % 12]
  const oct = Math.floor(midiNote / 12) - 1
  const fileName = `${noteName}${oct}.mp3`
  return (voice === 'rhodes' ? RHODES_CDN_BASE : PIANO_CDN_BASE) + fileName
}

export function playPianoNote(freq: number, voice: PianoVoice = 'grand', midiNote?: number) {
  const c = getAudioContext()
  if (c.state === 'suspended') c.resume()

  // Try real CDN sample if available
  if (midiNote !== undefined) {
    const url = getPianoSampleUrl(midiNote, voice)
    if (url) {
      const cached = sampleCache.get(url)
      if (cached) {
        playBuffer(cached, 1.0)
        return
      } else {
        // Trigger background load for future taps
        loadSample(url)
      }
    }
  }

  // Instant Web Audio Voice Fallback
  const t = Math.max(c.currentTime, 0.001) + 0.002
  if (voice === 'grand') {
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'
    lp.frequency.setValueAtTime(Math.min(9500, freq * 14), t)
    lp.connect(masterCompressor!)
    toneSweep(t, 'sine', freq, 0, 0, 0.65, 1.8, lp)
    toneSweep(t, 'sine', freq * 2, 0, 0, 0.3, 1.2, lp)
    toneSweep(t, 'triangle', freq * 1.002, 0, 0, 0.2, 1.4, lp)
  } else if (voice === 'rhodes') {
    toneSweep(t, 'sine', freq, 0, 0, 0.7, 1.8)
    toneSweep(t, 'sine', freq * 2, 0, 0, 0.35, 1.1)
  } else if (voice === 'synth') {
    toneSweep(t, 'sawtooth', freq, 0, 0, 0.5, 1.5)
    toneSweep(t, 'sawtooth', freq * 1.006, 0, 0, 0.5, 1.5)
  } else {
    toneSweep(t, 'sine', freq * 0.5, freq * 0.48, 0.08, 0.95, 1.8, distortionNode)
  }
}
