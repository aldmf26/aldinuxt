# DESIGN.md — Aldi Fahrizaldi portfolio redesign

Status: **BUILT (pass 1–3 QA done).** Open items in §6 and the SSR note below. Built with the `/awwwards` method
(`.claude/skills/awwwards`). Constraints from `PRODUCT.md` still apply.

## 0. Brief

- **Subject:** Aldi (Muhammad) Fahrizaldi, Banjarmasin. Web developer (Laravel, Nuxt/Vue,
  CodeIgniter, WordPress, MySQL, Supabase; plus Mikrotik/Starlink network work) and music
  producer in FL Studio: rap beats, trap, hybrid trap, remixes.
- **Audience (equal):** recruiters, UMKM clients (WhatsApp), beat buyers / rappers. Mostly phone.
- **Job of the site:** in 3 seconds a visitor knows "this person builds web apps AND makes beats",
  then gets a one-tap action: open a case study, play a beat, download the CV, message on WhatsApp.
- **Language:** ID default, EN via switcher (`@nuxtjs/i18n`). Every new string goes in both locales.
- **Stack:** stay on **Nuxt 3** (existing project, Vercel, i18n, server API). GSAP + Lenis already
  installed. No OGL/WebGL beyond the existing three.js keyboard (PRODUCT.md: light on phones).
- **Must keep:** MIDI piano, drum pads, 3D coding keyboard, 4-theme switcher, ID/EN.

## 1. Concept

Three candidates (territory → idea), scored Originality / Fit / Feasibility / Portability(lower=better):

| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| **A. Playlist (material)** | The site is a DAW playlist: one timeline, two tracks. CODE clips are the apps he shipped, BEATS clips are the beats he made, placed on the bars of his real years (2017 → now). | He works in FL Studio daily AND ships software; his career has real dated milestones. | Scroll drives the playhead across the bars; each clip it crosses "triggers" (lights, opens its card). | 4 / 5 / 4 / 2 |
| B. Piano roll = code (formal) | Notes in a piano roll morph into lines of code and back. | Same hands write melodies and code. | Hero grid where notes become characters. | 4 / 4 / 3 / 3 |
| C. Banjarmasin river market (place) | Projects float by like boats on the Martapura river. | Lives in Banjarmasin. | Horizontal drift of clips like boats. | 3 / 2 / 3 / 2 |

**Picked A** (owner choice too): strongest fit, both identities live on ONE timeline instead of two
CVs, and the dev/producer toggle becomes a real DAW control (Solo track). Steal from B for the
404 (an empty piano roll pattern).

