<template>
  <div
    class="fixed top-6 left-6 z-[100] flex gap-2 p-1.5 bg-bg/80 backdrop-blur-md rounded-full border border-primary/10 shadow-2xl transition-all duration-500"
  >
    <button
      v-for="theme in themes"
      :key="theme.name"
      @click="setTheme(theme.class)"
      :class="[
        'w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center relative overflow-hidden group',
        currentTheme === theme.class
          ? 'border-primary scale-110'
          : 'border-transparent opacity-60 hover:opacity-100',
      ]"
      :style="{ backgroundColor: theme.color }"
      :title="theme.name"
    >
      <div
        class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>
    </button>
  </div>
</template>

<script setup>
const themes = [
  { name: "Light", class: "theme-light", color: "#2563eb" },
  { name: "Dark", class: "theme-dark", color: "#06b6d4" },
  { name: "Synthwave", class: "theme-synthwave", color: "#ff0080" },
  { name: "Luxury", class: "theme-luxury", color: "#10b981" },
  { name: "Funk", class: "theme-funk", color: "#ec4899" },
];

const currentTheme = ref("theme-light");

const setTheme = (className) => {
  currentTheme.value = className;
  document.body.className = className;
  localStorage.setItem("user-theme", className);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("user-theme") || "theme-light";
  setTheme(savedTheme);
});
</script>
