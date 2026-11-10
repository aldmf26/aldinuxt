// Web Audio engine for the pad machine. Every genre gets its own synthesized kit and its own
// output bus (trap bright, boom bap dusty and saturated, lo-fi muffled), so switching preset
// really changes the sound. Safe to import server-side: no window access at module level.

export type PresetId = 'trap' | 'boombap' | 'edm' | 'drill' | 'lofi'

let ctx: AudioContext | undefined
let master: DynamicsCompressorNode | undefined
let reverb: ConvolverNode | undefined
let noiseBuf: AudioBuffer | undefined
let isAudioUnlocked = false
const buses = new Map<PresetId, { dry: AudioNode; wet: GainNode }>()

// 0.05 s silent WAV that wakes the iOS audio session (ringer switch bypass)
const SILENT_WAV = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='
let silentHtmlAudio: HTMLAudioElement | undefined

export function getAudioContext(): AudioContext {
  if (!ctx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AudioCtx()
    master = ctx.createDynamicsCompressor()
    master.threshold.value = -12
    master.knee.value = 18
    master.ratio.value = 6
    master.attack.value = 0.003
    master.release.value = 0.15
    const out = ctx.createGain()
    out.gain.value = 1.1
    master.connect(out).connect(ctx.destination)

    // one shared white-noise second, reused by every hat/snare/clap
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1

    // small generated room for claps and snares
    reverb = ctx.createConvolver()
    const len = Math.floor(ctx.sampleRate * 1.6)
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
    }
    reverb.buffer = ir
    reverb.connect(master)
  }
  return ctx!
}

/** Mobile unlock (iOS Safari, Android). Call from a pointer/key handler. */
export function unlockMobileAudio() {
  if (typeof window === 'undefined') return
  const c = getAudioContext()
  if (c.state === 'suspended') c.resume().catch(() => {})
  if (isAudioUnlocked) return
  try {
    const src = c.createBufferSource()
    src.buffer = c.createBuffer(1, 1, 22050)
    src.connect(c.destination)
    src.start(0)
  } catch {}
  try {
    silentHtmlAudio ??= Object.assign(new Audio(SILENT_WAV), { volume: 0.01 })
    silentHtmlAudio.play().catch(() => {})
  } catch {}
  isAudioUnlocked = true
}

/* ---------- buses: the genre's colour ---------- */
function curve(amount: number) {
  const n = 1024, c = new Float32Array(n)
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(amount * x) / Math.tanh(amount) }
  return c
}

function bus(p: PresetId) {
  const c = getAudioContext()
  let b = buses.get(p)
  if (b) return b
  const input = c.createGain()
  const wet = c.createGain()
  let tail: AudioNode = input
  const chain = (n: AudioNode) => { tail.connect(n); tail = n }
  if (p === 'boombap' || p === 'lofi') {
    const sat = c.createWaveShaper(); sat.curve = curve(p === 'lofi' ? 1.6 : 2.2); sat.oversample = '2x'; chain(sat)
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = p === 'lofi' ? 4200 : 8500; lp.Q.value = 0.4; chain(lp)
    const vol = c.createGain(); vol.gain.value = p === 'lofi' ? 0.8 : 0.9; chain(vol)
  } else {
    const air = c.createBiquadFilter(); air.type = 'highshelf'; air.frequency.value = 7000; air.gain.value = p === 'edm' ? 4 : 2.5; chain(air)
  }
  tail.connect(master!)
  wet.gain.value = { trap: 0.12, boombap: 0.08, edm: 0.3, drill: 0.1, lofi: 0.18 }[p]
  wet.connect(reverb!)
  b = { dry: input, wet }
  buses.set(p, b)
  return b
}

/* ---------- voices ---------- */
function env(g: GainNode, t: number, peak: number, decay: number, attack = 0.002) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.02, decay))
}

function osc(out: AudioNode, t: number, type: OscillatorType, f0: number, f1: number, sweep: number, peak: number, decay: number) {
  const c = getAudioContext()
  const o = c.createOscillator(); o.type = type
  o.frequency.setValueAtTime(f0, t)
  if (f1 > 0 && sweep > 0) o.frequency.exponentialRampToValueAtTime(f1, t + sweep)
  const g = c.createGain(); env(g, t, peak, decay)
  o.connect(g).connect(out)
  o.start(t); o.stop(t + decay + 0.05)
}

