<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { restore } = useSide()
onMounted(restore)

// lang, canonical, hreflang (id/en) and og:locale for every page
const head = useLocaleHead({ seo: true })
useHead(() => ({ htmlAttrs: { lang: head.value.htmlAttrs?.lang }, link: head.value.link, meta: head.value.meta }))
</script>

<style>
html, body {
  background-color: var(--bg-primary);
  margin: 0;
  padding: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
