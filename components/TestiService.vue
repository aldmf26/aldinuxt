<template>
  <div class="py-6 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-1">
      <div class="bg-orange-200 h-56 rounded-tr-3xl rounded-b-3xl">
        <Garis/>
      </div>
      <div class="bg-amber-200 relative h-56 rounded-bl-3xl rounded-t-3xl">
        <Garis/>
        <img class="absolute top-16" src="~/public/rich.png" alt="">
      </div>
    </div>
    <div class="grid grid-cols-1 py-1">
      <div class="bg-amber-100 h-24 rounded-full">Plan for the day</div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-1">
      <div class="bg-[#F47F6B] h-56 rounded-tr-3xl rounded-b-3xl">
                <Garis/>

      </div>
      <div class="bg-[#FFB32B] h-56 rounded-bl-3xl rounded-t-3xl">
                <Garis/>

      </div>
    </div>
  </div>
</template>
