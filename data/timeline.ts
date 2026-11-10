// The playlist: bars are years. Clips sit on the year they started.

export const FIRST_YEAR = 2017
export const BARS = 10 // 2017 … 2026
export const BPM = 140 // shortcut: fixed tempo for the transport readout, swap for the newest beat's BPM when beats carry dates

export type Clip = { id: string; label: string; key?: string; start: number; len: number; slug?: string; href?: string }

// JOBS track: employment from the CV (real dates)
export const jobClips: Clip[] = [
  { id: 'rukita', label: 'Rukita.id', start: 2020, len: 0.75 },
  { id: 'inhouse', label: 'In-house systems', key: 'timeline.inhouse', start: 2022, len: 4.95, href: '/cv' },
]

// APPS track: shipped apps, years from data/project-detail.ts
export const appClips: Clip[] = [
  { id: 'apps2024', label: '8 apps', key: 'timeline.apps2024', start: 2024, len: 0.95, href: '#code' },
  { id: 'laporku', label: 'Laporku', start: 2025, len: 0.95, slug: 'laporku' },
  { id: 'kasir', label: 'Kasir OK', start: 2026, len: 0.95, slug: 'kasir-ok' },
]

// BEATS track: YouTube upload dates from data/beats.ts (year + month/12)
export const beatClips: Clip[] = [
  { id: 'hanoman', label: 'Hanoman', start: 2021.6, len: 0.4, href: '#beats' }, // uploaded Dec 2021; widened so it can be read
  { id: 'flp', label: '12 beats · Free FLP', key: 'timeline.flpBeats', start: 2022.17, len: 1.41, href: '#beats' }, // Mar 2022 to Jul 2023
  { id: 'southgun', label: 'South Gun', key: 'timeline.southGun', start: 2023.78, len: 2.42, href: '#beats' }, // ZAT Selatan Oct 2023 to Better Move Mar 2026
]

// Markers above the ruler: real dated facts from the CV
export const markers = [
  { year: 2017, key: 'timeline.m2017' },
  { year: 2020, key: 'timeline.m2020' },
  { year: 2021, key: 'timeline.m2021' },
  { year: 2022, key: 'timeline.m2022' },
]

export const pct = (year: number) => ((year - FIRST_YEAR) / BARS) * 100
export const clipAt = (clips: Clip[], year: number) => clips.find(c => year >= c.start && year < c.start + c.len)
// the clip the playhead is on, or the last one it already passed
export const clipNear = (clips: Clip[], year: number) => clipAt(clips, year) ?? [...clips].reverse().find(c => c.start <= year)