function noise(out: AudioNode, t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 0.7) {
  const c = getAudioContext()
  const s = c.createBufferSource(); s.buffer = noiseBuf!
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
  const g = c.createGain(); env(g, t, peak, dur, 0.001)
  s.connect(f).connect(g).connect(out)
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05)
}

// TR-808 style metallic hat: six detuned squares, band-passed
const HAT_F = [205.3, 304.4, 369.6, 522.7, 540, 800]
function metal(out: AudioNode, t: number, dur: number, peak: number, bright = 1) {
  const c = getAudioContext()
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 10000 * bright; bp.Q.value = 0.9
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000 * bright
  const g = c.createGain(); env(g, t, peak, dur, 0.001)
  bp.connect(hp).connect(g).connect(out)
  for (const f of HAT_F) {
    const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f * 1.7
    o.connect(bp); o.start(t); o.stop(t + dur + 0.05)
  }
}

// driven sine for 808s: sub that still reads on phone speakers
function sub808(out: AudioNode, t: number, from: number, to: number, glide: number, decay: number, drive: number, peak = 0.9) {
  const c = getAudioContext()
  const o = c.createOscillator(); o.type = 'sine'
  o.frequency.setValueAtTime(from, t)
  o.frequency.exponentialRampToValueAtTime(to, t + glide)
  const ws = c.createWaveShaper(); ws.curve = curve(drive); ws.oversample = '4x'
  const g = c.createGain(); env(g, t, peak, decay, 0.004)
  o.connect(ws).connect(g).connect(out)
  o.start(t); o.stop(t + decay + 0.05)
}

/* ---------- kits ---------- */
type Kit = {
  kick: (o: AudioNode, t: number) => void
  snare: (o: AudioNode, w: AudioNode, t: number) => void
  hat: (o: AudioNode, t: number, open: boolean) => void
  clap: (o: AudioNode, w: AudioNode, t: number) => void
  bass: (o: AudioNode, t: number, f: number) => void
}

