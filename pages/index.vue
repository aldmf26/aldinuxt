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
const { t } = useI18n()
useHead(() => ({
  title: t('meta.homeTitle'),
  meta: [{ name: 'description', content: t('meta.homeDescription') }],
}))
</script>
