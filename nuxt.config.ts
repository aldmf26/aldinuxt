// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  i18n: {
    baseUrl: 'https://aldimf.vercel.app', // canonical + hreflang links
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id-ID', file: 'id.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
    ],
    lazy: true,
    restructureDir: false, // keep the v8 layout: i18n/locales + ./i18n.config.ts
    bundle: { optimizeTranslationDirective: false }, // slated for removal in v10
    langDir: 'i18n/locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'aldi_locale',
      alwaysRedirect: false,
      fallbackLocale: 'id',
      redirectOn: 'root',
    },
    vueI18n: './i18n.config.ts',
  },

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
      title: 'Aldi Fahrizaldi - Web Developer & Music Producer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Web developer (Nuxt, Laravel, Tailwind) and music producer (FL Studio) based in Banjarmasin, Indonesia. Building web apps and producing beats.' },
        { name: 'theme-color', content: '#0f0c09' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { property: 'og:title', content: 'Aldi Fahrizaldi - Web Developer x Music Producer' },
        { property: 'og:description', content: 'Web apps for small businesses and trap beats, from Banjarmasin.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://aldimf.vercel.app/og.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Martian+Mono:wght@400;500&display=swap' },
      ],
      script: [
        // paint the saved side + accent before first render so the page never flashes the wrong theme
        { innerHTML: "try{var d=document.documentElement;d.dataset.side=localStorage.getItem('aldi-side')||'dev';d.dataset.accent=localStorage.getItem('aldi-accent')||'oranye'}catch(e){}" },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  compatibilityDate: '2026-06-26',
  ssr: true
})
