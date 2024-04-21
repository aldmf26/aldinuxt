<style>
.st0 {
  fill: #f1f1e1;
}
svg {
  cursor: pointer;
}
.active {
  background-color: #b5bfcb;
  color: rgb(80,77,77);
}
</style>

<template>
  <JumbotronMusic v-motion-fade />
  <div v-motion-slide-visible-bottom class="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 mt-[-50px] md:mt-0 mb-36">
    <YoutubeSection v-motion-slide-visible-bottom />
    <SoundcloudSection v-motion-slide-visible-bottom />
  </div>
</template>
<script setup>
useHead({
  title: `Music - Aldi`
})
</script>
