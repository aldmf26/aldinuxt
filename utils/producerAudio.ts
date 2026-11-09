// Production-grade Web Audio sound generator for Drum Pads 24 and Piano Studio.
// Zero external sample dependencies: instant loading, zero latency, and rich analog/digital synthesis.

let ctx: AudioContext | undefined
let masterCompressor: DynamicsCompressorNode | undefined
let masterGain: GainNode | undefined
let noiseBuffer: AudioBuffer | undefined
let distortionNode: WaveShaperNode | undefined

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AudioCtx()
    
    // Master Compressor prevents clipping when drumming heavily
    masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-12, ctx.currentTime)
    masterCompressor.knee.setValueAtTime(20, ctx.currentTime)
    masterCompressor.ratio.setValueAtTime(10, ctx.currentTime)
    masterCompressor.attack.setValueAtTime(0.003, ctx.currentTime)
    masterCompressor.release.setValueAtTime(0.15, ctx.currentTime)

    masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.92, ctx.currentTime)

    masterCompressor.connect(masterGain)
    masterGain.connect(ctx.destination)

    // Pre-generate 1-second white noise buffer
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const channelData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.random() * 2 - 1
    }

    // Warm tanh saturation curve for 808 & kicks
    distortionNode = ctx.createWaveShaper()
    const n = 512
    const curve = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1
      curve[i] = Math.tanh(2.2 * x)
    }
    distortionNode.curve = curve
    distortionNode.connect(masterCompressor)
  }

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }

  return ctx
}

const env = (g: GainNode, t: number, peak: number, decay: number) => {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
}

function noiseBurst(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 1) {
  const c = getAudioContext()
  const src = c.createBufferSource()
  src.buffer = noiseBuffer!
  const flt = c.createBiquadFilter()
  flt.type = type
  flt.frequency.setValueAtTime(freq, t)
  flt.Q.setValueAtTime(q, t)

  const g = c.createGain()
  env(g, t, peak, dur)

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
  env(g, t, peak, decay)

  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + decay + 0.05)
}

/* ==========================================================
   DRUM SOUND GENERATORS (PRESET SPECIFIC)
========================================================== */

export type PresetId = 'trap' | 'boombap' | 'edm' | 'drill' | 'lofi'

export interface PadConfig {
  id: string
  name: string
  category: 'kick' | 'hihat' | 'snare' | 'bass' | 'perc' | 'clap' | 'fx' | 'melody'
  color: 'green' | 'purple' | 'cyan' | 'orange'
  key: string
  numpad: string
  play: (preset: PresetId) => void
}

