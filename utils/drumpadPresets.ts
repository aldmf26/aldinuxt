import { drumAudio as A, type PresetId } from './producerAudio'

// 12 pads per pack, 3 × 4 like a phone pad app. Bottom row is always kick · hats · snare.
// `tone` picks one of the pack's four colours.
export type PadItem = { label: string; sub: string; tone: 0 | 1 | 2 | 3; key: string; hat?: boolean; play: (p: PresetId) => void }
export type PresetData = { id: PresetId; name: string; bpm: number; genre: string; colors: [string, string, string, string]; pads: PadItem[] }

const KEYS = ['1', '2', '3', 'q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c']
const pads = (list: Omit<PadItem, 'key'>[]): PadItem[] => list.map((p, i) => ({ ...p, key: KEYS[i] }))

const bottom = (kick: string, hat: string, snare: string) => [
  { label: 'KICK', sub: kick, tone: 0 as const, play: (p: PresetId) => A.kick(p) },
  { label: 'HATS', sub: hat, tone: 0 as const, hat: true, play: (p: PresetId) => A.hihat(p) },
  { label: 'SNARE', sub: snare, tone: 0 as const, play: (p: PresetId) => A.snare(p) },
]

export const PRESETS: PresetData[] = [
  {
    id: 'trap', name: 'Trap', bpm: 140, genre: 'Trap · Hip-hop',
    colors: ['#8b5cf6', '#22d3ee', '#f97316', '#e11d48'],
    pads: pads([
      { label: '808', sub: 'C1', tone: 3, play: p => A.bass808(p, 32.7) },
      { label: '808', sub: 'D#1', tone: 3, play: p => A.bass808(p, 38.9) },
      { label: '808', sub: 'G1', tone: 3, play: p => A.bass808(p, 49) },
      { label: 'CLAP', sub: 'Layer', tone: 1, play: p => A.clap(p) },
      { label: 'OPEN HAT', sub: 'Splash', tone: 1, play: p => A.openHat(p) },
      { label: 'HEY', sub: 'Vox', tone: 2, play: p => A.vox(p, 'hey') },
      { label: 'BELL', sub: 'Minor', tone: 2, play: p => A.keys(p, 622, 'bell') },
      { label: 'BELL', sub: 'Fifth', tone: 2, play: p => A.keys(p, 932, 'bell') },
      { label: 'RISER', sub: 'FX', tone: 1, play: p => A.fx(p, 'riser') },
      ...bottom('808 Kick', 'Roll', 'Crack'),
    ]),
  },
  {
    id: 'boombap', name: 'Boom Bap', bpm: 90, genre: 'Golden era',
    colors: ['#f59e0b', '#d97706', '#a3a3a3', '#b45309'],
    pads: pads([
      { label: 'RHODES', sub: 'Cm7', tone: 1, play: p => A.keys(p, 261.6, 'rhodes') },
      { label: 'RHODES', sub: 'Eb', tone: 1, play: p => A.keys(p, 311.1, 'rhodes') },
      { label: 'SCRATCH', sub: 'Baby', tone: 3, play: p => A.fx(p, 'scratch') },
      { label: 'BASS', sub: 'C', tone: 3, play: p => A.bass808(p, 65.4) },
      { label: 'BASS', sub: 'G', tone: 3, play: p => A.bass808(p, 49) },
      { label: 'RIM', sub: 'Stick', tone: 2, play: p => A.perc(p, 'rim') },
      { label: 'HORN', sub: 'Stab', tone: 1, play: p => A.keys(p, 233, 'brass') },
      { label: 'UH', sub: 'Vox', tone: 2, play: p => A.vox(p, 'uh') },
      { label: 'VINYL', sub: 'Crackle', tone: 2, play: p => A.fx(p, 'vinyl') },
      ...bottom('Fat', 'Dusty', 'Crack'),
    ]),
  },
  {
    id: 'drill', name: 'UK Drill', bpm: 142, genre: 'Drill',
    colors: ['#3b82f6', '#ef4444', '#94a3b8', '#1d4ed8'],
    pads: pads([
      { label: 'SLIDE', sub: 'C1', tone: 3, play: p => A.bass808(p, 32.7) },
      { label: 'SLIDE', sub: 'D1', tone: 3, play: p => A.bass808(p, 36.7) },
      { label: 'SLIDE', sub: 'F1', tone: 3, play: p => A.bass808(p, 43.7) },
      { label: 'RIM', sub: 'Snap', tone: 1, play: p => A.clap(p) },
      { label: 'PERC', sub: 'Wood', tone: 2, play: p => A.perc(p, 'wood') },
      { label: 'OPEN HAT', sub: 'Tight', tone: 2, play: p => A.openHat(p) },
      { label: 'FLUTE', sub: 'Dark', tone: 1, play: p => A.keys(p, 466, 'flute') },
      { label: 'FLUTE', sub: 'Low', tone: 1, play: p => A.keys(p, 349, 'flute') },
      { label: 'GUN', sub: 'FX', tone: 2, play: p => A.fx(p, 'gun') },
      ...bottom('Knock', 'Skippy', 'Sharp'),
    ]),
  },
  {
    id: 'edm', name: 'EDM', bpm: 128, genre: 'Club',
    colors: ['#06b6d4', '#ec4899', '#84cc16', '#6366f1'],
    pads: pads([
      { label: 'STAB', sub: 'Am', tone: 1, play: p => A.keys(p, 220, 'stab') },
      { label: 'STAB', sub: 'C', tone: 1, play: p => A.keys(p, 261.6, 'stab') },
      { label: 'DROP', sub: 'Vox', tone: 3, play: p => A.vox(p, 'drop') },
      { label: 'CLAP', sub: 'Big room', tone: 2, play: p => A.clap(p) },
      { label: 'TOM', sub: 'Fill', tone: 2, play: p => A.perc(p, 'tom') },
      { label: 'OPEN HAT', sub: 'Bright', tone: 2, play: p => A.openHat(p) },
      { label: 'PLUCK', sub: 'E', tone: 1, play: p => A.keys(p, 659, 'pluck') },
      { label: 'BASS', sub: 'A', tone: 3, play: p => A.bass808(p, 55) },
      { label: 'RISER', sub: '8 bars', tone: 3, play: p => A.fx(p, 'riser') },
      ...bottom('Punch', 'Sizzle', 'Room'),
    ]),
  },
  {
    id: 'lofi', name: 'Lo-Fi', bpm: 82, genre: 'Chill',
    colors: ['#a78bfa', '#f9a8d4', '#86efac', '#fcd34d'],
    pads: pads([
      { label: 'KEYS', sub: 'Fmaj7', tone: 0, play: p => A.keys(p, 349, 'rhodes') },
      { label: 'KEYS', sub: 'Am9', tone: 0, play: p => A.keys(p, 440, 'rhodes') },
      { label: 'VINYL', sub: 'Rain', tone: 3, play: p => A.fx(p, 'vinyl') },
      { label: 'SNAP', sub: 'Finger', tone: 1, play: p => A.clap(p) },
      { label: 'BELL', sub: 'Kalimba', tone: 2, play: p => A.keys(p, 523, 'pluck') },
      { label: 'SHAKER', sub: 'Soft', tone: 1, play: p => A.openHat(p) },
      { label: 'BASS', sub: 'F', tone: 3, play: p => A.bass808(p, 43.7) },
      { label: 'BELL', sub: 'High', tone: 2, play: p => A.keys(p, 784, 'bell') },
      { label: 'TAPE', sub: 'Stop', tone: 3, play: p => A.fx(p, 'stop') },
      ...bottom('Muffled', 'Dusty', 'Brush'),
    ]),
  },
]
