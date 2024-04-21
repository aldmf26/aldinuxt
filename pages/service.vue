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

    <FaqService />

    <TestiService />
  </div>
</template>
<script setup>
useHead({
  title: `Service - Aldi`,
});
</script>
