<template>
  <div :class="['bg-' + activeTheme, 'fixed top-1/2 right-6 -translate-y-1/2 z-[9999] flex flex-col gap-2 p-2 rounded-full border border-white/10 shadow-2xl transition-all duration-500']">
    <button
      v-for="theme in themes"
      :key="theme.id"
      @click="applyTheme(theme.id)"
      :class="[
        'w-3.5 h-3.5 rounded-full transition-all duration-150 group relative',
        activeTheme === theme.id ? 'ring-active scale-110' : 'opacity-60 hover:opacity-100 hover:scale-125'
      ]"
      :style="{ backgroundColor: theme.dot }"
      :title="theme.id"
      data-cursor-hover
    >
    </button>
  </div>
</template>

<script setup>
import { updateParticleColor } from '~/composables/useThree'

const themes = [
  { id: 'signal',  dot: '#C8F580' },
  { id: 'ember',   dot: '#FF6B35' },
  { id: 'frost',   dot: '#7EB3F0' },
  { id: 'sakura',  dot: '#FF85A1' },
  { id: 'void',    dot: '#1A1A1A' },
  { id: 'white',   dot: '#FFFFFF' },
]

const activeTheme = ref('signal')

function applyTheme(themeId) {
  // THIS is the critical line — must set attribute on <html> element
  document.documentElement.setAttribute('data-theme', themeId)
  activeTheme.value = themeId
  localStorage.setItem('aldi-theme', themeId)
  nextTick(() => updateParticleColor())
}

onMounted(() => {
  const saved = localStorage.getItem('aldi-theme') || 'signal'
  applyTheme(saved)
})
</script>

<style scoped>
.ring-active {
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 3px rgb(var(--accent));
}
</style>
