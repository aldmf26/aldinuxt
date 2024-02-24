<template>
  <!-- component -->
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
</template>
