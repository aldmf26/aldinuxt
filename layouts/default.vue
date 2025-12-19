<template>
  <div class="fredoka text-center">
    <Nav />

    <slot />

    <div class="hidden md:flex justify-evenly mx-auto mt-20">
      <div class="">
        <img src="~/public/animasi/2.png" class="w-16" alt="" />
        <h1 class="text-warnaHeading">
          © 2024 Fahrizãldi . Banjarmasin, Indonesia
        </h1>
      </div>
      <div class="">
        <div class="flex gap-5 md:gap-20 justify-between">
          <div>
            <h1 class="font-semibold mb-5">ELSEWHERE</h1>
            <ul class="text-start">
              <li class="mb-3">
                <a target="_blank" href="https://www.instagram.com/aldiiimf"
                  >Instagram</a
                >
              </li>
              <li class="mb-3">
                <a target="_blank" href="https://github.com/aldmf26">Github</a>
              </li>
              <li class="mb-3">
                <a target="_blank" href="https://www.youtube.com/@ALdMFbeat"
                  >Youtube</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h1 class="font-semibold mb-5">CONTACT</h1>
            <ul>
              <li class="mb-3">
                <a
                  href="mailto:aldimf26@gmail.com?subject=Aldi,aku%20butuh%20bantuan!"
                >
                  Email</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="block md:hidden mt-16">
      <div class="flex gap-5 md:gap-20 justify-around">
        <div>
          <h1 class="font-semibold mb-5">ELSEWHERE</h1>
          <ul class="text-start">
            <li class="mb-3">
              <a target="_blank" href="https://www.instagram.com/aldiiimf"
                >Instagram</a
              >
            </li>
            <li class="mb-3">
              <a target="_blank" href="https://github.com/aldmf26">Github</a>
            </li>
            <li class="mb-3">
              <a target="_blank" href="https://www.youtube.com/@ALdMFbeat"
                >Youtube</a
              >
            </li>
          </ul>
        </div>
        <div>
          <img src="~/public/animasi/2.png" class="w-16" alt="" />
        </div>
        <div>
          <h1 class="font-semibold mb-5">CONTACT</h1>
          <ul>
            <li class="mb-3">
              <a
                href="mailto:aldimf26@gmail.com?subject=Aldi,aku%20butuh%20bantuan!"
              >
                Email</a
              >
            </li>
          </ul>
        </div>
      </div>

      <h1 class="text-warna1">© 2024 Fahrizãldi . Banjarmasin, Indonesia</h1>
    </div>
  </div>

  <div v-if="scrollY > 200" class="fixed bottom-0 right-0 p-5">
    <button
      class="bg-warna1 text-white font-bold py-2 px-4 rounded-full"
      @click="backToTop"
    >
      <svg
        class="h-6 w-6 transform rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  </div>
</template>
<script setup>
const scrollY = ref(0);
const onScroll = () => {
  scrollY.value = window.scrollY;
};
window.addEventListener("scroll", onScroll);
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
