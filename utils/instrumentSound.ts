// Every sound is synthesized with Web Audio: no sample files to download.
let ac: AudioContext | undefined
let master: DynamicsCompressorNode
let noiseBuf: AudioBuffer

function audio() {
  if (ac) return ac
  ac = new AudioContext()
  master = ac.createDynamicsCompressor()
  master.connect(ac.destination)
  noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return ac
}

const env = (g: GainNode, t: number, peak: number, dec: number) => {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dec)
}

function noise(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 1) {
  const s = ac!.createBufferSource(); s.buffer = noiseBuf
  const f = ac!.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
  const g = ac!.createGain(); env(g, t, peak, dur)
  s.connect(f).connect(g).connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05)
}

function tone(t: number, type: OscillatorType, f0: number, f1: number, glide: number, peak: number, dec: number, dest: AudioNode = master) {
  const o = ac!.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t)
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + glide)
  const g = ac!.createGain(); env(g, t, peak, dec)
  o.connect(g).connect(dest); o.start(t); o.stop(t + dec + 0.05)
}

let drive: WaveShaperNode | undefined
const now = () => {
  const c = audio()
  if (c.state === 'suspended') c.resume()
  return c.currentTime
}

export const sfx = {
  unlock: () => { now() },
  click() { // mechanical switch: click, bottom-out thock, release clack
    const t = now(), v = 0.85 + Math.random() * 0.3
    noise(t, 0.025, 'bandpass', 3200 * v, 0.5, 1.2)
    tone(t, 'sine', 260 * v, 90, 0.035, 0.35, 0.06)
    noise(t + 0.045, 0.02, 'bandpass', 2200 * v, 0.15, 1.5)
  },
  piano(f: number) { // electric-piano voice: decaying harmonics through a closing low-pass
    const t = now()
    const lp = ac!.createBiquadFilter(); lp.type = 'lowpass'
    lp.frequency.setValueAtTime(Math.min(9000, f * 12), t)
    lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), t + 1.2)
    lp.connect(master)
    for (const [h, a, d] of [[1, 0.5, 1.8], [2, 0.22, 1.1], [3, 0.1, 0.7], [4, 0.06, 0.45], [5.02, 0.03, 0.3]])
      tone(t, 'sine', f * h, 0, 0, a, d, lp)
    tone(t, 'triangle', f * 1.003, 0, 0, 0.12, 1.4, lp)
    noise(t, 0.015, 'highpass', 2500, 0.05)
  },
  kick() { const t = now(); tone(t, 'sine', 160, 42, 0.11, 1, 0.38); noise(t, 0.01, 'highpass', 4000, 0.15) },
  '808'() {
    const t = now()
    if (!drive) {
      drive = ac!.createWaveShaper()
      const c = new Float32Array(256)
      for (let i = 0; i < 256; i++) c[i] = Math.tanh(2.4 * (i / 128 - 1))
      drive.curve = c; drive.connect(master)
    }
    tone(t, 'sine', 90, 49, 0.06, 0.9, 1.6, drive)
  },
  snare() { const t = now(); noise(t, 0.2, 'highpass', 1600, 0.55); tone(t, 'triangle', 200, 160, 0.05, 0.4, 0.11) },
  clap() { const t = now(); for (const o of [0, 0.011, 0.023]) noise(t + o, 0.012, 'bandpass', 1300, 0.5, 0.9); noise(t + 0.03, 0.18, 'bandpass', 1300, 0.45, 0.9) },
  hat() { const t = now(); noise(t, 0.045, 'highpass', 8000, 0.32) },
  open() { const t = now(); noise(t, 0.32, 'highpass', 7500, 0.28) },
  rim() { const t = now(); tone(t, 'square', 1700, 0, 0, 0.12, 0.03); noise(t, 0.02, 'bandpass', 2500, 0.2, 3) },
  perc() { const t = now(); tone(t, 'square', 540, 0, 0, 0.12, 0.25); tone(t, 'square', 800, 0, 0, 0.1, 0.25) },
}

export type PadName = '808' | 'kick' | 'snare' | 'clap' | 'hat' | 'open' | 'rim' | 'perc'
