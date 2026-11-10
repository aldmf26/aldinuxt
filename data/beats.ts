// Beats on YouTube, newest first. Titles, BPM and type from the owner's old list (commit fcce12c);
// dates are the YouTube upload dates. Beats added through /upload are shown on top of these.

export type Beat = { judul: string; yt: string; bpm?: number; type?: string; date: string }

// Songs Aldi produced for South Gun, a hip hop group from Banjarmasin
export const southGun: Beat[] = [
  { judul: 'Better Move', yt: 'mpOAYqiq5HI', type: 'South Gun · Single', date: '2026-03-15' },
  { judul: 'Serotonin', yt: 'AAHC0eTyHj8', type: 'South Gun · Vol. 3', date: '2024-11-15' },
  { judul: 'SMASH', yt: 'ACMkBeKlqJ8', bpm: 150, type: 'South Gun · Music video', date: '2024-01-13' },
  { judul: 'ZAT Selatan', yt: 'Qb5_jPIvbnk', bpm: 150, type: 'South Gun · Music video', date: '2023-10-12' },
]

export const beats: Beat[] = [
  { judul: 'Ginto', yt: 'e4k6F9XnN_4', bpm: 110, type: 'Trap · Free FLP', date: '2023-07-30' },
  { judul: 'Barkan', yt: 'tqWjv8MMQ5U', bpm: 170, type: 'Arabic trap · Free FLP', date: '2023-06-04' },
  { judul: 'Boom', yt: 'IC29VAokmN8', bpm: 90, type: 'Trap · Free FLP', date: '2023-05-21' },
  { judul: 'Habits', yt: 'mtSq-fF_ZDI', bpm: 170, type: 'Trap · Free FLP', date: '2023-05-14' },
  { judul: 'Chronela', yt: 'kRE6lMO8fvE', bpm: 198, type: 'Trap · Free FLP', date: '2023-04-16' },
  { judul: 'Beatbox v2', yt: 'VAf120fBT9o', bpm: 190, type: 'Trap · Free FLP', date: '2023-04-02' },
  { judul: 'Kurma', yt: 'kuWnALFzasE', bpm: 160, type: 'Trap · Free FLP', date: '2023-03-26' },
  { judul: 'Dendang', yt: 'IuPr2iU23h0', bpm: 90, type: 'Trap · Free FLP', date: '2023-01-01' },
  { judul: 'Bap Bap', yt: '8wFIg7C2slU', bpm: 101, type: 'Trap · Free FLP', date: '2022-11-05' },
  { judul: 'GTA', yt: 'QDRnVt_5vRc', bpm: 194, type: 'Trap · Free FLP', date: '2022-05-08' },
  { judul: 'Flamingo', yt: 'UaNnC24Pnrg', bpm: 100, type: 'Latin trap · Free FLP', date: '2022-04-16' },
  { judul: 'Snakey', yt: '51X_4JpYxJ4', bpm: 108, type: 'Trap · Free FLP', date: '2022-03-05' },
  { judul: 'Hanoman', yt: 'WivTmpt7w5c', bpm: 95, type: 'India type beat', date: '2021-12-16' },
]
