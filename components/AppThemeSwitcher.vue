<template>
  <div
    class="fixed bottom-6 right-6 z-[9999] flex items-center gap-1 p-1 rounded-xl border shadow-2xl transition-all duration-500 hover:scale-[1.02]"
    :style="{
      background: 'var(--bg-surface)',
      borderColor: 'var(--border-strong)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
    }"
  >
    <!-- Tiny label -->
    <span class="pl-2 pr-1 font-mono text-[9px] uppercase tracking-[0.3em] opacity-40" :style="{ color: 'var(--text-primary)' }">
      theme
    </span>

    <button
      v-for="theme in themes"
      :key="theme.id"
      @click="applyTheme(theme.id)"
      :title="theme.label"
      :aria-label="'Switch to ' + theme.label + ' theme'"
      :class="[
        'relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300',
        activeTheme === theme.id
          ? 'font-bold shadow-sm'
          : 'opacity-50 hover:opacity-85'
      ]"
      :style="activeTheme === theme.id ? {
        background: theme.accentHex + '18',
        color: theme.accentHex,
        boxShadow: `0 0 0 1px ${theme.accentHex}40`
      } : { color: 'var(--text-secondary)' }"
      data-cursor-hover
    >
      <!-- Color swatch -->
      <span
        class="flex-shrink-0 w-2.5 h-2.5 rounded-sm transition-all duration-300"
        :style="{
          background: theme.accentHex,
          boxShadow: activeTheme === theme.id ? `0 0 8px ${theme.accentHex}` : 'none'
        }"
      />
      <span class="hidden sm:inline">{{ theme.label }}</span>
    </button>
  </div>
</template>

<script setup>
const themes = [
  {
    id: 'signal',
    label: 'Void',
    accentHex: '#7C6FF7',
    dot: '#7C6FF7',
  },
  {
    id: 'ember',
    label: 'Studio',
    accentHex: '#FF4D1C',
    dot: '#FF4D1C',
  },
  {
    id: 'frost',
    label: 'Cryo',
    accentHex: '#00D4FF',
    dot: '#00D4FF',
  },
  {
    id: 'studio-light',
    label: 'Day',
    accentHex: '#5548E8',
    dot: '#5548E8',
  },
]

const activeTheme = ref('signal')

function applyTheme(themeId) {
  document.documentElement.classList.add('theme-transitioning')
  document.documentElement.setAttribute('data-theme', themeId)

  if (themeId === 'studio-light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }

  activeTheme.value = themeId
  localStorage.setItem('aldi-theme', themeId)

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
  }, 400)
}

onMounted(() => {
  const saved = localStorage.getItem('aldi-theme') || 'signal'
  applyTheme(saved)
})
</script>
