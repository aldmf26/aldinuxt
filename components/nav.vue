<style>
.navHover {
  @apply hover:bg-lime-200 hover:rounded-full cursor-pointer;
}
.navActive {
  @apply rounded-full  bg-lime-200;
}
</style>

<template>
  <div
    class="text-warna1 flex text-md lg:text-lg justify-center gap-x-5 lg:gap-x-8 pt-6"
  >
    <NuxtLink
      to="/"
      :class="{ navActive: $route.name === 'index' }"
      class="p-3 navHover"
      >Web
      <span class="p-0.5 rounded-lg border-2 border-lime-100">/</span></NuxtLink
    >
    <NuxtLink :class="{ navActive: $route.name === 'music' }" to="/music" class="p-3 navHover">Music</NuxtLink>
    <NuxtLink :class="{ navActive: $route.name === 'service' }" to="/service" class="p-3 navHover">Service</NuxtLink>
    <!-- <NuxtLink :class="{ navActive: $route.name === 'belajar' }" to="/belajar" class="p-3 navHover">Belajar</NuxtLink> -->
  </div>
  <!-- <div class="grid grid-cols-2 gap-7">
    <div>
      <img src="~/public/animasi/2.png" class="w-28" alt="" />
    </div>
    <div></div>
  </div> -->
</template>
