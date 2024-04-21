<template>
  <!-- What is term -->
  <div @click="toggleAccordion" class="rounded-lg transition">
    <!-- header -->
    <div
      :class="isOpen ? 'bg-lime-100' : ''"
      class="hover:bg-lime-100 accordion-header cursor-pointer transition flex space-x-5 px-1 md:px-5 items-center h-16"
    >
      <IconAccordion />
      <h3>{{ title }}</h3>
    </div>
    <!-- Content -->
    <div
      :class="isOpen ? 'max-h-28' : 'overflow-hidden max-h-0'"
      class="accordion-content px-5 pt-0"
    >
      <p class="text-xs md:text-lg leading-6 pl-9 text-justify">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const isOpen = ref(false);

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};


</script>
<style scoped>
.accordion-content {
  transition: max-height 0.3s ease-out, padding 0.3s ease;
}
</style>