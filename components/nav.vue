<style>
.navHover {
  @apply hover:bg-white/40 hover:rounded-full cursor-pointer;
}
.navActive {
  @apply rounded-full  bg-white/40;
}
</style>

<template>
  <div
    class="text-warna1 flex text-md lg:text-lg justify-center gap-x-5 lg:gap-x-8 pt-6"
  >
    <NuxtLink
      to="/"
      :class="{
        navActive: $route.name === 'index' || $route.name === 'projects-detail',
      }"
      class="p-3 navHover"
      >Web <img src="~/public/wired.gif" class="inline w-8" alt=""
    /></NuxtLink>
    <NuxtLink
      :class="{ navActive: $route.name === 'music' }"
      to="/music"
      class="p-3 navHover"
      >Music<img src="~/public/music.gif" class="inline w-8" alt=""
    /></NuxtLink>
    <NuxtLink
      :class="{ navActive: $route.name === 'service' }"
      to="/service"
      class="p-3 navHover"
      >Service<img src="~/public/cons.gif" class="inline w-8" alt=""
    /></NuxtLink
    >
    <!-- <NuxtLink :class="{ navActive: $route.name === 'belajar' }" to="/belajar" class="p-3 navHover">Belajar</NuxtLink> -->
  </div>
  <!-- <div class="grid grid-cols-2 gap-7">
    <div>
      <img src="~/public/animasi/2.png" class="w-28" alt="" />
    </div>
    <div></div>
  </div> -->
</template>
