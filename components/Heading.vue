<template>
  <div v-motion-fade>
    <div class="hidden md:block">
      <div class="flex w-1/2 justify-center mx-auto py-10 acorn text-warna1">
        <div>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 200 },
            }"
            class="text-5xl md:text-7xl xl:text-8xl leading-tight"
          >
            Hi. I'm <span class="text-warna1">𝒜ldi</span>
          </h1>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 500 },
            }"
            class="text-4xl md:text-5xl xl:text-6xl leading-tight mt-4"
          >
            I Build <span class="text-warna1">Websites</span> &
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
            <span class="text-warna1">Produce</span> Music
          </h1>
        </div>
      </div>
    </div>
    <div class="block md:hidden">
      <div class="flex w-1/2 justify-center mx-auto py-10 acorn text-warna1">
        <div>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 200 },
            }"
            class="text-4xl md:text-5xl leading-tight"
          >
            Hi. I'm <span class="text-warna1">𝒜ldi</span>
          </h1>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: 800, delay: 500 },
            }"
            class="text-2xl md:text-5xl leading-tight mt-2"
          >
            I Build<span class="text-warna1"> Websites</span> &
            <span class="text-warna1">Produce</span> Music
          </h1>
        </div>
      </div>

      <div class="hidden flex justify-center items-center mt-[-52px]">
        <div>
          <img
            src="~/public/animasi/13.png"
            class="w-20 float-start"
            alt=""
            data-aos="fade-left"
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
