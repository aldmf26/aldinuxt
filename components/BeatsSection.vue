<template>
  <section id="music" class="beats">
    <h2 class="section-title">{{ $t('music.title') }}</h2>

    <p v-if="loading" class="note">{{ $t('music.loading') }}</p>

    <div v-else-if="!beats.length" class="empty">
      <p>{{ $t('music.empty') }}</p>
      <a class="btn btn-primary" :href="YT_CHANNEL" target="_blank" rel="noopener">{{ $t('music.youtube') }}</a>
    </div>

    <ol v-else class="list">
      <li v-for="(b, i) in beats" :key="i" class="row" :class="{ active: active === i }">
        <button type="button" class="head" :aria-expanded="active === i" @click="toggle(i)">
          <span class="cover">
            <img v-if="b.yt" :src="`https://i.ytimg.com/vi/${b.yt}/mqdefault.jpg`" alt="" loading="lazy" width="320" height="180" />
            <span v-else class="bpm">{{ b.bpm || '—' }}</span>
          </span>
          <span class="info">
            <span class="title">{{ b.judul }}</span>
            <span class="sub">{{ [b.type, b.bpm && `${b.bpm} BPM`, b.source].filter(Boolean).join(' · ') }}</span>
          </span>
          <span class="play" aria-hidden="true">
            <svg v-if="active === i" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>
          </span>
        </button>

        <!-- The real platform player, framed in our own chrome; it stays visible while playing (platform terms). -->
        <div v-if="active === i" class="player">
          <iframe
            v-if="b.yt"
            class="yt"
            :src="`https://www.youtube-nocookie.com/embed/${b.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`"
            :title="b.judul"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          />
          <iframe
            v-else-if="b.sc"
            class="sc"
            :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(b.sc)}&color=${encodeURIComponent(accentHex)}&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=false`"
            :title="b.judul"
            allow="autoplay"
          />
          <audio v-else-if="b.src" :src="b.src" controls autoplay class="local" />
        </div>
      </li>
    </ol>

    <p class="more">
      <a :href="YT_CHANNEL" target="_blank" rel="noopener">YouTube @ALdMFbeat</a>
    </p>
  </section>
</template>

<script setup lang="ts">
const YT_CHANNEL = 'https://www.youtube.com/@ALdMFbeat'
const { accentHex } = useSide()

type Raw = { judul: string; bpm?: number; type?: string; src?: string; platform?: string; ytLink?: string }
const ytId = (u = '') => u.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1]

const raw = ref<Raw[]>([])
const loading = ref(true)
const active = ref<number | null>(null)

const beats = computed(() => raw.value.map(b => {
  const link = b.ytLink || (b.platform !== 'local' ? b.src : '') || ''
  // older entries stored a bare YouTube id in `src` with a non-local platform
  const yt = ytId(link) || (b.platform && b.platform !== 'local' && /^[\w-]{11}/.test(b.src || '') ? b.src!.slice(0, 11) : undefined)
  const sc = /soundcloud\.com/.test(link) ? link : undefined
  return { ...b, yt, sc, source: yt ? 'YouTube' : sc ? 'SoundCloud' : '' }
}).filter(b => b.yt || b.sc || b.src))

const toggle = (i: number) => { active.value = active.value === i ? null : i }

onMounted(async () => {
  try {
    const res = await fetch('/api/beats')
    if (res.ok) raw.value = await res.json()
  } catch {}
  loading.value = false
})
</script>

<style scoped>
.beats { max-width: 880px; margin: 0 auto; padding: 48px 16px 120px; }
.note, .more { text-align: center; color: var(--text-muted); }
.more { margin-top: 32px; }
.more a { color: var(--text-primary); text-underline-offset: 5px; text-decoration-color: var(--accent); }
.empty { display: grid; justify-items: center; gap: 20px; text-align: center; color: var(--text-secondary); font-size: 1.1rem; }
.list { list-style: none; display: grid; gap: 10px; }
.row { border-radius: 16px; background: var(--bg-surface); overflow: hidden; }
.row.active { box-shadow: 0 0 0 2px var(--accent); }
.head {
  width: 100%; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  padding: 12px; border: 0; background: none; color: inherit; text-align: left; cursor: pointer; font: inherit;
}
.cover {
  width: 96px; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden;
  background: var(--accent); display: grid; place-items: center;
}
.cover img { width: 100%; height: 100%; object-fit: cover; }
.bpm { font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: var(--accent-ink); }
.info { display: grid; gap: 2px; min-width: 0; }
.title { font-weight: 600; font-size: 1.1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sub { color: var(--text-muted); font-size: 0.95rem; }
.play {
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
  background: var(--text-primary); color: var(--bg-primary); transition: transform 0.15s;
}
.play svg { width: 20px; height: 20px; fill: currentColor; }
.head:hover .play { transform: scale(1.06); }
.active .play { background: var(--accent); color: var(--accent-ink); }
.player { padding: 0 12px 12px; }
.yt { width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 10px; display: block; }
.sc { width: 100%; height: 120px; border: 0; border-radius: 10px; display: block; }
.local { width: 100%; }
@media (max-width: 480px) { .cover { width: 72px; } }
</style>
