<template>
  <div>
    <HeroSection />
    <PlaylistSection />
    <CodeIndex />
    <BeatsSection />
    <ChannelRack />
    <AboutCv />
    <ContactSection />
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
useHead(() => ({
  title: t('meta.homeTitle'),
  htmlAttrs: { lang: locale.value },
  meta: [{ name: 'description', content: t('meta.homeDescription') }],
}))
</script>
