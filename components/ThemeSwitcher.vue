<template>
  <div class="fixed top-6 left-6 z-[100] flex gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
    <button 
      v-for="theme in themes" 
      :key="theme.name"
      @click="setTheme(theme.class)"
      :class="[
        'w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110',
        currentTheme === theme.class ? 'border-warna1 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
      ]"
      :style="{ backgroundColor: theme.color }"
      :title="theme.name"
    >
    </button>
  </div>
</template>

<script setup>
const themes = [
  { name: 'Dark', class: 'theme-dark', color: '#0E141B' },
  { name: 'Cream', class: 'theme-cream', color: '#E4E5DC' },
  { name: 'Green', class: 'theme-green', color: '#294936' },
  { name: 'Bright', class: 'theme-bright', color: '#ECECEA' }
]

const currentTheme = ref('theme-bright')

const setTheme = (className) => {
  currentTheme.value = className
  document.body.className = className
  localStorage.setItem('user-theme', className)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme') || 'theme-bright'
  setTheme(savedTheme)
})
</script>
