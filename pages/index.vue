<template>
  <div>
    <HeroSection />
    <WorksGrid v-if="side === 'dev'" />
    <BeatsSection v-else />
    <ContactSection />
  </div>
</template>

<script setup>
const { side } = useSide()
const { t, locale } = useI18n()
useHead(() => ({
  title: t('meta.homeTitle'),
  htmlAttrs: { lang: locale.value },
  meta: [{ name: 'description', content: t('meta.homeDescription') }],
}))
</script>
