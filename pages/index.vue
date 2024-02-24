<style scoped>
.inputAldi {
  @apply rounded-full w-2/5 min-h-12 py-2 pl-9 pr-3 text-lime-200 bg-warna1 shadow-sm focus:outline-none focus:border-lime-200 focus:ring-lime-500 focus:ring-1 border-[#551A69] placeholder:italic placeholder:text-slate-400 mt-1 border;
}
</style>

<template>
  <!-- tampilan desktop -->
  <div class="hidden lg:block">
    <div class="flex justify-center items-center">
      <img
        src="~/public/animasi/13.png"
        class="w-56 float-end"
        alt=""
        data-aos="fade-left"
      />
      <h1
        class="font-rockabye text-warna1 text-7xl leading-[3.5rem] tracking-tighter text-center mt-16"
      >
        Hi. I'm
        <span
          class="bg-gradient-to-r from-cyan-200 via-cyan-100 to-yellow-200 text-transparent bg-clip-text"
          >Aldi</span
        >
        <br />
        <span
          class="bg-gradient-to-r from-cyan-100 via-lime-100 to-yellow-200 text-transparent bg-clip-text"
          >Welcome</span
        >
        To My
        <span
          class="bg-gradient-to-r from-cyan-200 via-cyan-100 to-yellow-200 text-transparent bg-clip-text"
          >WORLD</span
        >
      </h1>
      <img
        src="~/public/animasi/3.png"
        class="w-56 scale-x-[-1] float-end"
        alt=""
      />
    </div>
    <input type="text" class="inputAldi" placeholder="Search my projects ..." />
  </div>

  <!-- tampilan hp -->
  <div class="block lg:hidden">
    <div class="flex">
      <img
        src="~/public/animasi/13.png"
        class="w-32 h-24 float-end"
        alt=""
        data-aos="fade-left"
      />
      <h1
        class="font-rockabye text-warna1 text-5xl tracking-tight text-center mt-10"
      >
        Hi. I'm
        <span
          class="bg-gradient-to-r from-cyan-200 via-cyan-100 to-yellow-200 text-transparent bg-clip-text"
          >Aldi</span
        >
        <br />
        <span
          class="bg-gradient-to-r from-cyan-100 via-lime-100 to-yellow-200 text-transparent bg-clip-text"
          >Welcome</span
        >
        To My
        <span
          class="bg-gradient-to-r from-cyan-200 via-cyan-100 to-yellow-200 text-transparent bg-clip-text"
          >WORLD</span
        >
      </h1>
      <img
        src="~/public/animasi/3.png"
        class="w-32 h-24 scale-x-[-1] float-end"
        alt=""
      />
    </div>

    <input type="text" class="inputAldi" placeholder="Search my projects ..." />
  </div>

  <!-- content project -->
  

  <!-- <div class="grid grid-cols-3">
    <div class="cursor-pointer bg-cyan-400 rounded-2xl h-64 m-5">
      <p class="text-sm tracking-wide">
        Aplikasi Web Terjemahan Bahasa Dayak - Indonesia
      </p>
      <h1 class="font-rockabye text-2xl">Terjemahan Dayak</h1>
    </div>
    <div class="cursor-pointer bg-cyan-400 rounded-2xl h-64 m-5">
      <p class="text-sm tracking-wide">
        Aplikasi Web Terjemahan Bahasa Dayak - Indonesia
      </p>
      <h1 class="font-rockabye text-2xl">Terjemahan Dayak</h1>
    </div>
    <div class="cursor-pointer bg-cyan-400 rounded-2xl h-64 m-5">
      <p class="text-sm tracking-wide">
        Aplikasi Web Terjemahan Bahasa Dayak - Indonesia
      </p>
      <h1 class="font-rockabye text-2xl">Terjemahan Dayak</h1>
    </div>
    <div class="cursor-pointer bg-cyan-400 rounded-2xl h-64 m-5">
      <p class="text-sm tracking-wide">
        Aplikasi Web Terjemahan Bahasa Dayak - Indonesia
      </p>
      <h1 class="font-rockabye text-2xl">Terjemahan Dayak</h1>
    </div>
  </div> -->
</template>
