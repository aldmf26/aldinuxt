<template>
  <div
    class="fixed top-6 left-6 z-[100] flex gap-2 p-1.5 bg-dark/80 backdrop-blur-md rounded-full border border-white/10 shadow-2xl transition-all duration-500"
  >
    <button
      v-for="theme in themes"
      :key="theme.name"
      @click="setTheme(theme.class)"
      :class="[
        'w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden group',
        currentTheme === theme.class
          ? 'border-white/80 scale-110'
          : 'border-transparent opacity-60 hover:opacity-100',
      ]"
      :style="{ backgroundColor: theme.color }"
      :title="theme.name"
      data-cursor-hover
    >
      <div
        class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>
    </button>
  </div>
</template>

<script setup>
const themes = [
  { name: "Signal", class: "theme-signal", color: "#C8F580" },
  { name: "Cyan", class: "theme-cyan", color: "#06b6d4" },
  { name: "Neon", class: "theme-neon", color: "#ff0080" },
  { name: "Gold", class: "theme-gold", color: "#f59e0b" },
  { name: "Violet", class: "theme-violet", color: "#8b5cf6" },
];

const currentTheme = ref("theme-signal");

const setTheme = (className) => {
  currentTheme.value = className;
  // Remove all theme classes first
  document.body.classList.remove(...themes.map(t => t.class));
  document.body.classList.add(className);
  localStorage.setItem("user-theme", className);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("user-theme") || "theme-signal";
  setTheme(savedTheme);
});
</script>
