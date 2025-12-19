<style>
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1e1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #255ba6;
  border-radius: 5px;
  border-width: 1px;
}
</style>
<template>
  <div v-motion-fade class="py-8 md:py-16">
    <!-- Hero Section Title -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <h2 class="acorn500 text-4xl md:text-6xl font-bold text-gray-800">
        My Projects
      </h2>
      <p class="text-lg md:text-xl text-gray-600">
        Crafted with passion and precision
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Grid Projects -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          :to="`/projects/${project.detail}`"
          v-for="project in projects"
          :key="project.judul"
          :class="classCard"
          class="block group h-full"
        >
          <div class="p-6 flex flex-col h-full">
            <!-- Image -->
            <!-- <div class="relative overflow-hidden rounded-xl mb-6 h-48">
              <img
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                :src="`/projects/${project.imgLink}`"
                alt=""
              />
            </div> -->

            <!-- Content -->
            <div class="flex-grow">
              <h3
                class="acorn500 text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors"
              >
                {{ project.judul }}
              </h3>
              <p
                class="text-sm md:text-base text-gray-600 mb-4 leading-relaxed"
              >
                {{ project.deskripsi }}
              </p>
            </div>

            <!-- Tech Stack -->
            <div class="flex flex-wrap gap-2 mt-auto">
              <span
                v-for="tech in project.techs"
                :key="tech"
                class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const classCard = ref(
  "bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-2xl border border-gray-100"
);

const projects = ref([
  {
    id: 0,
    detail: "agrika",
    judul: "Agrika Gatya Arum",
    deskripsi:
      "Landing page website for exporting Birdnest, a premium quality Indonesian coffee",
    techs: ["Laravel", "Jquery", "Bootstrap 5", "MySQL"],
    link: "https://ptagrikagatyaarum.com/",
    imgLink: "agrika.png",
  },
  {
    id: 1,
    detail: "teory",
    judul: "Aldi Teori",
    deskripsi:
      "A comprehensive theory application about historical figures and civilizations",
    techs: ["Nuxt 3", "Tailwind CSS", "Daisy UI"],
    link: "https://alditeori.vercel.app/",
    imgLink: "teori.png",
  },
  {
    id: 2,
    detail: "translation",
    judul: "Translation App",
    deskripsi:
      "Indonesian-Dayak language translator application for cultural preservation",
    techs: ["Tailwind CSS", "Alpine JS", "Laravel", "Livewire"],
    link: "https://terjemahan.klinikhappykids.com/",
    imgLink: "terjemahan.png",
  },
  {
    id: 3,
    detail: "cashflow",
    judul: "Catat Duit",
    deskripsi:
      "Simple and intuitive cashflow management application for personal finance",
    techs: ["Laravel", "Jquery", "Bootstrap 5", "MySQL"],
    link: "https://cashflow.klinikhappykids.com",
    imgLink: "cashflow.png",
  },
  {
    id: 4,
    detail: "resto",
    judul: "AgaFood",
    deskripsi:
      "POS Japanese (Takemori) and Korean (Soondobu) restaurants in Banjarmasin.",
    techs: ["Laravel", "Livewire", "Jquery", "Bootstrap", "Alpine JS"],
    link: "https://ptagafood.com/",
    imgLink: "resto1.png",
  },
]);

const projectResto = ref([
  "Laravel",
  "Livewire",
  "Jquery",
  "Bootstrap",
  "Alpine JS",
]);
</script>
