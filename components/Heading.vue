<style scoped>
.inputAldi {
  @apply rounded-full hidden w-full md:w-2/5 min-h-12 py-2 pl-5 pr-3 text-warna1 bg-[#f1f1e1] shadow-sm focus:outline-none focus:border-lime-400 focus:ring-lime-200 focus:ring-1 border-warna1 placeholder:italic placeholder:text-slate-400 border;
}
</style>
<template>
  <div v-motion-fade>
    <div class="hidden md:block">
      <div class="flex w-1/2 justify-center mx-auto py-10 acorn text-warna1">
        <div>
          <h1>Hi. I'm <span class="text-warna1">𝒜ldi</span></h1>
          <h1 class="">
            α<span class="text-warna1">Web</span>Dev &
            <!-- <img
            src="~/public/animasi/13.png"
            class="w-28 float-start"
            alt=""
            data-aos="fade-left"
          />
          <img
            src="~/public/animasi/3.png"
            class="w-28 scale-x-[-1] float-end"
            alt=""
          /> -->
            <span class="text-warna1">Music</span>ProduceR
          </h1>
        </div>
      </div>
      <input
        type="text"
        class="inputAldi"
        placeholder="Search my projects ..."
      />
    </div>
    <div class="block md:hidden">
      <div class="flex w-1/2 justify-center mx-auto py-10 acorn text-warna1">
        <div>
          <h1 class="text-4xl">
            Hi. I'm <span class="text-warna1">àldi</span>
          </h1>
          <h1 class="text-4xl">
            A <span class="text-warna1">Web</span>Dev
            <span class="text-warna1">Music</span>ProduceR
          </h1>
        </div>
      </div>

      <div class="flex justify-center items-center mt-[-52px]">
        <div>
          <img
            src="~/public/animasi/13.png"
            class="w-20 float-start"
            alt=""
            data-aos="fade-left"
          />
        </div>
        <div>
          <input
            type="text"
            class="inputAldi"
            placeholder="Search my projects ..."
          />
        </div>
        <div>
          <img
            src="~/public/animasi/3.png"
            class="w-20 scale-x-[-1] float-end"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
