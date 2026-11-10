<template>
  <section id="rack" class="rack wrap">
    <header class="sec-head">
      <p class="track-tag"><i />CHANNEL RACK</p>
      <h2 class="display">{{ $t('rack.title') }}</h2>
      <p>{{ touch ? $t('rack.subTouch') : $t('rack.sub') }}</p>
    </header>

    <div class="tabs" role="tablist" :aria-label="$t('rack.title')">
      <button
        v-for="t in TABS"
        :id="`tab-${t}`"
        :key="t"
        type="button"
        role="tab"
        class="tab"
        :aria-selected="tab === t"
        :aria-controls="`panel-${t}`"
        :tabindex="tab === t ? 0 : -1"
        @click="tab = t"
        @keydown.right.prevent="step(1)"
        @keydown.left.prevent="step(-1)"
      ><span>{{ $t(`rack.${t}`) }}</span></button>
    </div>

    <div :id="`panel-${tab}`" class="panel" role="tabpanel" :aria-labelledby="`tab-${tab}`">
      <ClientOnly>
        <template #fallback><p class="loading">{{ $t('rack.loading') }}</p></template>
        <DuoDevice v-if="tab === 'keys'" />
        <DrumPadMachine v-else />
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
const TABS = ['keys', 'pads'] as const
type Tab = (typeof TABS)[number]

const { side } = useSide()
const tab = ref<Tab>(side.value === 'producer' ? 'pads' : 'keys')
// soloing a track in the playlist swaps the instrument: CODE → typing keyboard, BEATS → pads
watch(side, s => { tab.value = s === 'producer' ? 'pads' : 'keys' })

const touch = ref(false)
onMounted(() => { touch.value = matchMedia('(pointer: coarse)').matches })

function step(d: number) {
  const i = (TABS.indexOf(tab.value) + d + TABS.length) % TABS.length
  tab.value = TABS[i]
  nextTick(() => document.getElementById(`tab-${tab.value}`)?.focus())
}
</script>

<style scoped>
.rack { padding-block: clamp(64px, 10vh, 120px); }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tab {
  position: relative; isolation: isolate; overflow: hidden;
  min-height: 44px; padding: 0 18px; border-radius: var(--clip-r); cursor: pointer;
  border: 1px solid var(--line); background: transparent; color: var(--text-primary); font: 600 var(--t-s) var(--font-body);
}
.tab::before {
  content: ''; position: absolute; inset: 0; z-index: -1; background: var(--text-primary);
  clip-path: inset(0 100% 0 0); transition: clip-path 0.45s var(--ease);
}
.tab:hover::before, .tab:focus-visible::before { clip-path: inset(0 0 0 0); }
.tab:hover, .tab:focus-visible { color: var(--bg-primary); }
.tab[aria-selected='true'] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.tab[aria-selected='true']::before { display: none; }
.panel { min-height: 420px; display: grid; }
.loading { color: var(--text-secondary); padding: 40px 0; }
</style>
