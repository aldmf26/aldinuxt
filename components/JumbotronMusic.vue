<template>
  <div v-motion-fade class="acorn py-10">
    <div class="">
      <span class="text-gray-800 md:hidden block pb-4 text-5xl">MÛsic </span>
    </div>
    <section class="py-1 md:py-10 hidden md:block">
      <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative">
        <div class="shadow-2xl rounded-xl">
          <div
            class="grid overflow-hidden shadow-xl md:grid-cols-2 bg-slate-800 rounded-xl"
          >
            <aside class="p-8 space-y-4 md:p-16 relative">
              <a
                href="https://youtube.com/@ALdMFbeat"
                target="_blank"
                class="flex flex-col items-center justify-center"
              >
                <span class="relative text-7xl px-4 py-2 mt-3 rounded-xl">
                  Enjoÿ my musÎc
                </span>
                <img
                  class="relative"
                  width="48"
                  height="48"
                  src="https://img.icons8.com/doodle/48/youtube--v1.png"
                  alt="youtube--v1"
                />
              </a>
            </aside>

            <aside class="relative">
              <img
                class="absolute left-10 w-full"
                src="~/public/mpc.png"
                alt=""
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
