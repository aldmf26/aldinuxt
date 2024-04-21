<template>
  <div v-motion-fade class="">
    <section class="py-1 md:py-10">
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
        <div class="shadow-2xl rounded-xl">
          <div class="grid overflow-hidden shadow-xl md:grid-cols-1 rounded-xl">
            <aside class="p-8 md:space-y-4 md:p-16">
              <div class="acorn">
                <span class="text-gray-800 text-4xl md:text-7xl">Servicë </span>
              </div>
              <a
                href="#"
                target="_blank"
                class="flex flex-col items-center justify-center"
              >
                <span
                  class="relative text-gray-800 text-sm md:text-xl md:px-4 py-2 md:mt-3 rounded-xl"
                >
                  <img
                    src="~/public/animasi/7.png"
                    class="absolute w-28 md:w-36 -top-28 md:-top-36 md:bottom-20 -left-12"
                    alt=""
                    data-aos="fade-left"
                  />
                  <img
                    src="~/public/animasi/9.png"
                    class="absolute w-24 bottom-30 -right-20"
                    alt=""
                    data-aos="fade-left"
                  />
                  Bangun situs web unik dan hasilkan musik yang memukau!
                  Ciptakan karya Anda sendiri dengan layanan saya. Hubungi
                  sekarang!
                </span>
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <h6 class="text-warnaHeading md:text-xl">
      <span class="p-2"></span>
    </h6>
    <div class="grid place-items-center">
      <div class="md:w-[970px] mx-4 md:mx-auto">
        <div class="bg-warnaHeading p-10 shadow-sm rounded-3xl">
          <h3 class="text-lg md:text-2xl font-medium text-gray-800">
            FAQ tentang layanan ini
          </h3>

          <!-- What is term -->
          <div @click="toggleAccordion(0)" class="rounded-lg transition">
            <!-- header -->
            <div
              class="hover:bg-lime-100 accordion-header cursor-pointer transition flex space-x-5 px-1 md:px-5 items-center h-16"
            >
              <IconAccordion />
              <h3>What is term?</h3>
            </div>
            <!-- Content -->
            <div
              :class="isOpen[0] ? 'max-h-28' : 'overflow-hidden max-h-0'"
              class="accordion-content px-5 pt-0"
            >
              <p class="text-xs md:text-lg leading-6 pl-9 text-justify">
                Our asked sex point her she seems. New plenty she horses parish
                design you. Stuff sight equal of my woody. Him children bringing
                goodness suitable she entirely put far daughter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
useHead({
  title: `Service - Aldi`,
});

const isOpen = ref([false, false, false]);

// Fungsi untuk membalikkan status accordion sesuai dengan indeks yang diberikan
const toggleAccordion = (index) => {
  isOpen.value[index] = !isOpen.value[index];
};
</script>

<style>
.accordion-content {
  transition: max-height 0.3s ease-out, padding 0.3s ease;
}
</style>