> Not a copy of FL Studio: no FL logo, no FL colour skin, no fruit. We use generic DAW grammar
> (bars, tracks, clips, playhead, BPM, solo/mute) in our own visual language. Same rule fixes the
> drum pad footer, which currently says "DRUM PADS 24" (another company's app name) → rename to
> "ALDMF PADS".

### Concept Card
```
Idea:        My work on one timeline: apps on the CODE track, beats on the BEATS track.
Metaphor:    A DAW playlist / arrangement view.
Signature:   Pinned playlist; scroll scrubs the playhead across bars 2017→2026; clips trigger
             as it passes (motion.md "Pinned chapters" + one driver variable = playhead position).
Emotion:     First 3 s: "oh, a producer's session… and those clips are web apps."
Motion verb: "quantize" — things snap to the beat grid: short travel, hard ease-out, land on a bar.
Screenshot:  The playlist mid-scroll: playhead line on 2024, Kasir OK clip lit on CODE, a trap
             beat clip lit on BEATS directly below it.
```

### How the concept reaches every part
| Part | Expression |
|---|---|
| Nav | Transport bar (top): name · BPM (real: tempo of featured beat) · time readout = current year under playhead · ID/EN · theme |
| Dev/Producer toggle | **S** (solo) buttons on track headers: Solo CODE = dev view, Solo BEATS = producer view, none = both. Same `useSide` state underneath. |
| Hero intro | 4-beat count-in (1 · 2 · 3 · 4, ≤ 1.6 s, skipped under reduced motion), then the name drops onto the grid quantized |
| Work list | CODE clips → index list rows; hover/tap opens a clip preview (screenshot) |
| Case study | `/projects/[slug]` = "clip opened in editor": bar range (years), track, then context/idea/craft/outcome |
| Beats | BEATS clips with a waveform strip; tap = real YouTube/SoundCloud player (existing) |
| Instruments | "Channel rack" section: piano, drum pads, coding keyboard (all kept) |
| CV | `/cv` = "Export / Render": ATS page + PDF download (ID/EN by locale) |
| Footer | "End of song": giant name, WhatsApp + email + YouTube + GitHub, last bar marker |
| 404 | Empty pattern: a piano roll with no notes, "Pattern 404 is empty" + back to playlist |

## 2. Art direction system

### Palette (roles; mapped onto the 4 existing themes, not replacing the switcher)
| Role | Default (Oranye dark) | Use |
|---|---|---|
| `ground` | `#0f0c09` | page |
| `ink` | `#f5eedc` | text |
| `muted` | `#ab9a80` | secondary text (AA on ground) |
| `line` | `rgba(245,238,220,.12)` | bar grid, hairlines |
| `accent` | theme accent (`#ff5a1f` …) | playhead, focus, active clip — used rarely |
| `clip-code` / `clip-beat` | two tints derived per theme | clip bodies on each track |

Every theme in `themes.css` gets the two clip tints; all text colour flows from vars on `<html>`.

### Type
- **Archivo** (Google, variable width 62–125): display at width 112–125 / weight 800 (name, section
  heads), text at width 100 / 400–500. One family, two personalities.
- **Martian Mono** (Google) ONLY for real data: bar numbers, years, BPM, timecode. Not for every label.
- Scale: `--t-mega clamp(3.5rem, 1rem + 13vw, 14rem)` … body 16–18 px, leading 1.5. Display tracking
  −0.04em, leading 0.88. Tabular numbers everywhere a number lives.
- Drop the current Acorn/Rockabye mix (fonts stay in repo until build confirms nothing uses them).

### Grid & rhythm
- Desktop 12 col, gutter `clamp(16px, 2vw, 28px)`. Strong verticals: col 1 (track headers),
  col 3 (bar 1 of the timeline), col 12 (end). Everything hangs from these.
- Phone 390 px: 4 col; timeline turns **vertical** (bars run down, playhead is a horizontal line
  pinned mid-screen, the two tracks are two columns).
- Rhythm moods: tight (hero/transport), full viewport (playlist), airy (statement), normal (lists).

### Shape & motion
- Radius: clips 6 px, everything else 0 (grid stays crisp) — one rule: "only clips are rounded".
- Ease: `expo.out` family only. Durations: small 0.25 s, medium 0.5 s, big 0.9 s. Stagger 40 ms
  (one sixteenth at 150 BPM ≈ 0.1 s, rounded to the system).
- Hover (primary targets): clip "triggers": fills from left like a recorded region (clip-path
  inset), label slides 4 px. Utility links: colour only.
- Idle state: playhead keeps a slow loop over the current bar (± ¼ bar), paused off-screen and under
  reduced motion. One GSAP ticker, no own rAF loops (the three.js keyboard gets moved onto
  `gsap.ticker`).
- Sound: **opt-in** toggle in transport (off by default): a soft hat tick each bar the playhead crosses.

### Composition plan (each section a different layout family)
```
HERO (Poster + transport)                PLAYLIST (Pinned sequence, signature)
┌ ALDI F. ▸ 150 BPM  2026.1  ID|EN  ◐ ┐  ┌─────┬ 2017 ┬ 2020 ┬ 2022 ┬ 2024 ┬ 2026 ┐
│                                      │  │CODE S│      │Rukita│ Walet│KasirOK│ … │
│  ALDI                                │  │BEATS S│     │      │ trap │ remix │ … │
│  FAHRIZALDI    web dev · beatmaker   │  │KEYS  │      │      │      │ ▮▯▮  │   │
│  [▶ play the timeline]  [WhatsApp]   │  └──────┴──────┴──│playhead────────────┘
└──────────────────────────────────────┘

CODE (Index list + preview)              BEATS (Clip rows w/ waveform)
 2024  Kasir OK      POS PWA      ↗        ▶ ▁▃▆▃▂▅▇▅▂  Trap 01   140 BPM  YouTube
 2023  Agrika ERP    Laravel 8    ↗        ▶ ▂▅▃▆▂▃▇▃▁  Remix …   92 BPM
 …                     [preview img]

CHANNEL RACK (Asymmetric pair)           STATEMENT + FACTS
 [3D keyboard | Piano | Pads] tabs        "I build the cashier app for the restaurant,
 big instrument 8 col, notes 4 col         then make the beat playing in it."
                                          2017–21 S.Kom SI (IPK 3.60) · 2020 Rukita · 2022– now
                                          [Download CV]  [Open /cv]

FOOTER (Finale)                          /cv (ATS, single column, print = PDF)
 END OF SONG ── bar 2026                  Name / contact / summary / experience /
 ALDI FAHRIZALDI (mega)                   education / projects / skills
 WhatsApp · Email · YouTube · GitHub      [Download PDF (ID)] or (EN) by locale
```

### Genericness test
- "Dark portfolio + 3D keyboard + project grid" → generic. Changed: work is no longer a grid, it is
  clips on a dated timeline; the side toggle became Solo buttons.
- "Mono everywhere for a dev" → generic. Mono limited to bars/BPM/years.
- "Fade-up every section" → removed; motion is quantize-snaps tied to the playhead only.

## 3. CV (/cv + ATS PDF)

- Source: `Muhammad_Fahrizaldi_CV baru.pdf` (ID). I write the EN translation; owner reviews wording.
- Content in one typed file `data/cv.ts` (`id` + `en`), rendered by `pages/cv.vue` (semantic
  headings, single column, no tables/columns/icons → ATS-safe) with print CSS.
- PDFs generated from that page with Playwright (`npm run cv:pdf`) into
  `public/cv/Muhammad-Fahrizaldi-CV-ID.pdf` and `-EN.pdf`; the Download button picks the file by
  current locale. Real selectable text, standard headings (Summary / Experience / Education /
  Projects / Skills).
- **Privacy:** public version shows `Banjarmasin, Indonesia` instead of the street address.
  Email + WhatsApp number stay (already public on the site).
- Fixes while porting: "Rujie Reyee" → "Ruijie Reyee", missing "(" before date ranges,
  date ranges unified.

## 4. Pages
`/` (hero, playlist, code, beats, channel rack, statement+CV, footer) · `/projects/[slug]` (restyled
case study) · `/cv` · `/music` (beats, restyled) · designed `404` · `/service` untouched for now ·
`/upload` internal, untouched.

## 5. QA (per skill, ≥ 2 passes)
Production build (`nuxt build` + `node .output/server/index.mjs`), then
`node .claude/skills/awwwards/scripts/shoot.mjs http://127.0.0.1:4400/ --crawl --nav` and `audit.mjs`.
Targets: zero console errors, no overflow at 390 px, mobile LCP < 2.5 s, CLS < 0.05, zero serious axe
issues, visible focus everywhere, reduced-motion path fully readable, fresh critic subagent score ≥ 8.

## 6. Assumptions / open items (owner to confirm)
1. Bar years per project (I'll take them from `data/project.ts`; missing years marked `placeholder`).
2. BPM in the transport = BPM of the newest beat from the beats API (falls back to 140).
3. Display name: "Aldi Fahrizaldi" on site, "Muhammad Fahrizaldi" on the CV.
4. Genres to show on the BEATS track: rap, trap, hybrid trap, remix (no others unless told).

## 7. Build notes (after QA)
- `ssr: false` stays (owner set it in 087ce10; turning SSR on throws `[nuxt] instance unavailable`).
  Cost: crawlers get an empty shell (audit FAIL: no h1/main in raw HTML, unknown URLs return 200),
  and mobile LCP is ~5 s on a throttled phone. Fixing SSR is the single biggest next win.
- Clip years come from `data/project-detail.ts`; BEATS clip years are still assumptions (placeholder).
- CV PDFs: run a production server, then `npm run cv:pdf http://127.0.0.1:4400`.
- `/api/beats` needs the Supabase env vars; without them the BEATS list shows the YouTube fallback.

## 8. Owner revisions (2026-11-10)
- Hero/footer name set as one word: "FahrizAldi".
- Code section = mixer desk (channel strips, meters; no faders). No hover image previews.
- Beats = clip deck with our own controls on the YouTube IFrame API; the video stays visible while playing (YouTube terms).
- Channel rack: piano removed. Drum pads = pack shelf (Trap, Boom Bap, UK Drill, EDM, Lo-Fi) + LCD + 12 pads; no REC/LOOP/BANK/FULL.
  Each pack has its own synthesized kit and output bus (utils/producerAudio.ts).
- Coding keyboard: press sends a wave through nearby keys, pops a code token, bounces; renders on gsap.ticker.
