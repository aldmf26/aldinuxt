import { drumAudio, type PresetId } from './producerAudio'

export interface PadItem {
  id: number
  label: string
  sublabel: string
  color: 'green' | 'purple' | 'cyan' | 'orange'
  key: string
  numpad: string
  isHat?: boolean
  isKick?: boolean
  isSnare?: boolean
  action: (preset: PresetId) => void
}

export interface PresetData {
  id: PresetId
  name: string
  bpm: number
  genre: string
  description: string
  bankA: PadItem[]
  bankB: PadItem[]
}

export const PRESETS: PresetData[] = [
  {
    id: 'trap',
    name: 'Trap 808 Hard',
    bpm: 140,
    genre: 'Trap / Hip-Hop',
    description: 'Heavy sliding 808s, sizzling roll hats & punchy kicks',
    bankA: [
      // Row 1 (Green, Green, Purple)
      { id: 0, label: '808 BASS', sublabel: 'Low C', color: 'green', key: '1', numpad: '7', action: (p) => drumAudio.bass808(p, 42) },
      { id: 1, label: '808 GLIDE', sublabel: 'Mid D#', color: 'green', key: '2', numpad: '8', action: (p) => drumAudio.bass808(p, 58) },
      { id: 2, label: 'CHANT', sublabel: 'Hey!', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('hey') },

      // Row 2 (Cyan, Cyan, Cyan)
      { id: 3, label: 'CLAP', sublabel: 'Layer', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'COWBELL', sublabel: 'Phonk', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'cowbell') },
      { id: 5, label: 'OPEN HAT', sublabel: 'Splash', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      // Row 3 (Purple, Orange, Orange)
      { id: 6, label: 'LASER FX', sublabel: 'Zap', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('laser') },
      { id: 7, label: 'PLUCK', sublabel: 'Minor 1', color: 'orange', key: 'S', numpad: '2', action: () => drumAudio.melody(330, 'pluck') },
      { id: 8, label: 'BRASS', sublabel: 'Trap Hit', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(220, 'brass') },

      // Row 4 (BOTTOM ROW: KICK · HI-HATS · SNARE)
      { id: 9, label: 'KICK', sublabel: 'Trap 808', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Roll Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Sharp Crack', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ],
    bankB: [
      { id: 0, label: 'SUB DROP', sublabel: 'Sub Sub', color: 'green', key: '1', numpad: '7', action: (p) => drumAudio.bass808(p, 36) },
      { id: 1, label: '808 HIGH', sublabel: 'High F', color: 'green', key: '2', numpad: '8', action: (p) => drumAudio.bass808(p, 70) },
      { id: 2, label: 'VOX DROP', sublabel: 'Drop!', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('drop') },

      { id: 3, label: 'WOOD PERC', sublabel: 'Stick', color: 'cyan', key: 'Q', numpad: '4', action: (p) => drumAudio.perc(p, 'wood') },
      { id: 4, label: 'CRASH', sublabel: 'Cymbal', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.openHat(p) },
      { id: 5, label: 'RISER', sublabel: 'Sweep', color: 'cyan', key: 'E', numpad: '6', action: () => drumAudio.fx('riser') },

      { id: 6, label: 'VOX YEAH', sublabel: 'Yeah!', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.vox('yeah') },
      { id: 7, label: 'PLUCK 2', sublabel: 'High 5th', color: 'orange', key: 'S', numpad: '2', action: () => drumAudio.melody(440, 'pluck') },
      { id: 8, label: 'BRASS 2', sublabel: 'Sub Hit', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(165, 'brass') },

      // Bottom Row always Kick, Hats, Snare
      { id: 9, label: 'KICK', sublabel: 'Punch Kick', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Fast Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Clap-Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ]
  },
  {
    id: 'boombap',
    name: 'Boom Bap 90s',
    bpm: 92,
    genre: 'Classic Hip-Hop',
    description: 'Golden era warmth, vinyl dust, rhodes stabs and neck-snapping drums',
    bankA: [
      { id: 0, label: 'RHODES 1', sublabel: 'Minor 7', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(261.63, 'rhodes') },
      { id: 1, label: 'RHODES 2', sublabel: 'Dom 9', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(329.63, 'rhodes') },
      { id: 2, label: 'SCRATCH', sublabel: 'Baby Cut', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.fx('scratch') },

      { id: 3, label: 'SHAKER', sublabel: '16th Groove', color: 'cyan', key: 'Q', numpad: '4', action: (p) => drumAudio.hihat(p) },
      { id: 4, label: 'RIMSHOT', sublabel: 'Wooden Rim', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'rim') },
      { id: 5, label: 'OPEN HAT', sublabel: 'Vinyl Open', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'TAPE STOP', sublabel: 'Rewind', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('stop') },
      { id: 7, label: 'BASSLINE', sublabel: 'Upright 1', color: 'orange', key: 'S', numpad: '2', action: (p) => drumAudio.bass808(p, 55) },
      { id: 8, label: 'BASSLINE 2', sublabel: 'Upright 2', color: 'orange', key: 'D', numpad: '3', action: (p) => drumAudio.bass808(p, 73.4) },

      // Bottom Row always Kick, Hats, Snare
      { id: 9, label: 'KICK', sublabel: 'Fat Vinyl', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Dusty Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: '90s Boom', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ],
    bankB: [
      { id: 0, label: 'RHODES 3', sublabel: 'Root C', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(220, 'rhodes') },
      { id: 1, label: 'RHODES 4', sublabel: 'High Bell', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(392, 'rhodes') },
      { id: 2, label: 'SCRATCH 2', sublabel: 'Double Cut', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.fx('scratch') },

      { id: 3, label: 'CLAP BOOM', sublabel: 'Layer', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'COWBELL', sublabel: 'Vintage', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'cowbell') },
      { id: 5, label: 'RIDE', sublabel: 'Cymbal', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'VOX CUT', sublabel: 'Yeah', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.vox('yeah') },
      { id: 7, label: 'HORN STAB', sublabel: 'Jazz Horn', color: 'orange', key: 'S', numpad: '2', action: () => drumAudio.melody(277.18, 'brass') },
      { id: 8, label: 'HORN 2', sublabel: 'High Oct', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(370, 'brass') },

      { id: 9, label: 'KICK', sublabel: 'Thump Kick', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Hat Roll', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Rim Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ]
  },
  {
    id: 'edm',
    name: 'EDM Club Electro',
    bpm: 128,
    genre: 'Electronic / Dance',
    description: 'Four-on-the-floor energy, huge claps, risers and synth drops',
    bankA: [
      { id: 0, label: 'SYNTH LEAD', sublabel: 'Stab A', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(440, 'brass') },
      { id: 1, label: 'SYNTH LEAD 2', sublabel: 'Stab B', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(554.37, 'brass') },
      { id: 2, label: 'VOX DROP', sublabel: 'Drop!', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('drop') },

      { id: 3, label: 'CLUB CLAP', sublabel: 'Big Room', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'TOM DRUM', sublabel: 'Mid Tom', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'wood') },
      { id: 5, label: 'OPEN HAT', sublabel: 'Bright', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'RISER FX', sublabel: '8 Bar', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('riser') },
      { id: 7, label: 'SUB DROP', sublabel: 'Impact', color: 'orange', key: 'S', numpad: '2', action: (p) => drumAudio.bass808(p, 48) },
      { id: 8, label: 'LASER ZAP', sublabel: 'Club FX', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.fx('laser') },

      // Bottom Row always Kick, Hats, Snare
      { id: 9, label: 'KICK', sublabel: 'Club Punch', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Sizzle Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'White Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ],
    bankB: [
      { id: 0, label: 'PLUCK DROP', sublabel: 'Note 1', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(330, 'pluck') },
      { id: 1, label: 'PLUCK DROP 2', sublabel: 'Note 2', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(493.88, 'pluck') },
      { id: 2, label: 'CHANT', sublabel: 'Hey!', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('hey') },

      { id: 3, label: 'CLAP ROLL', sublabel: 'Build', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'WOOD PERC', sublabel: 'Click', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'rim') },
      { id: 5, label: 'CRASH FX', sublabel: 'Impact', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'TAPE STOP', sublabel: 'Break', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('stop') },
      { id: 7, label: 'SUB BASS', sublabel: 'Saw Sub', color: 'orange', key: 'S', numpad: '2', action: (p) => drumAudio.bass808(p, 55) },
      { id: 8, label: 'SYNTH HIT', sublabel: 'Drop Stab', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(220, 'brass') },

      { id: 9, label: 'KICK', sublabel: 'Electro Kick', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Fast Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Big Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ]
  },
  {
    id: 'drill',
    name: 'UK Drill London',
    bpm: 142,
    genre: 'Drill / Grime',
    description: 'Sliding 808 glides, bouncy syncopated hats, gunshot & dark flute chops',
    bankA: [
      { id: 0, label: 'SLIDE 808', sublabel: 'Low Slide', color: 'green', key: '1', numpad: '7', action: (p) => drumAudio.bass808(p, 40) },
      { id: 1, label: 'SLIDE 808 2', sublabel: 'High Slide', color: 'green', key: '2', numpad: '8', action: (p) => drumAudio.bass808(p, 62) },
      { id: 2, label: 'DRILL VOX', sublabel: 'Grunt', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('drill') },

      { id: 3, label: 'COUNTER', sublabel: 'Snare Roll', color: 'cyan', key: 'Q', numpad: '4', action: (p) => drumAudio.snare(p) },
      { id: 4, label: 'WOOD PERC', sublabel: 'Block', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'wood') },
      { id: 5, label: 'REVERSE', sublabel: 'Cymbal', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'GUNSHOT FX', sublabel: 'Crack', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('laser') },
      { id: 7, label: 'FLUTE CHOP', sublabel: 'Dark Minor', color: 'orange', key: 'S', numpad: '2', action: () => drumAudio.melody(523.25, 'flute') },
      { id: 8, label: 'BELL STOMP', sublabel: 'Dark Bell', color: 'orange', key: 'D', numpad: '3', action: (p) => drumAudio.perc(p, 'cowbell') },

      // Bottom Row always Kick, Hats, Snare
      { id: 9, label: 'KICK', sublabel: 'Knock Kick', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Skippy Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Center Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ],
    bankB: [
      { id: 0, label: 'SUB 808 DEEP', sublabel: 'Pure Sub', color: 'green', key: '1', numpad: '7', action: (p) => drumAudio.bass808(p, 34) },
      { id: 1, label: '808 POP', sublabel: 'Distorted', color: 'green', key: '2', numpad: '8', action: (p) => drumAudio.bass808(p, 50) },
      { id: 2, label: 'CHANT', sublabel: 'Hey!', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('hey') },

      { id: 3, label: 'RIM CLAP', sublabel: 'Snap', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'DRILL COWBELL', sublabel: 'Bell', color: 'cyan', key: 'W', numpad: '5', action: (p) => drumAudio.perc(p, 'cowbell') },
      { id: 5, label: 'OPEN HAT 2', sublabel: 'Crash', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'LASER DRILL', sublabel: 'Laser', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('laser') },
      { id: 7, label: 'FLUTE 2', sublabel: 'High Whistle', color: 'orange', key: 'S', numpad: '2', action: () => drumAudio.melody(659.25, 'flute') },
      { id: 8, label: 'STAB BASS', sublabel: 'Reese Bass', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(110, 'brass') },

      { id: 9, label: 'KICK', sublabel: 'Drill Thud', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Hat Roll', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Ghost Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ]
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Chillhop',
    bpm: 85,
    genre: 'Lo-Fi / Study',
    description: 'Mellow warmth, rain textures, gentle rhodes chords and dusty tape rhythms',
    bankA: [
      { id: 0, label: 'LOFI EP 1', sublabel: 'Maj 7', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(261.63, 'rhodes') },
      { id: 1, label: 'LOFI EP 2', sublabel: 'Min 9', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(311.13, 'rhodes') },
      { id: 2, label: 'RAIN VINYL', sublabel: 'Noise', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.fx('stop') },

      { id: 3, label: 'SNAPPY RIM', sublabel: 'Wood Rim', color: 'cyan', key: 'Q', numpad: '4', action: (p) => drumAudio.perc(p, 'rim') },
      { id: 4, label: 'KALIMBA', sublabel: 'Bell Pluck', color: 'cyan', key: 'W', numpad: '5', action: () => drumAudio.melody(523.25, 'pluck') },
      { id: 5, label: 'SOFT OPEN', sublabel: 'Damped', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.openHat(p) },

      { id: 6, label: 'TAPE SCRATCH', sublabel: 'Vinyl', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('scratch') },
      { id: 7, label: 'SUB WARM', sublabel: 'Gentle 808', color: 'orange', key: 'S', numpad: '2', action: (p) => drumAudio.bass808(p, 50) },
      { id: 8, label: 'GUITAR LICK', sublabel: 'Chime', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(392, 'pluck') },

      // Bottom Row always Kick, Hats, Snare
      { id: 9, label: 'KICK', sublabel: 'Muffled Kick', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Soft Hat', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Warm Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ],
    bankB: [
      { id: 0, label: 'LOFI EP 3', sublabel: 'Dim 7', color: 'green', key: '1', numpad: '7', action: () => drumAudio.melody(220, 'rhodes') },
      { id: 1, label: 'LOFI EP 4', sublabel: 'Sus 4', color: 'green', key: '2', numpad: '8', action: () => drumAudio.melody(349.23, 'rhodes') },
      { id: 2, label: 'VOX CHOP', sublabel: 'Whisper', color: 'purple', key: '3', numpad: '9', action: () => drumAudio.vox('yeah') },

      { id: 3, label: 'FINGER SNAP', sublabel: 'Acoustic', color: 'cyan', key: 'Q', numpad: '4', action: () => drumAudio.clap() },
      { id: 4, label: 'BELL 2', sublabel: 'High Note', color: 'cyan', key: 'W', numpad: '5', action: () => drumAudio.melody(659.25, 'pluck') },
      { id: 5, label: 'SHAKER', sublabel: 'Sand', color: 'cyan', key: 'E', numpad: '6', action: (p) => drumAudio.hihat(p) },

      { id: 6, label: 'VINYL POP', sublabel: 'Dust', color: 'purple', key: 'A', numpad: '1', action: () => drumAudio.fx('stop') },
      { id: 7, label: 'WARM BASS 2', sublabel: 'Root F', color: 'orange', key: 'S', numpad: '2', action: (p) => drumAudio.bass808(p, 43.65) },
      { id: 8, label: 'SAX CHOP', sublabel: 'Mellow', color: 'orange', key: 'D', numpad: '3', action: () => drumAudio.melody(293.66, 'brass') },

      { id: 9, label: 'KICK', sublabel: 'Lo-Fi Thud', color: 'cyan', key: 'Z', numpad: '0', isKick: true, action: (p) => drumAudio.kick(p) },
      { id: 10, label: 'HI-HATS', sublabel: 'Hat Roll', color: 'cyan', key: 'X', numpad: '.', isHat: true, action: (p) => drumAudio.hihat(p) },
      { id: 11, label: 'SNARE', sublabel: 'Brush Snare', color: 'cyan', key: 'C', numpad: 'Enter', isSnare: true, action: (p) => drumAudio.snare(p) },
    ]
  }
]

