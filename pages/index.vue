<template>
  <Nav />
  <Heading />

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mx-16 mt-8 mb-5">
    <div
      class="cursor-pointer h-64 hover:shadow-2xl shadow-lime-200 hover:scale-105 transition-all duration-500 ease-in-out glass bg-[#27C0D3] rounded-3xl"
    >
      <h1 class="acorn500 font-bold text-md md:text-xl tracking-[0.5rem] text-end p-4">
        Terjemahan
      </h1>
      <p class="text-end text-xs tracking-[0.25px] md:tracking-[1.5px] mt-[-30px] p-4">
        Aplikasi penerjemah bahasa indonesia - dayak
      </p>
      <ul class="text-xs tracking-wider grid grid-cols-2 justify-items-center md:flex md:justify-center gap-1">
        <li class="flex items-center" v-for="tech in techs">
          <div v-html="cekIcon"></div>
          {{ tech }}
        </li>
      </ul>
      <img
        class="w-full mx-auto mt-8 p-1 rounded-2xl"
        src="~/public/projects/terjemahan.png"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
const techs = ref(["Tailwind CSS", "Alpine JS", "Laravel", "Livewire"]);
const cekIcon =
  '<img width="20" height="20" src="https://img.icons8.com/doodle/20/checkmark.png" alt="checkmark"/>';
</script>