export const drumAudio = {
  // BOTTOM 3 PADS: Guaranteed Kick, Hi-Hats, Snare
  kick(preset: PresetId = 'trap') {
    const c = getAudioContext()
    const t = c.currentTime
    if (preset === 'trap') {
      // Hard punchy trap kick with sub drop
      toneSweep(t, 'sine', 165, 42, 0.08, 1.2, 0.35, distortionNode)
      noiseBurst(t, 0.012, 'highpass', 3500, 0.3, 1)
      toneSweep(t, 'triangle', 95, 38, 0.05, 0.4, 0.15)
    } else if (preset === 'boombap') {
      // Warm dusty 90s hip-hop kick
      toneSweep(t, 'sine', 130, 38, 0.1, 1.1, 0.42, distortionNode)
      noiseBurst(t, 0.02, 'bandpass', 1200, 0.18, 2)
    } else if (preset === 'edm') {
      // Punchy 4-on-the-floor electro kick
      toneSweep(t, 'sine', 180, 48, 0.07, 1.3, 0.3, distortionNode)
      noiseBurst(t, 0.015, 'highpass', 4500, 0.4, 1.2)
      toneSweep(t, 'square', 70, 40, 0.04, 0.25, 0.08)
    } else if (preset === 'drill') {
      // Knocking drill kick with aggressive transient
      toneSweep(t, 'sine', 175, 45, 0.06, 1.25, 0.28, distortionNode)
      noiseBurst(t, 0.018, 'bandpass', 2400, 0.35, 1.5)
    } else {
      // Lo-Fi mellow pillow kick
      toneSweep(t, 'sine', 110, 36, 0.11, 0.95, 0.38)
      noiseBurst(t, 0.025, 'lowpass', 600, 0.12, 1)
    }
  },

  hihat(preset: PresetId = 'trap', open = false) {
    const c = getAudioContext()
    const t = c.currentTime
    const dur = open ? 0.32 : (preset === 'drill' ? 0.035 : 0.045)
    const peak = open ? 0.45 : 0.4

    if (preset === 'trap' || preset === 'drill') {
      // Crisp metallic 808/drill trap hat
      noiseBurst(t, dur, 'highpass', 8500, peak, 1.2)
      toneSweep(t, 'square', 4500, 3800, 0.02, 0.12, dur * 0.6)
    } else if (preset === 'boombap') {
      // Dusty acoustic vinyl hat
      noiseBurst(t, dur, 'bandpass', 5800, peak * 0.9, 1.8)
      noiseBurst(t, dur * 0.5, 'highpass', 8000, peak * 0.3)
    } else if (preset === 'edm') {
      // Sizzling bright electro hat
      noiseBurst(t, dur, 'highpass', 9200, peak * 1.1, 1.4)
    } else {
      // Darkened warm lo-fi hat
      noiseBurst(t, dur, 'bandpass', 4200, peak * 0.8, 2.2)
    }
  },

  snare(preset: PresetId = 'trap') {
    const c = getAudioContext()
    const t = c.currentTime
    if (preset === 'trap') {
      // Tight cracking trap snare
      toneSweep(t, 'triangle', 220, 160, 0.04, 0.65, 0.12)
      noiseBurst(t, 0.18, 'highpass', 1900, 0.65, 1.1)
      noiseBurst(t, 0.06, 'bandpass', 3800, 0.35, 2)
    } else if (preset === 'boombap') {
      // Fat layered vinyl snare with body
      toneSweep(t, 'sine', 190, 130, 0.06, 0.7, 0.18)
      noiseBurst(t, 0.24, 'bandpass', 1600, 0.55, 1.3)
      noiseBurst(t, 0.1, 'highpass', 4000, 0.25)
    } else if (preset === 'edm') {
      // Huge electro punch snare with white noise tail
      toneSweep(t, 'triangle', 250, 170, 0.05, 0.8, 0.14)
      noiseBurst(t, 0.28, 'highpass', 1500, 0.85, 1)
      noiseBurst(t + 0.015, 0.15, 'bandpass', 2400, 0.4)
    } else if (preset === 'drill') {
      // Sharp drill rim-snare
      toneSweep(t, 'triangle', 280, 210, 0.03, 0.7, 0.09)
      noiseBurst(t, 0.14, 'highpass', 2800, 0.7, 1.5)
    } else {
      // Warm lo-fi snap snare
      toneSweep(t, 'sine', 170, 120, 0.07, 0.5, 0.15)
      noiseBurst(t, 0.16, 'bandpass', 1400, 0.4, 2)
    }
  },

  // 808 SUB BASS
  bass808(preset: PresetId = 'trap', pitch = 45) {
    const c = getAudioContext()
    const t = c.currentTime
    const glide = preset === 'drill' ? 0.12 : 0.06
    const dur = preset === 'drill' ? 1.4 : 1.8
    toneSweep(t, 'sine', pitch * 2, pitch, glide, 1.1, dur, distortionNode)
    // subtle upper harmonic
    toneSweep(t, 'triangle', pitch * 2, pitch * 2, 0, 0.25, dur * 0.4, distortionNode)
  },

  // CLAP
  clap() {
    const c = getAudioContext()
    const t = c.currentTime
    for (const off of [0, 0.011, 0.022]) {
      noiseBurst(t + off, 0.016, 'bandpass', 1400, 0.55, 1)
    }
    noiseBurst(t + 0.032, 0.22, 'bandpass', 1350, 0.6, 0.9)
  },

  // OPEN HI-HAT / CYMBAL
  openHat(preset: PresetId = 'trap') {
    drumAudio.hihat(preset, true)
  },

  // PERCUSSION / COWBELL / RIMSHOT
  perc(preset: PresetId = 'trap', variant: 'cowbell' | 'rim' | 'wood' = 'cowbell') {
    const c = getAudioContext()
    const t = c.currentTime
    if (variant === 'cowbell') {
      // Iconic 808 cowbell (two tuned square waves)
      toneSweep(t, 'square', 587, 0, 0, 0.28, 0.28)
      toneSweep(t, 'square', 845, 0, 0, 0.25, 0.28)
    } else if (variant === 'rim') {
      toneSweep(t, 'sine', 1600, 0, 0, 0.4, 0.035)
      noiseBurst(t, 0.022, 'bandpass', 2600, 0.45, 3)
    } else {
      // Woodblock
      toneSweep(t, 'sine', 980, 420, 0.02, 0.5, 0.07)
    }
  },

  // CHANT / VOX / SHOUT
  vox(type: 'hey' | 'yeah' | 'drop' | 'drill' = 'hey') {
    const c = getAudioContext()
    const t = c.currentTime
    if (type === 'hey') {
      toneSweep(t, 'sawtooth', 360, 240, 0.1, 0.35, 0.22)
      noiseBurst(t, 0.18, 'bandpass', 1200, 0.45, 2.5)
    } else if (type === 'yeah') {
      toneSweep(t, 'sawtooth', 420, 310, 0.14, 0.38, 0.28)
      noiseBurst(t, 0.2, 'bandpass', 1800, 0.4, 2)
    } else if (type === 'drop') {
      toneSweep(t, 'sawtooth', 280, 110, 0.18, 0.45, 0.35)
      noiseBurst(t, 0.25, 'highpass', 2200, 0.35)
    } else {
      // Drill low grunt / vox
      toneSweep(t, 'sawtooth', 180, 90, 0.16, 0.5, 0.3)
      noiseBurst(t, 0.15, 'bandpass', 850, 0.4, 3)
    }
  },

  // MELODY / PLUCK / SYNTH STAB / CHORD
  melody(f = 330, type: 'pluck' | 'brass' | 'rhodes' | 'flute' = 'pluck') {
    const c = getAudioContext()
    const t = c.currentTime
    if (type === 'pluck') {
      toneSweep(t, 'triangle', f, 0, 0, 0.5, 0.5)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.25, 0.35)
      toneSweep(t, 'sine', f * 3, 0, 0, 0.12, 0.2)
    } else if (type === 'brass') {
      toneSweep(t, 'sawtooth', f, f * 0.98, 0.06, 0.4, 0.6)
      toneSweep(t, 'sawtooth', f * 1.5, f * 1.48, 0.06, 0.25, 0.55)
    } else if (type === 'rhodes') {
      toneSweep(t, 'sine', f, 0, 0, 0.5, 0.9)
      toneSweep(t, 'sine', f * 2, 0, 0, 0.25, 0.6)
      toneSweep(t, 'triangle', f * 0.5, 0, 0, 0.3, 0.8)
    } else {
      // Flute / high whistle
      toneSweep(t, 'sine', f * 2, 0, 0, 0.4, 0.5)
      noiseBurst(t, 0.1, 'bandpass', f * 2, 0.08, 4)
    }
  },

  // SPECIAL FX (Laser / Scratch / Riser / Vinyl)
  fx(variant: 'laser' | 'scratch' | 'riser' | 'stop' = 'laser') {
    const c = getAudioContext()
    const t = c.currentTime
    if (variant === 'laser') {
      toneSweep(t, 'sawtooth', 2400, 80, 0.16, 0.4, 0.2)
    } else if (variant === 'scratch') {
      toneSweep(t, 'sine', 400, 1600, 0.07, 0.3, 0.12)
      toneSweep(t + 0.07, 'sine', 1600, 300, 0.08, 0.3, 0.14)
      noiseBurst(t, 0.15, 'bandpass', 2000, 0.25, 3)
    } else if (variant === 'riser') {
      toneSweep(t, 'sawtooth', 120, 1800, 0.45, 0.35, 0.5)
      noiseBurst(t, 0.45, 'highpass', 3000, 0.25)
    } else {
      // Tape stop pitch down
      toneSweep(t, 'sine', 480, 40, 0.25, 0.4, 0.3)
      noiseBurst(t, 0.2, 'lowpass', 800, 0.2)
    }
  }
}