const KITS: Record<PresetId, Kit> = {
  // hard 808 kick, crisp snare+clap, tight metallic hats, long distorted 808
  trap: {
    kick: (o, t) => { sub808(o, t, 190, 46, 0.045, 0.55, 1.8, 1); noise(o, t, 0.012, 'highpass', 4000, 0.5) },
    snare: (o, w, t) => { osc(o, t, 'triangle', 240, 185, 0.05, 0.55, 0.09); noise(o, t, 0.17, 'highpass', 2200, 0.8); noise(w, t, 0.2, 'highpass', 2500, 0.5) },
    hat: (o, t, open) => metal(o, t, open ? 0.38 : 0.045, open ? 0.32 : 0.38),
    clap: (o, w, t) => { for (const d of [0, 0.011, 0.023]) noise(o, t + d, 0.02, 'bandpass', 1500, 0.7, 1.2); noise(o, t + 0.035, 0.2, 'bandpass', 1400, 0.6, 1); noise(w, t, 0.25, 'bandpass', 1500, 0.6) },
    bass: (o, t, f) => sub808(o, t, f * 1.06, f, 0.06, 1.9, 2.6),
  },
  // fat round kick with thump, dusty cracking snare, noisy loose hats
  boombap: {
    kick: (o, t) => { osc(o, t, 'sine', 120, 52, 0.07, 1.2, 0.34); noise(o, t, 0.06, 'lowpass', 320, 0.9); noise(o, t, 0.008, 'bandpass', 2500, 0.35) },
    snare: (o, w, t) => { osc(o, t, 'triangle', 195, 160, 0.06, 0.7, 0.14); noise(o, t, 0.26, 'bandpass', 1700, 0.9, 0.6); noise(w, t, 0.18, 'bandpass', 1800, 0.35) },
    hat: (o, t, open) => noise(o, t, open ? 0.32 : 0.07, 'highpass', 6200, open ? 0.35 : 0.42, 0.9),
    clap: (o, w, t) => { for (const d of [0, 0.013, 0.027]) noise(o, t + d, 0.022, 'bandpass', 1200, 0.6, 1); noise(o, t + 0.04, 0.24, 'bandpass', 1100, 0.55); noise(w, t, 0.2, 'bandpass', 1200, 0.3) },
    bass: (o, t, f) => { osc(o, t, 'triangle', f * 2, f * 2, 0, 0.7, 0.6); osc(o, t, 'sine', f, f, 0, 0.9, 0.7) },
  },
  // clicky four-on-the-floor kick, big roomy snare and clap, bright hats
  edm: {
    kick: (o, t) => { sub808(o, t, 160, 48, 0.035, 0.36, 1.4, 1.1); noise(o, t, 0.015, 'highpass', 3000, 0.7) },
    snare: (o, w, t) => { osc(o, t, 'triangle', 210, 180, 0.04, 0.5, 0.1); noise(o, t, 0.24, 'highpass', 1500, 0.8); noise(w, t, 0.3, 'highpass', 1500, 0.9) },
    hat: (o, t, open) => metal(o, t, open ? 0.3 : 0.05, open ? 0.3 : 0.36, 1.1),
    clap: (o, w, t) => { for (const d of [0, 0.01, 0.02, 0.03]) noise(o, t + d, 0.02, 'bandpass', 1600, 0.7, 1.1); noise(w, t, 0.4, 'bandpass', 1600, 1) },
    bass: (o, t, f) => { osc(o, t, 'sawtooth', f * 2, f * 2, 0, 0.4, 0.5); sub808(o, t, f, f, 0.01, 0.6, 1.2, 0.7) },
  },
  // knocky kick, sharp high snare, very tight hats, sliding 808s
  drill: {
    kick: (o, t) => { sub808(o, t, 175, 44, 0.05, 0.42, 2, 1); noise(o, t, 0.01, 'highpass', 5000, 0.6) },
    snare: (o, w, t) => { osc(o, t, 'triangle', 300, 230, 0.03, 0.6, 0.07); noise(o, t, 0.12, 'highpass', 3200, 0.85); noise(w, t, 0.15, 'highpass', 3200, 0.45) },
    hat: (o, t, open) => metal(o, t, open ? 0.26 : 0.03, open ? 0.3 : 0.4, 1.15),
    clap: (o, w, t) => { noise(o, t, 0.012, 'highpass', 4000, 0.6); osc(o, t, 'square', 1800, 0, 0, 0.15, 0.03); noise(w, t, 0.15, 'bandpass', 2500, 0.4) },
    bass: (o, t, f) => sub808(o, t, f * 2, f, 0.16, 2.2, 3), // the drill slide
  },
  // soft muffled kick, brushy snare, quiet dusty hats
  lofi: {
    kick: (o, t) => { osc(o, t, 'sine', 95, 48, 0.08, 0.95, 0.3); noise(o, t, 0.05, 'lowpass', 250, 0.6) },
    snare: (o, w, t) => { noise(o, t, 0.22, 'bandpass', 1300, 0.6, 0.5); osc(o, t, 'sine', 180, 170, 0.05, 0.3, 0.1); noise(w, t, 0.25, 'bandpass', 1200, 0.4) },
    hat: (o, t, open) => noise(o, t, open ? 0.28 : 0.05, 'highpass', 5200, open ? 0.22 : 0.28, 0.8),
    clap: (o, w, t) => { noise(o, t, 0.02, 'bandpass', 1800, 0.45, 2); noise(w, t, 0.2, 'bandpass', 1800, 0.3) }, // finger snap
    bass: (o, t, f) => sub808(o, t, f, f, 0.01, 0.9, 1.1, 0.75),
  },
}

/* ---------- public API used by the pad presets ---------- */
function at(p: PresetId) {
  unlockMobileAudio()
  const b = bus(p)
  return { o: b.dry, w: b.wet, t: getAudioContext().currentTime + 0.003 }
}

