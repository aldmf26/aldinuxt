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
  background: #255BA6;
  border-radius: 5px;
  border-width: 1px;
}
</style>
<template>
  <div v-motion-fade class="py-8 md:py-16">
    <!-- Hero Section Title -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <h2 class="acorn500 text-4xl md:text-6xl font-bold text-gray-800">Projects</h2>
      <p class="text-lg md:text-xl text-gray-600">Crafted with passion and precision</p>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Featured Project 1 - Agrika Gatya Arum -->
      <a 
        target="_blank" 
        href="https://ptagrikagatyaarum.com/" 
        :class="classCard"
        class="block group"
      >
        <div class="grid md:grid-cols-2 gap-8 items-center p-8">
          <div class="order-2 md:order-1">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-semibold rounded-full">Featured</span>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Export Business</span>
            </div>
            <h1 class="acorn500 text-start text-3xl md:text-4xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
              Agrika Gatya Arum
            </h1>
            <p class="text-base text-start md:text-lg text-gray-600 leading-relaxed mb-6">
              PT Agrika Gatya Arum is a leading company specializing in the export of premium bird's nest products.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">Laravel</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">MySQL</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">Bootstrap</span>
            </div>
          </div>
          <div class="order-1 md:order-2">
            <div class="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
              <img
                class="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                :src="`/projects/agrika.png`"
                alt="Agrika Gatya Arum"
              />
            </div>
          </div>
        </div>
      </a>

      <!-- Grid Projects -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          :href="project.link"
          target="_blank"
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
              <h3 class="acorn500 text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {{ project.judul }}
              </h3>
              <p class="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
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
        </a>
      </div>

      <!-- Featured Project 2 - AgaFood -->
      <a 
        target="_blank" 
        href="https://ptagafood.com/"
        :class="classCard"
        class="block group"
      >
        <div class="p-8">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-semibold rounded-full">Featured</span>
            <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Restaurant</span>
          </div>
          <h1 class="acorn500 text-3xl md:text-4xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
            AgaFood
          </h1>
          <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-4xl">
            PT AgaFood operates renowned Japanese (Takemori) and Korean (Soondobu) restaurants in Banjarmasin.
          </p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span 
              v-for="tech in projectResto" 
              :key="tech"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
            >
              {{ tech }}
            </span>
          </div>
          <div class="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
            <img
              class="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
              :src="`/projects/resto1.png`"
              alt="AgaFood Restaurant"
            />
          </div>
        </div>
      </a>

    </div>
  </div>
</template>

<script setup>
const classCard = ref(
  "bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out rounded-2xl border border-gray-100"
);

const projects = ref([
  {
    id: 1,
    judul: "Aldi Teori",
    deskripsi: "A comprehensive theory application about historical figures and civilizations",
    techs: ["Nuxt 3", "Tailwind CSS", "Daisy UI"],
    link: "https://alditeori.vercel.app/",
    imgLink: "teori.png",
  },
  {
    id: 2,
    judul: "Translation App",
    deskripsi: "Indonesian-Dayak language translator application for cultural preservation",
    techs: ["Tailwind CSS", "Alpine JS", "Laravel", "Livewire"],
    link: "https://terjemahan.klinikhappykids.com/",
    imgLink: "terjemahan.png",
  },
  {
    id: 3,
    judul: "Catat Duit",
    deskripsi: "Simple and intuitive cashflow management application for personal finance",
    techs: ["Laravel", "Jquery", "Bootstrap 5", "MySQL"],
    link: "https://cashflow.klinikhappykids.com",
    imgLink: "cashflow.png",
  },
]);

const projectResto = ref([
  'Laravel', 'Livewire', 'Jquery', 'Bootstrap', 'Alpine JS'
])
</script>