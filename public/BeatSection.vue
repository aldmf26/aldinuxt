<style scoped>
.active {
  background-color: #b5bfcb;
  color: rgb(80,77,77);
}
</style>
<template>
  <!-- my beats  -->
  <div class="md:flex flex-col md:justify-between">
    <h5 class="text-2xl text-warnaHeading md:text-4xl">My Beats</h5>
    <div class="flex gap-5 pr-5">
      <ul class="mt-4 flex justify-items-center gap-2 md:gap-5">
        <span class="text-sm md:text-lg">Genre's : </span>
        <li
          v-for="(g, index) in genres"
          :key="index"
          :class="{ active: selectedGenre === g }"
          class="bg-warnaHeading hover:bg-slate-200 text-sm md:text-lg cursor-pointer rounded-2xl p-1 md:p-2"
          @click="filterByGenre(g)"
        >
          {{ g }}
        </li>
      </ul>
    </div>
  </div>

  <!-- card music -->
  <div class="grid grid-cols-3 md:grid-cols-5 gap-y-11 md:gap-y-28 py-2">
    <div
      v-for="(item, index) in filteredMusic"
      :key="item.judul"
      class="rounded-xl cursor-pointer md:bg-[#f1f1e1] w-28 md:w-44 h-36 hover:border-2 border-transparent"
      :class="{
        'border-2': clickedColumnIndex === index,
        'border-transparent': hoveredColumnIndex !== index && clickedColumnIndex !== index,
      }"
      @mouseenter="hoveredColumnIndex = index"
      @mouseleave="hoveredColumnIndex = null"
      @click="handleClick(index)"
    >
      <div class="relative">
        <img
          :src="`/music/${item.gambar}`"
          class="opacity-1 rounded-t-xl w-full h-full object-cover"
          alt=""
        />
        <PlayIcon
          v-if="hoveredColumnIndex === index || clickedColumnIndex === index"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-12 h-12"
        />
      </div>

      <div class="text-start bg-slate-800 text-warnaHeading rounded-b-xl p-2">
        <span class="md:text-lg">{{ item.judul }}</span>
        <br />
        <div
          class="flex justify-between text-xs md:text-sm px-1 text-[#dbf57d]"
        >
          <span class="">{{ item.bpm }} Bpm</span>
          <span class="">#{{ item.genre }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="mb-56" /> -->
  <!-- <MusicPlayer :playMusic="isMusicPlaying" v-if="isMusicPlaying"/> -->
</template>
<script setup>
const hoveredColumnIndex = ref(null);
const clickedColumnIndex = ref(null);

let audioElement = null;
const isMusicPlaying = ref(false);
const currentPlayingIndex = ref(null);

const genres = ref(["All", "Piano", "Arabic", "India", "Dark", "808"]);
const music = ref([
  {
    gambar: `1.jpg`,
    judul: "Hanoman",
    genre: "India",
    bpm: "90",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "2.jpg",
    judul: "Camelion",
    genre: "Arabic",
    bpm: "110",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "3.jpg",
    judul: "Holy Water",
    genre: "808",
    bpm: "170",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "4.jpg",
    judul: "Smoking",
    genre: "Dark",
    bpm: "110",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "5.jpg",
    judul: "Espian",
    genre: "Piano",
    bpm: "90",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "4.jpg",
    judul: "Smoking",
    genre: "Arabic",
    bpm: "100",
    audio: "audio/smoking.mp3",
  },
  {
    gambar: "5.jpg",
    judul: "Espian",
    genre: "Arabic",
    bpm: "110",
    audio: "audio/smoking.mp3",
  },
]);

// fungsi filter genre
const selectedGenre = ref("All");

const filteredMusic = computed(() => {
  if (selectedGenre.value === "All") return music.value;
  return music.value.filter((item) => item.genre === selectedGenre.value);
});

const filterByGenre = (genre) => {
  selectedGenre.value = genre;
};
// ------

const toggleClickedColumnIndex = (index) => {
  clickedColumnIndex.value = clickedColumnIndex.value === index ? null : index;
};

const playMusic = (index) => {
  if (audioElement && index === currentPlayingIndex.value) {
    // Jika musik dengan indeks yang sama sedang diputar, jeda musik tersebut
    if (isMusicPlaying.value) {
      audioElement.pause();
      isMusicPlaying.value = false;
    } else {
      audioElement.play();
      isMusicPlaying.value = true;
    }
  } else {
    // Jika musik dengan indeks yang berbeda diputar, hentikan pemutaran musik saat ini dan mulai musik baru
    if (audioElement) {
      audioElement.pause();
    }
    audioElement = new Audio(filteredMusic.value[index].audio);
    audioElement.play();
    isMusicPlaying.value = true;
    currentPlayingIndex.value = index;
  }
};

const handleClick = (index) => {
  toggleClickedColumnIndex(index);
  playMusic(index);
};

onBeforeUnmount(() => {
  // Hentikan pemutaran musik sebelum komponen dihancurkan
  if (audioElement) {
    audioElement.pause();
    isMusicPlaying.value = false;
    currentPlayingIndex.value = null;
  }
});
</script>
