<template>
  <div class="shadow-2xl acorn bg-bg border border-primary/10 md:flex p-8 flex-col md:justify-between mt-10 md:mt-20 rounded-[3rem] transition-colors duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <h5 class="text-4xl md:text-6xl font-black text-primary italic tracking-tighter">My Soundcloud</h5>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="(g, index) in typeSc"
          :key="index"
          :class="[
            selectedType === g 
              ? 'bg-warna1 text-bg shadow-lg' 
              : 'bg-primary/5 text-primary hover:bg-primary/10'
          ]"
          class="text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer rounded-full px-6 py-3 transition-all duration-300"
          @click="filterByType(g)"
        >
          {{ g }}
        </li>
      </ul>
    </div>

    <div class="overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
        <div v-for="item in filteredType" :key="item.src" class="group bg-primary/[0.02] border border-primary/5 rounded-[2rem] overflow-hidden hover:border-warna1 transition-all duration-500">
          <iframe
            class="w-full h-48 md:h-56"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            :src="`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.src}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const linkSc = ref([
  { src: "1184667226", type: "Trap" },
  { src: "476601726", type: "Trap" },
  { src: "882811474", type: "Trap" },
  { src: "882811156", type: "Trap" },
  { src: "882810868", type: "Trap" },
  { src: "882810076", type: "Trap" },
  { src: "576378918", type: "Orchestra" },
  { src: "576379527", type: "Orchestra" },
  { src: "615512247", type: "Remix" },
  { src: "616400406", type: "Remix" },
  { src: "616415394", type: "Remix" },
  { src: "616400958", type: "Remix" },
  { src: "616400973", type: "Remix" },
  { src: "616400799", type: "Remix" },
])

const typeSc = ref(["Trap", "Orchestra", "Remix"])
const selectedType = ref("Trap")
const filteredType = computed(() => {
  if (selectedType.value === "All") return linkSc.value
  return linkSc.value.filter((item) => item.type === selectedType.value)
})
const filterByType = (type) => {
  selectedType.value = type
}
</script>

<style scoped>
.acorn {
  font-family: 'Fredoka', sans-serif;
}
</style>