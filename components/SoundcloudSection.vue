<template>
    <div
      class="shadow-2xl acorn bg-slate-800 md:flex p-2 flex-col md:justify-between mt-28 rounded-xl"
    >
      <h5 class="text-2xl md:text-4xl mt-3">My Soundcloud</h5>
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
        <div class="" v-for="item in filteredType">
          <iframe
            class="rounded-3xl h-36 md:h-[200px]"
            width="100%"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            :src="`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.src}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
          ></iframe>
          <div
            style="
              font-size: 10px;
              color: #cccccc;
              line-break: anywhere;
              word-break: normal;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-family: Interstate, Lucida Grande, Lucida Sans Unicode,
                Lucida Sans, Garuda, Verdana, Tahoma, sans-serif;
              font-weight: 100;
            "
          ></div>
        </div>
      </div>
    </div>
</template>

<script setup>
const linkSc = ref([
  {
    src: "1184667226",
    type: "Trap",
  },
  {
    src: "476601726",
    type: "Trap",
  },
  {
    src: "882811474",
    type: "Trap",
  },
  {
    src: "882811156",
    type: "Trap",
  },
  {
    src: "882810868",
    type: "Trap",
  },
  {
    src: "882810076",
    type: "Trap",
  },
  {
    src: "576378918",
    type: "Orchestra",
  },
  {
    src: "576379527",
    type: "Orchestra",
  },
  {
    src: "615512247",
    type: "Remix",
  },
  {
    src: "616400406",
    type: "Remix",
  },
  {
    src: "616415394",
    type: "Remix",
  },
  {
    src: "616400958",
    type: "Remix",
  },
  {
    src: "616400973",
    type: "Remix",
  },
  {
    src: "616400799",
    type: "Remix",
  },
]);

const typeSc = ref(["Trap", "Orchestra", "Remix"]);
// fungsi filter tipe soundcloud
const selectedType = ref("Trap");
const filteredType = computed(() => {
  if (selectedType.value === "All") return linkSc.value;
  return linkSc.value.filter((item) => item.type === selectedType.value);
});
const filterByType = (type) => {
  selectedType.value = type;
};
// -------
</script>