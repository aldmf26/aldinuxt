<template>
  <div class="py-6 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-1">
      <div
        class="relative overflow-hidden bg-orange-200 h-56 rounded-tr-3xl rounded-b-3xl"
      >
        <Garis />
        <span>Web Developer</span>
        <div class="mt-1 grid grid-row gap-1">
          <TestiList konten="VS Code" />
          <TestiList konten="Git" />
          <TestiList konten="Terminal" />
        </div>

        <img
          class="absolute top-30 z-10 rounded-3xl p-1 mt-2 w-full"
          src="~/public/koding.jpg"
          alt=""
        />
      </div>
      <div class="bg-amber-200 relative h-56 rounded-bl-3xl rounded-t-3xl">
        <Garis />
        <span>Tech</span>
        <div class="mt-1 grid grid-row gap-1">
          <TestiList konten="Laravel" />
          <TestiList konten="Livewire" />
          <TestiList konten="AlpineJS" />
          <TestiList konten="Tailwind" />
          <TestiList konten="Vue / Nuxt" />
          <TestiList konten="MySQL" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 py-1">
      <div class="relative bg-gradient-to-tl from-amber-100 via-cyan-100 to-green-400 h-14 rounded-full">
        <div class="flex items-center mx-2 justify-between gap-2">
          <img src="~/public/aldi.png" class="w-14 p-2 rounded-full" alt="" />
          
          <span>M. Fahrizaldi/ ALdMF Beat</span>
          <img src="~/public/logo.jpg" class="w-14 p-2 rounded-full" alt="" />
         
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-1">
      <div class="relative bg-cyan-200 h-56 rounded-tr-3xl rounded-b-3xl">
        <Garis />
        <span>Tools</span>
        <div class="mt-1 grid grid-row gap-1">
          <TestiList konten="FL Studio 20" />
          <TestiList konten="Capcut" />
          <TestiList konten="Canva" />
          <TestiList konten="Filmora" />
          <TestiList konten="OBS Studio" />
          <TestiList konten="Pics Art" />
        </div>
      </div>
      <div
        class="relative overflow-hidden bg-green-400 h-56 rounded-bl-3xl rounded-t-3xl"
      >
        <Garis />
        <span>Music Maker</span>
        <div class="mt-1 grid grid-row gap-1">
          <TestiList konten="Trap Beat" />
          <TestiList konten="Remix" />
          <TestiList class="z-20" konten="EDM" />
        </div>
        <img class="absolute top-28 z-10" src="~/public/rich.png" alt="" />
      </div>
    </div>
  </div>
</template>