export const drumAudio = {
  kick(p: PresetId) { const { o, t } = at(p); KITS[p].kick(o, t) },
  snare(p: PresetId) { const { o, w, t } = at(p); KITS[p].snare(o, w, t) },
  hihat(p: PresetId) { const { o, t } = at(p); KITS[p].hat(o, t, false) },
  openHat(p: PresetId) { const { o, t } = at(p); KITS[p].hat(o, t, true) },
  clap(p: PresetId) { const { o, w, t } = at(p); KITS[p].clap(o, w, t) },
  bass808(p: PresetId, f = 45) { const { o, t } = at(p); KITS[p].bass(o, t, f) },

  perc(p: PresetId, v: 'cowbell' | 'rim' | 'wood' | 'tom') {
    const { o, t } = at(p)
    if (v === 'cowbell') { osc(o, t, 'square', 562, 0, 0, 0.22, 0.32); osc(o, t, 'square', 845, 0, 0, 0.18, 0.3) }
    else if (v === 'rim') { osc(o, t, 'triangle', 1700, 1100, 0.01, 0.5, 0.04); noise(o, t, 0.02, 'bandpass', 3000, 0.4, 3) }
    else if (v === 'tom') osc(o, t, 'sine', 180, 95, 0.12, 0.9, 0.35)
    else { osc(o, t, 'sine', 900, 700, 0.02, 0.6, 0.07); noise(o, t, 0.015, 'bandpass', 2200, 0.3, 4) }
  },

  // short vocal-ish chops: formant-filtered saw bursts
  vox(p: PresetId, v: 'hey' | 'yeah' | 'drop' | 'uh') {
    const { o, w, t } = at(p)
    const c = getAudioContext()
    const [f0, f1, form, dur] = { hey: [330, 250, 1100, 0.22], yeah: [260, 200, 800, 0.3], drop: [220, 90, 700, 0.4], uh: [150, 120, 600, 0.18] }[v] as number[]
    const s = c.createOscillator(); s.type = 'sawtooth'
    s.frequency.setValueAtTime(f0, t); s.frequency.exponentialRampToValueAtTime(f1, t + dur)
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = form; f.Q.value = 4
    const g = c.createGain(); env(g, t, 0.9, dur, 0.01)
    s.connect(f).connect(g); g.connect(o); g.connect(w)
    s.start(t); s.stop(t + dur + 0.05)
  },

  // melodic one-shots
  keys(p: PresetId, f: number, v: 'pluck' | 'bell' | 'rhodes' | 'brass' | 'flute' | 'stab') {
    const { o, w, t } = at(p)
    if (v === 'pluck') { osc(o, t, 'triangle', f, 0, 0, 0.55, 0.45); osc(w, t, 'sine', f * 2, 0, 0, 0.25, 0.4) }
    else if (v === 'bell') { osc(o, t, 'sine', f, 0, 0, 0.5, 1.2); osc(o, t, 'sine', f * 2.76, 0, 0, 0.2, 0.6); osc(w, t, 'sine', f, 0, 0, 0.3, 1) }
    else if (v === 'rhodes') { osc(o, t, 'sine', f, 0, 0, 0.6, 1.1); osc(o, t, 'triangle', f * 2, 0, 0, 0.18, 0.5); osc(o, t, 'sine', f * 3, 0, 0, 0.06, 0.25) }
    else if (v === 'brass') { osc(o, t, 'sawtooth', f, f * 0.99, 0.08, 0.35, 0.6); osc(o, t, 'sawtooth', f * 1.005, 0, 0, 0.3, 0.6) }
    else if (v === 'flute') { osc(o, t, 'sine', f, 0, 0, 0.55, 0.7); noise(o, t, 0.15, 'bandpass', f * 2, 0.08, 6); osc(w, t, 'sine', f, 0, 0, 0.3, 0.8) }
    else { for (const r of [1, 1.26, 1.5]) osc(o, t, 'sawtooth', f * r, 0, 0, 0.22, 0.28); osc(w, t, 'sawtooth', f, 0, 0, 0.2, 0.3) }
  },

  fx(p: PresetId, v: 'laser' | 'scratch' | 'riser' | 'stop' | 'vinyl' | 'gun') {
    const { o, w, t } = at(p)
    if (v === 'laser') osc(o, t, 'sawtooth', 2400, 90, 0.18, 0.4, 0.22)
    else if (v === 'scratch') { osc(o, t, 'sawtooth', 300, 1400, 0.06, 0.35, 0.09); osc(o, t + 0.08, 'sawtooth', 1400, 250, 0.08, 0.35, 0.1); noise(o, t, 0.18, 'bandpass', 1500, 0.3, 2) }
    else if (v === 'riser') { osc(o, t, 'sawtooth', 110, 1800, 0.9, 0.3, 1); noise(w, t, 1, 'highpass', 3000, 0.4) }
    else if (v === 'stop') osc(o, t, 'sawtooth', 220, 30, 0.5, 0.45, 0.55)
    else if (v === 'vinyl') { for (let i = 0; i < 6; i++) noise(o, t + Math.random() * 0.4, 0.004, 'highpass', 3000, 0.5) ; noise(o, t, 0.5, 'bandpass', 900, 0.08, 0.4) }
    else { noise(o, t, 0.25, 'lowpass', 1800, 1); osc(o, t, 'sine', 160, 40, 0.15, 0.8, 0.25); noise(w, t, 0.4, 'lowpass', 2000, 0.6) }
  },
}
