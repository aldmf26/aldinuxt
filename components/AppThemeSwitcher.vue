<template>
  <div class="fixed top-1/2 right-5 -translate-y-1/2 z-[9999] flex flex-col gap-3 p-[10px_8px] rounded-full bg-[#0a0a0a] ring-1 ring-white/[0.08] transition-all duration-500">
    <button
      v-for="theme in themes"
      :key="theme.id"
      @click="applyTheme(theme.id)"
      :class="[
        'w-[10px] h-[10px] rounded-full transition-all duration-300 group relative',
        activeTheme === theme.id ? 'ring-2 ring-white scale-110' : 'opacity-40 hover:opacity-100 hover:scale-125'
      ]"
      :style="{ backgroundColor: theme.dot }"

      :title="theme.label"
      data-cursor-hover
    >
      <!-- Tooltip -->
      <span class="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#0a0a0a] text-white/80 text-[10px] font-mono uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ring-1 ring-white/[0.08]">
        {{ theme.label }}
      </span>
    </button>
  </div>
</template>

<script setup>
const themes = [
  { id: 'signal',   dot: '#C8F580', label: 'Signal' },
  { id: 'ember',    dot: '#FF6B35', label: 'Ember'  },
  { id: 'frost',    dot: '#7EB3F0', label: 'Frost'  },
]


const activeTheme = ref('signal')

function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId)
  activeTheme.value = themeId
  localStorage.setItem('aldi-theme', themeId)
}

onMounted(() => {
  const saved = localStorage.getItem('aldi-theme') || 'signal'
  applyTheme(saved)
})
</script>
