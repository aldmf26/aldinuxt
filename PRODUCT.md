# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, confirmed equal by the owner (2026-11-06):
- **Beat buyers and music collaborators** who want to hear Aldi's beats and reach him.
- **Recruiters / companies** checking whether he can build real web products (role, stack, shipped work).
- **Clients (small businesses / UMKM)** looking for someone to build their web app, usually reaching out via WhatsApp.

Most visitors arrive on a phone (links from Instagram, WhatsApp, TikTok).

## Product Purpose

Personal portfolio of Aldi (Muhammad) Fahrizaldi, Banjarmasin, Indonesia: web developer and music producer. Success = each audience finds proof for its own question within seconds (hear a beat / see a shipped app / know how to hire) and acts: plays a beat, opens a case study, or messages him.

## Positioning

One person who ships both software and beats with the same craft. The two sides are one identity, not two separate CVs. Neighbouring dev portfolios cannot claim the music; producer pages cannot claim the shipped apps.

## Operating Context

- Projects are real, local, specific: Kasir OK (offline-ready POS PWA), Laporku, Agrika Gatya Arum, AgaFood (Takemori & Soondobu restaurants), JeneryMF Tools, Aldi Teori, Translation App (Indonesian–Dayak), Circle English Course (Muara Teweh), English for Wetlands.
- Music lives on YouTube (@ALdMFbeat) and SoundCloud; beats are listed via the site's beats API (server/api/beats.get.ts) with platform + link per beat.
- Contact: email, WhatsApp, Instagram, GitHub, YouTube (ContactSection.vue).

## Capabilities and Constraints

- Nuxt 3 app, deployed on Vercel. Bilingual ID (default) / EN via @nuxtjs/i18n — must stay.
- Music playback: link out to SoundCloud and YouTube only; no self-hosted audio. Players must be custom-styled (not the default YouTube look) but still play the real YouTube/SoundCloud source. Within platform terms the embed must stay visible while playing (styled facade before play is fine).
- Must stay light on phones: no heavy 3D libraries; CSS-first motion; images optimised.
- Must keep: the interactive MIDI piano and the coding (mechanical) keyboard.
- Must keep: the colour theme switcher (owner request 2026-11-06). Fix colour bugs when switching (elements that keep the old colour or flash), and give the switch a smooth, striking transition. Must respect prefers-reduced-motion and stay light on phones.
- /service pricing page is not a must-keep (undecided).
- /upload is an internal admin route.

## Brand Commitments

- Name: Aldi Fahrizaldi (handle ALdMF / aldmf26). Footer currently says "Muhammad Fahrizaldi" — undecided which full name to show.
- The interactive MIDI piano + coding keyboard are signature pieces the owner loves.
- Owner explicitly rejects AI-slop patterns; wants centered composition, minimal text, interactive, not stiff.

## Evidence on Hand

- Case-study screenshots in public/detail/<slug>/ and public/projects/ (large PNGs, need WebP).
- Problem / solution / role text per project in data/project-detail.ts and i18n/locales/*.json.
- Live links for some projects (e.g. laporku.vercel.app). Kasir OK live link not provided yet.
- No verified usage metrics. Laporku figures (500+ UMKM, 95%, Rp 50M+) are unverified and inconsistent between ID/EN — do not reuse without owner confirmation.
- No testimonials. No CV/LinkedIn link yet (open).

## Product Principles

1. Proof before decoration: real screenshots, real players, real links.
2. One person, one craft: dev and music share one system, neither is a side quest.
3. Every audience gets a one-tap action: play, open case study, message.
4. Light on a mid-range Android over mobile data.
5. Short Indonesian copy first; no generic slogans.
