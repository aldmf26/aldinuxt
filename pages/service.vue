<template>
  <div class="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-6 md:px-16">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="mb-24">
        <span class="section-label block mb-6">{{ $t('service.label') }}</span>
        <h1 class="font-display italic text-text-primary leading-tight mb-8" style="font-size: clamp(64px, 10vw, 120px)">
          {{ $t('service.title') }}
        </h1>
        <p class="text-text-muted font-body text-xl md:text-2xl max-w-3xl leading-relaxed">
          {{ $t('service.intro') }}
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div v-for="(service, index) in services" :key="index" class="p-10 rounded-[2rem] bg-[var(--bg-surface)] border border-text-primary/10 hover:border-lime/40 transition-all duration-500 group">
          <div class="mb-12">
            <span class="font-mono text-[10px] text-lime uppercase tracking-[0.3em] block mb-4">{{ $t('service.label') }} 0{{ index + 1 }}</span>
            <h3 class="text-3xl font-display italic text-text-primary group-hover:text-lime transition-colors">{{ service.title }}</h3>
          </div>
          
          <div class="space-y-8">
            <div>
              <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-2">{{ $t('service.for') }}</span>
              <p class="text-text-primary/80">{{ service.for }}</p>
            </div>
            <div>
              <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-2">{{ $t('service.includes') }}</span>
              <p class="text-text-primary/80">{{ service.includes }}</p>
            </div>
            <div class="flex justify-between items-end pt-8 border-t border-text-primary/5">
              <div>
                <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-1">{{ $t('service.timeline') }}</span>
                <p class="text-text-primary font-bold">{{ service.timeline }}</p>
              </div>
              <div class="text-right">
                <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-1">{{ $t('service.price') }}</span>
                <p class="text-lime font-bold">{{ service.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="mb-32">
        <h2 class="font-display italic text-5xl text-text-primary mb-16">{{ $t('service.how') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div v-for="(step, index) in steps" :key="index" class="relative">
            <div class="text-7xl font-display italic text-text-primary/5 absolute -top-10 -left-4">{{ index + 1 }}</div>
            <h4 class="text-xl font-bold text-text-primary mb-4 relative z-10">{{ step.title }}</h4>
            <p class="text-text-muted leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="p-16 md:p-32 rounded-[3rem] bg-lime text-dark text-center">
        <h2 class="font-display italic text-6xl md:text-8xl mb-12">{{ $t('service.ready') }}</h2>
        <div class="flex flex-col items-center gap-8">
          <a 
            href="https://wa.me/6289541311053?text=Hey+Aldi,+I+got+a+project+idea" 
            class="px-12 py-6 bg-dark text-lime rounded-full font-mono text-sm uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {{ $t('service.whatsapp') }}
          </a>
          <p class="font-mono text-sm uppercase tracking-widest opacity-60">{{ $t('service.email') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, rt, locale } = useI18n()
const services = computed(() => tm('service.services').map(item => ({
  title: rt(item.title),
  for: rt(item.for),
  includes: rt(item.includes),
  timeline: rt(item.timeline),
  price: rt(item.price),
})))
const steps = computed(() => tm('service.steps').map(item => ({
  title: rt(item.title),
  desc: rt(item.desc),
})))

useHead(() => ({
  title: t('meta.serviceTitle'),
  htmlAttrs: { lang: locale.value },
  meta: [{ name: 'description', content: t('meta.serviceDescription') }],
}))
</script>
