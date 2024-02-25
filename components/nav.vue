<style>
.navHover {
  @apply hover:bg-lime-200 hover:rounded-full cursor-pointer;
}
.navActive {
  @apply rounded-full  bg-lime-200;
}
</style>

<template>
  <div class="flex text-md lg:text-lg justify-center lg:gap-x-8 mt-6">
    <NuxtLink to="/" :class="{'navActive' : $route.name === 'index'}" class="p-3  navHover">Work <span class="p-0.5 rounded-lg border-2 border-lime-100">/</span></NuxtLink>
    <div  class="p-3  navHover">About</div>
    <div  class="p-3 navHover">Play</div>
    <div  class="p-3 navHover">Notes</div>
    <NuxtLink :class="{'navActive' : $route.name === 'contact'}" to="/contact" class="p-3 navHover">Contact</NuxtLink>
</div>
<slot />
</template>


