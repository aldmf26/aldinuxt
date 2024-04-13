<style scoped>
.st0 {
  fill: #f1f1e1;
}
svg {
    cursor: pointer;
}
</style>

<template>
  <div class="acorn py-10">
    <section class="py-1 md:py-10 hidden md:block">
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
        <div class="shadow rounded-xl">
          <div
            class="grid overflow-hidden shadow-xl md:grid-cols-2 bg-[#f1f1e1] rounded-xl"
          >
            <aside class="p-8 space-y-4 md:p-16">
              <div>
                <a href="" class="text-[#171618] px-4 py-2 mt-3 rounded-xl">
                  Enjoy my music
                </a>
              </div>
            </aside>

            <aside class="relative">
              <img
                class="absolute inset-0 object-cover top-[-80px]"
                width="85%"
                src="~public/lo.png"
                alt="Discover our beautiful panel"
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="flex justify-between">
      <h5 class="text-2xl text-warnaHeading md:text-4xl">My Beats</h5>
      <div class="flex gap-5 pr-5">
        <SvgBeats v-show="pageBeats > 5" @click="prevBeats()" transform="matrix(-1, 0, 0, 1, 0, 0)" />
        <SvgBeats @click="nextBeats()" transform="matrix(1, 0, 0, 1, 0, 0)" />
      </div>
    </div>

    <div class="grid grid-cols-3 md:grid-cols-5 py-2">
      <div
        v-for="item in music"
        class="rounded-xl cursor-pointer md:bg-[#f1f1e1] w-28 md:w-44 h-36"
      >
        <div>
          <img :src="`/music/${item.gambar}`" alt="" />
        </div>
        <div class="text-start">
          <span class="text-warnaHeading md:text-lg">{{ item.judul }}</span>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const pageBeats = ref(5)
const music = ref([
  {
    gambar: `1.jpg`,
    judul: "Hanoman",
  },
  {
    gambar: "2.jpg",
    judul: "Camelion",
  },
  {
    gambar: "3.jpg",
    judul: "Holy Water",
  },
  {
    gambar: "4.jpg",
    judul: "Smoking",
  },
  {
    gambar: "5.jpg",
    judul: "Espian",
  },
]);

const nextBeats = () => {
    pageBeats.value++
}
const prevBeats = () => {
    pageBeats.value--
}

</script>
