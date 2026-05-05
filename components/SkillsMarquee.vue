<template>
  <section class="py-12 md:py-24 overflow-hidden border-y border-text-primary/10">
    <!-- Row 1: Left to Right -->
    <div class="relative mb-4">
      <div class="flex animate-marquee-left whitespace-nowrap">
        <span v-for="n in 4" :key="'r1-' + n" class="marquee-content">
          <span v-for="(item, i) in row1Items" :key="i" class="inline-flex items-center">
            <span class="font-mono uppercase tracking-wider text-marquee">{{ item }}</span>
            <span class="mx-6 text-lime text-lg">·</span>
          </span>
        </span>
      </div>
    </div>

    <!-- Row 2: Right to Left, slight offset -->
    <div class="relative mt-2 -translate-y-1">
      <div class="flex animate-marquee-right whitespace-nowrap">
        <span v-for="n in 4" :key="'r2-' + n" class="marquee-content">
          <span v-for="(item, i) in row2Items" :key="i" class="inline-flex items-center">
            <span class="font-mono uppercase tracking-wider text-marquee text-text-muted">{{ item }}</span>
            <span class="mx-6 text-lime/60 text-lg">·</span>
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
const row1Items = ['Web Developer', 'Nuxt JS', 'Laravel', 'MySQL', 'Docker', 'Tailwind', 'Git']
const row2Items = ['Music Producer', 'FL Studio', 'Mixing', 'Sound Design', 'Beatmaker', 'Composing']
</script>

<style scoped>
.text-marquee {
  font-size: clamp(14px, 2vw, 22px);
}

.marquee-content {
  display: inline-flex;
  flex-shrink: 0;
}
</style>