/* ==========================================================
   PIANO SYNTHESIZER VOICE
========================================================== */

export type PianoVoice = 'grand' | 'rhodes' | 'synth' | 'subbass'

export function playPianoNote(freq: number, voice: PianoVoice = 'grand') {
  const c = getAudioContext()
  const t = c.currentTime

  if (voice === 'grand') {
    // Rich acoustic piano: warm harmonics filtered through decay
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(Math.min(9500, freq * 14), t)
    lp.frequency.exponentialRampToValueAtTime(Math.max(450, freq * 2), t + 1.4)
    lp.connect(masterCompressor!)

    for (const [harmonic, amp, dec] of [
      [1, 0.55, 2.2],
      [2, 0.24, 1.4],
      [3, 0.12, 0.9],
      [4, 0.06, 0.5],
      [5.02, 0.03, 0.35]
    ]) {
      toneSweep(t, 'sine', freq * harmonic, 0, 0, amp, dec, lp)
    }
    toneSweep(t, 'triangle', freq * 1.002, 0, 0, 0.15, 1.8, lp)
    noiseBurst(t, 0.015, 'highpass', 3200, 0.06)
  } else if (voice === 'rhodes') {
    // Bell-like electric piano (Rhodes tone)
    const lp = c.createBiquadFilter()
    lp.type = 'bandpass'
    lp.frequency.setValueAtTime(freq * 1.8, t)
    lp.Q.setValueAtTime(1.5, t)
    lp.connect(masterCompressor!)

    toneSweep(t, 'sine', freq, 0, 0, 0.7, 2.0)
    toneSweep(t, 'sine', freq * 2, 0, 0, 0.35, 1.2)
    toneSweep(t, 'sine', freq * 4, 0, 0, 0.15, 0.5, lp)
    toneSweep(t, 'triangle', freq * 0.5, 0, 0, 0.3, 1.6)
  } else if (voice === 'synth') {
    // Warm analog poly-synth
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(freq * 3, t)
    lp.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 1.6)
    lp.connect(masterCompressor!)

    toneSweep(t, 'sawtooth', freq, 0, 0, 0.45, 1.6, lp)
    toneSweep(t, 'sawtooth', freq * 1.006, 0, 0, 0.45, 1.6, lp)
    toneSweep(t, 'triangle', freq * 0.5, 0, 0, 0.3, 1.8, lp)
  } else {
    // 808 Bass Key
    toneSweep(t, 'sine', freq * 0.5, freq * 0.48, 0.08, 0.9, 1.8, distortionNode)
    toneSweep(t, 'triangle', freq * 0.5, 0, 0, 0.25, 0.8, distortionNode)
  }
}

