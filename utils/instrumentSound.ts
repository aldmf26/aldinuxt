// Audio engine for mechanical keyboard sound effects (Developer tab)
let ac: AudioContext | undefined
let master: DynamicsCompressorNode | undefined
let masterGain: GainNode | undefined
let noiseBuf: AudioBuffer | undefined

export function getDevAudio(): AudioContext {
  if (!ac && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    ac = new AudioCtx()
    master = ac.createDynamicsCompressor()
    master.threshold.setValueAtTime(-15, ac.currentTime)
    master.knee.setValueAtTime(24, ac.currentTime)
    master.ratio.setValueAtTime(8, ac.currentTime)

    masterGain = ac.createGain()
    masterGain.gain.setValueAtTime(1.0, ac.currentTime)

    master.connect(masterGain)
    masterGain.connect(ac.destination)

    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }

  if (ac && ac.state === 'suspended') {
    ac.resume().catch(() => {})
  }

  return ac!
}

if (typeof window !== 'undefined') {
  const unlock = () => {
    if (ac && ac.state === 'suspended') ac.resume()
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('keydown', unlock, { passive: true })
}

const safeEnv = (g: GainNode, t: number, peak: number, dec: number) => {
  g.gain.cancelScheduledValues(t)
  g.gain.setValueAtTime(0.001, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.02, dec))
}

function noise(t: number, dur: number, type: BiquadFilterType, freq: number, peak: number, q = 1) {
  const c = getDevAudio()
  if (!c || !noiseBuf) return
  const s = c.createBufferSource(); s.buffer = noiseBuf
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
  const g = c.createGain(); safeEnv(g, t, peak, dur)
  s.connect(f).connect(g).connect(master!)
  s.start(t, Math.random() * 0.4); s.stop(t + dur + 0.06)
}

function tone(t: number, type: OscillatorType, f0: number, f1: number, glide: number, peak: number, dec: number) {
  const c = getDevAudio()
  if (!c) return
  const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t)
  if (f1 > 0 && glide > 0) o.frequency.exponentialRampToValueAtTime(f1, t + glide)
  const g = c.createGain(); safeEnv(g, t, peak, dec)
  o.connect(g).connect(master!)
  o.start(t); o.stop(t + dec + 0.06)
}

export const sfx = {
  // Mechanical switch: sharp blue click + solid bottom-out thock
  click() {
    const c = getDevAudio()
    if (!c) return
    const t = Math.max(c.currentTime, 0.001) + 0.002
    const v = 0.85 + Math.random() * 0.35

    // 1. Click leaf transient (Cherry MX click)
    noise(t, 0.022, 'bandpass', 3600 * v, 0.7, 1.4)
    // 2. Plastic housing bottom-out thock
    tone(t, 'triangle', 280 * v, 85, 0.03, 0.6, 0.065)
    tone(t, 'sine', 180 * v, 60, 0.04, 0.45, 0.08)
    // 3. Slider release clack
    noise(t + 0.038, 0.02, 'bandpass', 2400 * v, 0.35, 1.6)
  },
}
