<style scoped>
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #334155;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cbd6e5;
  border-radius: 5px;
  border-width: 1px;
}
</style>

<template>
    <div
    class="shadow-2xl bg-slate-700 acorn md:flex p-2 flex-col md:justify-between rounded-xl"
  >
    <h5 class="text-2xl md:text-4xl mt-3">My Youtube</h5>
    <div class="flex gap-5 pr-5">
      <ul class="p-3 flex justify-items-center gap-2 md:gap-5">
        <li
          v-for="(g, index) in typeSc"
          :key="index"
          :class="{ active: selectedType === g }"
          class="hover:bg-slate-500 text-sm md:text-lg cursor-pointer rounded-2xl p-2 md:p-3"
          @click="filterByType(g)"
        >
          {{ g }}
        </li>
      </ul>
    </div>
    <div class="overflow-y-auto max-h-80 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="" v-for="item in filteredType">
        <iframe
        class="relative z-10 w-[301px] -[169px] rounded-t-3xl"
          :src="`https://www.youtube.com/embed/${item.src}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <div class="text-start bg-slate-800 text-warnaHeading rounded-b-xl p-2">
          <div class="flex justify-between items-center px-2">
            <span class="md:text-lg">{{item.judul}}</span>
            <span class="md:text-sm text-[#dbf57d]">{{item.bpm}} Bpm</span>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
const typeSc = ref(["Trap Beat","Free FLP", "EDM"]);
const linkYt = ref([
  {
    judul:'Snakey',
    src: "51X_4JpYxJ4?si=I3GeRAgLwFC_ILNL",
    type: "Free FLP",
    bpm: 108
  },
  {
    judul:'Flamingo',
    src: "UaNnC24Pnrg?si=8pcxBttxh-_Yuvho",
    type: "Free FLP",
    bpm: 100
  },
  {
    judul:'GTA',
    src: "QDRnVt_5vRc?si=--4mDY57p1VOKewJ",
    type: "Free FLP",
    bpm: 194
  },
  {
    judul:'Ginto',
    src: "e4k6F9XnN_4?si=-xBQjlGS4Yvj-aSP",
    type: "Free FLP",
    bpm: 110
  },
  {
    judul:'Boom',
    src: "IC29VAokmN8?si=1Dc59S6Y86ceIYCr",
    type: "Free FLP",
    bpm: 90
  },
  {
    judul:'Chronela',
    src: "kRE6lMO8fvE?si=tHg0dMKqqf5nqbCc",
    type: "Free FLP",
    bpm: 198
  },
  {
    judul:'Bap Bap',
    src: "8wFIg7C2slU?si=c_VJXJtXXRv5AlPb",
    type: "Free FLP",
    bpm: 101
  },
  {
    judul:'Dendang',
    src: "IuPr2iU23h0?si=bjJuStuGWUDlVonR",
    type: "Free FLP",
    bpm: 90
  },
  {
    judul:'Kurma',
    src: "kuWnALFzasE?si=MRpibNevhwl9-Acv",
    type: "Free FLP",
    bpm: 160
  },
  {
    judul:'Beatbox v2',
    src: "VAf120fBT9o?si=IAOnA0HfPlPdd_Rt",
    type: "Free FLP",
    bpm: 190
  },
  {
    judul:'Barkan',
    src: "tqWjv8MMQ5U?si=_mJhL50wl1uhRrzS",
    type: "Free FLP",
    bpm: 170
  },
  {
    judul:'Habits',
    src: "mtSq-fF_ZDI?si=7yhN5l0D6YdKI_Wb",
    type: "Free FLP",
    bpm: 170
  },
  {
    judul:'Hanoman',
    src: "WivTmpt7w5c?si=28g6FcQa_rptFjs0",
    type: "Trap Beat",
    bpm: 95
  },
  {
    judul:'South gun - SMASH',
    src: "ACMkBeKlqJ8?si=tY86g6A0wuq7SSXV",
    type: "EDM",
    bpm: 150
  },
  {
    judul:'South gun - ZAT Selatan',
    src: "Qb5_jPIvbnk?si=I5tdrhEvzvVQVrlD",
    type: "EDM",
    bpm: 150
  },
])
const selectedType = ref("Trap Beat");
const filteredType = computed(() => {
  if (selectedType.value === "All") return linkYt.value;
  return linkYt.value.filter((item) => item.type === selectedType.value);
});
const filterByType = (type) => {
  selectedType.value = type;
};
</script>
