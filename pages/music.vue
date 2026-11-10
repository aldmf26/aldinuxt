<template>
  <div class="music-page">
    <div class="wrap top">
      <NuxtLink :to="localePath('/')" class="btn"><span>← {{ $t('musicPage.back') }}</span></NuxtLink>
      <h1 class="sr-only">{{ $t('music.title') }} · Aldi Fahrizaldi</h1>
    </div>
    <BeatsSection />
    <ContactSection />
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()
useHead(() => ({
  title: `${t('music.title')} · Aldi Fahrizaldi`,
  meta: [{ name: 'description', content: t('music.description') }],
}))
</script>

<style scoped>
.top { padding-top: calc(var(--bar-h) + 32px); }
</style>
