<template>
  <div class="shadow-2xl bg-bg border border-primary/10 acorn md:flex p-8 flex-col md:justify-between rounded-[3rem] transition-colors duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <h5 class="text-4xl md:text-6xl font-black text-primary italic tracking-tighter">My Youtube</h5>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="(g, index) in typeSc"
          :key="index"
          :class="[
            selectedType === g 
              ? 'bg-warna1 text-bg shadow-lg' 
              : 'bg-primary/5 text-primary hover:bg-primary/10'
          ]"
          class="text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer rounded-full px-6 py-3 transition-all duration-300"
          @click="filterByType(g)"
        >
          {{ g }}
        </li>
      </ul>
    </div>

    <div class="overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="item in filteredType" :key="item.src" class="group bg-primary/[0.02] border border-primary/5 rounded-[2rem] overflow-hidden hover:border-warna1 hover:translate-y-[-4px] transition-all duration-500">
          <div class="aspect-video">
            <iframe
              class="w-full h-full"
              :src="`https://www.youtube.com/embed/${item.src}`"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div class="p-5 flex justify-between items-center bg-bg group-hover:bg-primary/[0.03] transition-colors">
            <span class="font-bold text-primary truncate pr-4 text-lg">{{item.judul}}</span>
            <span class="text-[10px] font-black uppercase tracking-widest text-warnaHijau bg-warnaHijau/10 px-3 py-1 rounded-full whitespace-nowrap">{{item.bpm}} Bpm</span>
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
