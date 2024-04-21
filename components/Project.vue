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
  <div v-motion-fade>
  <div  class="grid grid-rows-1 gap-5 mx-8 md:mx-16">
    <a  target="_blank" href="https://ptagrikagatyaarum.com/" :class="classCard">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div>
          <img
            class="h-44 md:h-72 w-full mt-3 p-1 rounded-2xl border-2 border-lime-200"
            :src="`/projects/agrika.png`"
            alt=""
          />
        </div>
        <div class="text-start content-center">
          <h1
            class="acorn500 text-warna1 font-bold text-xl md:text-3xl tracking-[0.5rem] p-4"
          >
            Agrika Gatya Arum
          </h1>
          <p
            class="text-sm md:text-lg tracking-[0.25px] md:tracking-[1.5px] mt-[-30px] p-4"
          >
            PT Agrika Gatya Arum adalah perusahaan bergerak dibidang ekspor
            sarang burung walet.
          </p>
        </div>
      </div>
    </a>
  </div>
  <div  class="grid grid-cols-1 md:grid-cols-3 gap-5 mx-8 md:mx-16 mt-3 mb-5">
    <a
      :href="project.link"
      target="_blank"
      v-for="(project, index) in projects"
      :key="project.judul"
      class="h-90"
      :class="classCard"
    >
      <h1
        class="acorn500 text-warna1 font-bold text-lg md:text-xl tracking-[0.5rem] text-center md:text-end p-4"
      >
        {{ project.judul }}
      </h1>
      <p
        class="text-center md:text-end text-xs tracking-[0.25px] md:tracking-[1.5px] mt-[-30px] p-4"
      >
        {{ project.deskripsi }}
      </p>
      <ul
        class="text-xs tracking-wider grid grid-cols-2 justify-items-center md:flex md:justify-center gap-1"
      >
        <li class="flex items-center" v-for="tech in project.techs">
          <div v-html="cekIcon"></div>
          {{ tech }}
        </li>
      </ul>
      <div class="overflow-y-auto max-h-36 mb-4">
        <img
          class="w-full mx-auto mt-3 p-1 rounded-2xl border-2 border-lime-200"
          :src="`/projects/${project.imgLink}`"
          alt=""
        />
      </div>
    </a>
  </div>

  <div class="grid grid-cols-1 mx-8 md:mx-16 mt-3 mb-5" :class="classCard">
    <a target="_blank" href="https://ptagafood.com/">
      <h1
        class="acorn500 text-warna1 font-bold text-xl md:text-3xl tracking-[0.5rem] p-4"
      >
        AgaFood
      </h1>
      <p class="text-sm md:text-lg tracking-[0.25px] md:tracking-[1.5px] mt-[-30px] p-4">
        PT AgaFood adalah sebuah restoran Jepang (Takemori) dan Korea (Soondobu) yang terkenal di
        banjarmasin.
      </p>
      <ul
        class="text-xs md:text-lg tracking-wider grid grid-cols-2 justify-items-center md:flex md:justify-center gap-1"
      >
        <li class="flex items-center" v-for="tech in projectResto">
          <div v-html="cekIcon"></div>
          {{ tech }}
        </li>
      </ul>
      <img
        class="w-full md:h-screen mx-auto aspect-w-16 aspect-h-9 mt-3 p-1 rounded-2xl border-2 border-lime-200"
        :src="`/projects/resto1.png`"
        alt=""
      />
    </a>
  </div>
</div>
</template>
<script setup>
const classCard = ref(
  "bg-[#f1f1e1] cursor-pointer hover:shadow-2xl shadow-lime-200 hover:scale-105 transition-all duration-500 ease-in-out glass rounded-3xl"
);
const projects = ref([
  {
    id: 1,
    judul: "Aldi Teori",
    deskripsi: "Aplikasi teori tentang tokoh dan peradaban",
    techs: ["Nuxt 3", "Tailwind CSS", "Daisy UI"],
    link: "https://alditeori.vercel.app/",
    imgLink: "teori.png",
  },
  {
    id: 2,
    judul: "Terjemahan",
    deskripsi: "Aplikasi penerjamah bahasa indonesia - dayak",
    techs: ["Tailwind CSS", "Alpine JS", "Laravel", "Livewire"],
    link: "https://terjemahan.klinikhappykids.com/",
    imgLink: "terjemahan.png",
  },
  {
    id: 3,
    judul: "Cashflow",
    deskripsi: "Aplikasi sederhana mencatat cashflow anda",
    techs: ["Laravel", "Jquery", "Boostrap 5", "MySQL"],
    link: "https://cashflow.klinikhappykids.com/cashflow/add",
    imgLink: "cashflow.png",
  },
]);

const projectResto = ref([
  'Laravel', 'Livewire', 'Jquery', 'Boostrap', 'Alpine JS'
])
const cekIcon =
  '<img width="20" height="20" src="https://img.icons8.com/doodle/20/checkmark.png" alt="checkmark"/>';
</script>
