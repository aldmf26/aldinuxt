// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  plugins: [
    { src: '~/plugins/gsap.client.ts', mode: 'client' },
    { src: '~/plugins/lenis.client.ts', mode: 'client' },
  ],

  css: [
    '~/assets/css/themes.css',
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Aldi Fahrizaldi — Web Developer × Music Producer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Crafting digital code & sonic rhythms. Web Developer (Nuxt, Laravel, Tailwind) and Music Producer (FL Studio) based in Banjarmasin, Indonesia.' },
        { name: 'theme-color', content: '#080808' },
        { property: 'og:title', content: 'Aldi Fahrizaldi — Web Developer × Music Producer' },
        { property: 'og:description', content: 'Crafting digital code & sonic rhythms.' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  compatibilityDate: '2024-01-01',
})
