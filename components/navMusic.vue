<template>
    <div class="mt-10 sticky bottom-6 z-50 bg-bg border border-primary/10 p-4 shadow-2xl rounded-[2rem] max-w-xl mx-auto backdrop-blur-md transition-colors duration-500">
      <div class="flex items-center justify-between px-6">
        <!-- Player Controls -->
        <div class="flex items-center space-x-6">
          <button @click="previousTrack" class="text-primary hover:text-warna1 transition-colors">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h2V5H6v14zm3.5-7L18 19V5l-8.5 7z"/>
            </svg>
          </button>
          
          <button @click="playPause" class="w-12 h-12 bg-warna1 text-bg rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-warna1/20">
            <svg v-if="!isPlaying" class="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>

          <button @click="nextTrack" class="text-primary hover:text-warna1 transition-colors">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 19h2V5h-2v14zM6 5v14l8.5-7L6 5z"/>
            </svg>
          </button>
        </div>
    
        <!-- Volume -->
        <div class="flex items-center gap-4">
          <svg class="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="volume" 
            class="w-24 h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-warna1" 
            @input="changeVolume"
          >
        </div>
      </div>
    </div>
</template>
  
<script setup>
const isPlaying = ref(false)
const volume = ref(50)

const playPause = () => isPlaying.value = !isPlaying.value
const previousTrack = () => {}
const nextTrack = () => {}
const changeVolume = () => {}
</script>

<style scoped>
/* Custom range thumb styling */
input[type=range]::-webkit-slider-runnable-track {
  background: transparent;
}
</style>