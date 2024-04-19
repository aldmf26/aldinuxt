<template>
    <div class="mt-10 sticky bottom-0 z-10 bg-warnaHeading p-4 shadow-md rounded-3xl max-w-4xl px-4 sm:px-10 md:px-8 md:mx-auto mx-10">
      <!-- Navigasi pemutaran musik -->
      <div class="flex items-center justify-center space-x-4">
        <button @click="playPause">
          <svg v-if="isPlaying" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5 4a1 1 0 011.633-.774l6 5a1 1 0 010 1.548l-6 5A1 1 0 015 16V4zm2 2v8.546L10.717 10 7 8.546V6h.001z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M7 4a1 1 0 011.633-.774l6 5a1 1 0 010 1.548l-6 5A1 1 0 015 16V4zm2 2v8.546L10.717 10 7 8.546V6h.001z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button @click="previousTrack">
          <svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.707 5.707a1 1 0 010 1.414L2.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M16 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button @click="nextTrack">
          <svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M14.293 5.707a1 1 0 010 1.414L17.586 10l-3.293 3.293a1 1 0 11-1.414-1.414l4-4a1 1 0 010-1.414l-4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M6 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
  
      <!-- Kontrol volume -->
      <div class="flex items-center justify-center mt-4">
        <input type="range" min="0" max="100" v-model="volume" class="w-48" @input="changeVolume">
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Simpan status pemutaran musik dan kontrol volume di komponen navbar
  const isPlaying = ref(false);
  const volume = ref(50);
  
  // Fungsi untuk mengontrol pemutaran musik
  const playPause = () => {
    isPlaying.value = !isPlaying.value;
    // Tambahkan logika untuk memainkan atau menjeda musik di sini
  };
  
  const previousTrack = () => {
    // Tambahkan logika untuk memainkan track sebelumnya di sini
  };
  
  const nextTrack = () => {
    // Tambahkan logika untuk memainkan track berikutnya di sini
  };
  
  const changeVolume = () => {
    // Tambahkan logika untuk mengatur volume di sini
  };
  </script>
  
  <style scoped>
  /* Tambahkan gaya CSS sesuai kebutuhan Anda */
  </style>
  