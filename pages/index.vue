<style scoped>
.inputAldi {
  @apply rounded-full w-2/5 min-h-12 py-2 pl-9 pr-3 text-lime-200 bg-warna1 shadow-sm focus:outline-none focus:border-lime-200 focus:ring-lime-500 focus:ring-1 border-[#551A69] placeholder:italic placeholder:text-slate-400 mt-1 border;
}
</style>

<template>
  <!-- tampilan desktop -->
  <div class="hidden md:block">
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
  <div class="block md:hidden">
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
  <div v-for="d in 3" class="mx-8 mb-10 bg-lime-100  mt-5 flex border-4 rounded-3xl py-8 px-16">
    <div class="w-1/2 p-6">
      <img
        x-intersect="$el.classList.add('scale')"
        class="shadow-sm rounded-lg scale"
        src="https://aldi.agaject.com/img/upperclass.png"
        alt="Gambar dengan shadow dan glow"
      />
    </div>
    <div class="w-1/2 p-6">
      <h2
        x-intersect="$el.classList.add('fadeInUp')"
        class="text-2xl font-bold mb-4 text-primary fadeInUp"
      >
        Upperclass Indonesia
      </h2>
      <p
        x-intersect="$el.classList.add('fadeInUp')"
        class="text-secondary leading-relaxed fadeInUp"
      >
        a beauty sales website that sells beauty products for hair
      </p>

      <div x-intersect="$el.classList.add('fadeInUp')" class="flex fadeInUp">
        <div class="w-1/2 p-6">
          <p>
            <i class="fa-regular fa-circle-check text-btnBg mt-5"></i> Laravel
          </p>

          <p>
            <i class="fa-regular fa-circle-check text-btnBg mt-5"></i> Jquery
          </p>
        </div>
        <div class="w-1/2 p-6">
          <p>
            <i class="fa-regular fa-circle-check text-btnBg mt-5"></i> Bootstrap
          </p>
        </div>
      </div>
      <a
        x-intersect="$el.classList.add('scale')"
        href="https://upperclassindonesia.com/"
        target="_blank"
        class="leading-relaxed rounded hover:bg-primary bg-baju text-hitam border border-spacing-4 py-2 px-2 scale"
        ><i class="fa-solid fa-link"></i> View Demo</a
      >
    </div>
  </div>

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
