<template>
  <div class="grid grid-cols-1  md:grid-cols-3 gap-8 mx-8 md:mx-16 mt-8 mb-5">
    <a
      :href="project.link"
      target="_blank"
      v-for="project in projects"
      :key="project.judul"
      class="bg-[#f1f1e1] h-64 cursor-pointer hover:shadow-2xl shadow-lime-200 hover:scale-105 transition-all duration-500 ease-in-out glass rounded-3xl"
    >
      <h1
        class="acorn500 text-warna1 font-bold text-md md:text-xl tracking-[0.5rem] text-end p-4"
      >
        {{ project.judul }}
      </h1>
      <p
        class="text-end text-xs tracking-[0.25px] md:tracking-[1.5px] mt-[-30px] p-4"
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
      <div class="overflow-y-auto max-h-32">
        <img
          class="w-full mx-auto mt-3 p-1 rounded-2xl border-2 border-lime-200"
          :src="`/projects/${project.imgLink}`"
          alt=""
        />
      </div>
    </a>
  </div>
</template>
<script setup>
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
const techs = ref();
const cekIcon =
  '<img width="20" height="20" src="https://img.icons8.com/doodle/20/checkmark.png" alt="checkmark"/>';
</script>
