<template>
  <div class="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-6 md:px-16">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header -->
      <div class="mb-24">
        <span class="section-label block mb-6">Service</span>
        <h1 class="font-display italic text-text-primary leading-tight mb-8" style="font-size: clamp(64px, 10vw, 120px)">
          Let's build something.
        </h1>
        <p class="text-text-muted font-body text-xl md:text-2xl max-w-3xl leading-relaxed">
          I take on freelance web development projects — landing pages, web apps, POS systems, and custom tools. Remote. Fast. No nonsense.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div v-for="(service, index) in services" :key="index" class="p-10 rounded-[2rem] bg-[var(--bg-surface)] border border-text-primary/10 hover:border-lime/40 transition-all duration-500 group">
          <div class="mb-12">
            <span class="font-mono text-[10px] text-lime uppercase tracking-[0.3em] block mb-4">Service 0{{ index + 1 }}</span>
            <h3 class="text-3xl font-display italic text-text-primary group-hover:text-lime transition-colors">{{ service.title }}</h3>
          </div>
          
          <div class="space-y-8">
            <div>
              <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-2">For</span>
              <p class="text-text-primary/80">{{ service.for }}</p>
            </div>
            <div>
              <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-2">Includes</span>
              <p class="text-text-primary/80">{{ service.includes }}</p>
            </div>
            <div class="flex justify-between items-end pt-8 border-t border-text-primary/5">
              <div>
                <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-1">Timeline</span>
                <p class="text-text-primary font-bold">{{ service.timeline }}</p>
              </div>
              <div class="text-right">
                <span class="font-mono text-[10px] text-text-primary/30 uppercase tracking-widest block mb-1">Price</span>
                <p class="text-lime font-bold">{{ service.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="mb-32">
        <h2 class="font-display italic text-5xl text-text-primary mb-16">How it works</h2>
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
        <h2 class="font-display italic text-6xl md:text-8xl mb-12">Ready to start?</h2>
        <div class="flex flex-col items-center gap-8">
          <a 
            href="https://wa.me/6289541311053?text=Hey+Aldi,+I+got+a+project+idea" 
            class="px-12 py-6 bg-dark text-lime rounded-full font-mono text-sm uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Chat on WhatsApp →
          </a>
          <p class="font-mono text-sm uppercase tracking-widest opacity-60">or email aldimf26@gmail.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const services = [
  {
    title: "Landing Page / Company Profile",
    for: "Businesses that need a professional web presence",
    includes: "Design, development, responsive layout, basic SEO setup",
    timeline: "1–2 weeks",
    price: "Starting from Rp 1.500.000"
  },
  {
    title: "Web App / Internal System",
    for: "Businesses that need custom software — POS, inventory, dashboards, management tools",
    includes: "Requirement analysis, full-stack development, database design, user training",
    timeline: "3–8 weeks depending on scope",
    price: "Starting from Rp 5.000.000"
  },
  {
    title: "Beat Licensing / Custom Music",
    for: "Content creators, brands, short films, ads",
    includes: "Non-exclusive license from existing catalog, or custom beat on request",
    timeline: "3–7 days for custom",
    price: "Contact for pricing"
  }
]

const steps = [
  { title: "Chat", desc: "Tell me what you need via WhatsApp. Free, no commitment." },
  { title: "Proposal", desc: "I'll send you a clear scope, timeline, and price. No surprises." },
  { title: "Build", desc: "I keep you updated every 2–3 days. You always know where we are." },
  { title: "Launch", desc: "Deploy, test, hand over. Includes 30 days of post-launch support." }
]

useHead({
  title: 'Hire Me — Aldi Fahrizaldi',
  meta: [
    { name: 'description', content: 'Let\'s build something. I take on freelance web development projects — landing pages, web apps, POS systems, and custom tools.' },
  ],
})
</script>
